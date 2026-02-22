import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Int "mo:core/Int";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import OutCall "http-outcalls/outcall";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type Size = {
    #S;
    #M;
    #L;
    #XL;
    #XXL;
    #XXXL;
    #XXXXL;
    #XXXXXL;
  };
  public type Color = Text;

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    images : [Storage.ExternalBlob];
    sizes : [Size];
    colors : [Color];
    categoryId : Text;
    weight : Nat;
  };

  public type Category = {
    id : Text;
    name : Text;
    order : Nat;
  };

  public type ShippingOption = {
    name : Text;
    basePrice : Nat;
    itemPrice : Nat;
  };

  public type Address = {
    name : Text;
    street : Text;
    city : Text;
    state : Text;
    zip : Text;
    country : Text;
  };

  public type Order = {
    id : Text;
    userId : Principal;
    products : [Product];
    total : Nat;
    shippingAddress : Address;
    shippingOption : ShippingOption;
    status : Text;
    timestamp : Int;
    printifyCost : ?Nat;
  };

  public type ContactForm = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  // New types for hero section and social links
  public type HeroSection = {
    image : ?Storage.ExternalBlob;
    headline : Text;
    tagline : Text;
  };

  public type SocialLinks = {
    youtube : Text;
    instagram : Text;
    tiktok : Text;
    twitch : Text;
    kick : Text;
  };

  // Storage
  let products = Map.empty<Text, Product>();
  let categories = Map.empty<Text, Category>();
  let orders = Map.empty<Text, Order>();
  let contactForms = Map.empty<Text, ContactForm>();

  var heroSection : ?HeroSection = null;
  var socialLinks : ?SocialLinks = null;

  // Categories
  public shared ({ caller }) func addCategory(category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };
    categories.add(category.id, category);
  };

  public shared ({ caller }) func updateCategory(category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };
    categories.add(category.id, category);
  };

  public shared ({ caller }) func deleteCategory(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };
    categories.remove(id);
  };

  public query func getCategories() : async [Category] {
    categories.values().toArray();
  };

  // Products
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(id);
  };

  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public shared func calculateShipping(destination : Text, productList : [Product]) : async Nat {
    let weight = productList.foldLeft(0, func(acc, p) { acc + p.weight });

    let shipping : Nat = switch (destination) {
      case ("US") { 399 + productList.size() * 209 };
      case ("Canada") { 939 + productList.size() * 439 };
      case ("Australia") { 1249 + productList.size() * 499 };
      case (_) { 1000 + productList.size() * 400 };
    };

    shipping;
  };

  // Orders
  public shared ({ caller }) func createOrder(productList : [Product], total : Nat, shippingAddress : Address, shippingOption : ShippingOption) : async ?Order {
    let order : Order = {
      id = "ORDER-" # (orders.size() + 1).toText();
      userId = caller;
      products = productList;
      total;
      shippingAddress;
      shippingOption;
      status = "pending";
      timestamp = Time.now();
      printifyCost = null;
    };
    orders.add(order.id, order);
    ?order;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (?order) {
        let updatedOrder : Order = {
          id = order.id;
          userId = order.userId;
          products = order.products;
          total = order.total;
          shippingAddress = order.shippingAddress;
          shippingOption = order.shippingOption;
          status;
          timestamp = order.timestamp;
          printifyCost = order.printifyCost;
        };
        orders.add(orderId, updatedOrder);
      };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public shared ({ caller }) func updateOrderCost(orderId : Text, cost : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order costs");
    };

    switch (orders.get(orderId)) {
      case (?order) {
        let updatedOrder : Order = {
          id = order.id;
          userId = order.userId;
          products = order.products;
          total = order.total;
          shippingAddress = order.shippingAddress;
          shippingOption = order.shippingOption;
          status = order.status;
          timestamp = order.timestamp;
          printifyCost = ?cost;
        };
        orders.add(orderId, updatedOrder);
      };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func getOrder(id : Text) : async ?Order {
    switch (orders.get(id)) {
      case (?order) {
        if (order.userId == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  // Contact Forms
  public shared func submitContactForm(form : ContactForm) : async () {
    contactForms.add(form.timestamp.toText(), form);
  };

  public query ({ caller }) func getContactForms() : async [ContactForm] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact forms");
    };
    contactForms.values().toArray();
  };

  // Stripe Integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    stripeConfig := ?config;
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?config) { config };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  // New admin-only endpoints for hero section and social links
  public shared ({ caller }) func setHeroSection(section : HeroSection) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update the hero section");
    };
    heroSection := ?section;
  };

  public query func getHeroSection() : async ?HeroSection {
    heroSection;
  };

  public shared ({ caller }) func setSocialLinks(links : SocialLinks) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update social links");
    };
    socialLinks := ?links;
  };

  public query func getSocialLinks() : async ?SocialLinks {
    socialLinks;
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};
