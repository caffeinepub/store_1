import Storage "mo:caffeineai-object-storage/Storage";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Stripe "mo:caffeineai-stripe/stripe";
import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import OutCall "mo:caffeineai-http-outcalls/outcall";



actor {
  include MixinObjectStorage();
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

  public type ProductStatus = {
    #available;
    #soldOut;
    #hidden;
  };

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
    order : Nat;
    featured : Bool;
    status : ProductStatus;
  };

  public type Category = {
    id : Text;
    name : Text;
    description : Text;
    order : Nat;
  };

  public type ShippingOption = {
    name : Text;
    basePrice : Nat;
    itemPrice : Nat;
  };

  // Legacy stable type kept for upgrade compatibility — do not remove
  type ShippingRates_v1 = {
    usStandard : Nat;
    usExpress : Nat;
    usOvernight : Nat;
    canada : Nat;
    australia : Nat;
    restOfWorld : Nat;
  };

  // Current per-item shipping rates type
  public type ShippingRates = {
    usEconomyBase : Nat;
    usEconomyPerItem : Nat;
    usStandardBase : Nat;
    usStandardPerItem : Nat;
    usExpressBase : Nat;
    usExpressPerItem : Nat;
    canadaBase : Nat;
    canadaPerItem : Nat;
    australiaBase : Nat;
    australiaPerItem : Nat;
    restOfWorldBase : Nat;
    restOfWorldPerItem : Nat;
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

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type NewsletterSubscriber = {
    email : Text;
    signupDate : Int;
  };

  public type AnnouncementBanner = {
    message : Text;
    enabled : Bool;
  };

  // Comprehensive list of Stripe-supported shipping countries
  let allShippingCountries : [Text] = [
    "AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AT",
    "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI",
    "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY",
    "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO",
    "CR", "CV", "CW", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC",
    "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FO", "FR", "GA",
    "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ",
    "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HN", "HR", "HT", "HU", "ID",
    "IE", "IL", "IM", "IN", "IO", "IQ", "IS", "IT", "JE", "JM", "JO", "JP",
    "KE", "KG", "KH", "KI", "KM", "KN", "KR", "KW", "KY", "KZ", "LA", "LB",
    "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD",
    "ME", "MF", "MG", "MK", "ML", "MM", "MN", "MO", "MQ", "MR", "MS", "MT",
    "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NG", "NI", "NL",
    "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK",
    "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS",
    "RU", "RW", "SA", "SB", "SC", "SE", "SG", "SH", "SI", "SJ", "SK", "SL",
    "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SZ", "TA", "TC", "TD",
    "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV",
    "TW", "TZ", "UA", "UG", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VN",
    "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"
  ];

  // Storage
  let products = Map.empty<Text, Product>();
  let categories = Map.empty<Text, Category>();
  let orders = Map.empty<Text, Order>();
  let contactForms = Map.empty<Text, ContactForm>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let newsletterSubscribers = Map.empty<Text, NewsletterSubscriber>();
  // Separate stable map for bullet points — avoids breaking Product stable type
  let productBulletPoints = Map.empty<Text, [Text]>();

  var heroSection : ?HeroSection = null;
  var socialLinks : ?SocialLinks = null;

  // Legacy stable variable — kept to satisfy upgrade compatibility checker
  var shippingRates : ShippingRates_v1 = {
    usStandard = 0;
    usExpress = 0;
    usOvernight = 0;
    canada = 0;
    australia = 0;
    restOfWorld = 0;
  };

  // New per-item shipping rates — all active code uses this
  var shippingRatesV2 : ShippingRates = {
    usEconomyBase = 399;
    usEconomyPerItem = 209;
    usStandardBase = 475;
    usStandardPerItem = 240;
    usExpressBase = 799;
    usExpressPerItem = 240;
    canadaBase = 939;
    canadaPerItem = 439;
    australiaBase = 1249;
    australiaPerItem = 499;
    restOfWorldBase = 1000;
    restOfWorldPerItem = 400;
  };

  var announcementBanner : ?AnnouncementBanner = null;

  // AUTHORIZATION HELPERS
  func assertHasAdminPermission(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func assertCallerIsUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can perform this action");
    };
  };

  // User profile endpoints
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Categories
  public shared ({ caller }) func addCategory(category : Category) : async () {
    assertHasAdminPermission(caller);
    categories.add(category.id, category);
  };

  public shared ({ caller }) func updateCategory(category : Category) : async () {
    assertHasAdminPermission(caller);
    categories.add(category.id, category);
  };

  public shared ({ caller }) func deleteCategory(id : Text) : async () {
    assertHasAdminPermission(caller);
    categories.remove(id);
  };

  public shared ({ caller }) func reorderCategories(orderedIds : [Text]) : async () {
    assertHasAdminPermission(caller);
    for ((index, id) in orderedIds.enumerate()) {
      switch (categories.get(id)) {
        case (?category) {
          let updatedCategory : Category = {
            id = category.id;
            name = category.name;
            description = category.description;
            order = index;
          };
          categories.add(id, updatedCategory);
        };
        case (null) { Runtime.trap("Category not found: " # id) };
      };
    };
  };

  public query func getCategories() : async [Category] {
    categories.values().toArray();
  };

  // Products
  public shared ({ caller }) func addProduct(product : Product) : async () {
    assertHasAdminPermission(caller);
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    assertHasAdminPermission(caller);
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    assertHasAdminPermission(caller);
    products.remove(id);
    productBulletPoints.remove(id);
  };

  public shared ({ caller }) func reorderProducts(orderedIds : [Text]) : async () {
    assertHasAdminPermission(caller);
    for ((index, id) in orderedIds.enumerate()) {
      switch (products.get(id)) {
        case (?product) {
          let updatedProduct : Product = {
            id = product.id;
            name = product.name;
            description = product.description;
            price = product.price;
            images = product.images;
            sizes = product.sizes;
            colors = product.colors;
            categoryId = product.categoryId;
            weight = product.weight;
            order = index;
            featured = product.featured;
            status = product.status;
          };
          products.add(id, updatedProduct);
        };
        case (null) { Runtime.trap("Product not found: " # id) };
      };
    };
  };

  public shared ({ caller }) func setProductFeatured(id : Text, featured : Bool) : async () {
    assertHasAdminPermission(caller);
    switch (products.get(id)) {
      case (?product) {
        let updatedProduct : Product = {
          id = product.id;
          name = product.name;
          description = product.description;
          price = product.price;
          images = product.images;
          sizes = product.sizes;
          colors = product.colors;
          categoryId = product.categoryId;
          weight = product.weight;
          order = product.order;
          featured;
          status = product.status;
        };
        products.add(id, updatedProduct);
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public shared ({ caller }) func setProductStatus(id : Text, status : ProductStatus) : async () {
    assertHasAdminPermission(caller);
    switch (products.get(id)) {
      case (?product) {
        let updatedProduct : Product = {
          id = product.id;
          name = product.name;
          description = product.description;
          price = product.price;
          images = product.images;
          sizes = product.sizes;
          colors = product.colors;
          categoryId = product.categoryId;
          weight = product.weight;
          order = product.order;
          featured = product.featured;
          status;
        };
        products.add(id, updatedProduct);
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  // Bullet points — stored separately from Product to preserve stable type compatibility
  public shared ({ caller }) func setProductBulletPoints(id : Text, points : [Text]) : async () {
    assertHasAdminPermission(caller);
    productBulletPoints.add(id, points);
  };

  public query func getProductBulletPoints(id : Text) : async [Text] {
    switch (productBulletPoints.get(id)) {
      case (?points) { points };
      case (null) { [] };
    };
  };

  public query func getAllProductBulletPoints() : async [(Text, [Text])] {
    productBulletPoints.entries().toArray();
  };

  // Calculate shipping cost in cents
  public query func calculateShipping(destination : Text, method : Text, itemCount : Nat) : async Nat {
    let additionalItems : Nat = if (itemCount > 0) { itemCount - 1 } else { 0 };
    switch (destination) {
      case ("US") {
        switch (method) {
          case ("express") {
            shippingRatesV2.usExpressBase + additionalItems * shippingRatesV2.usExpressPerItem;
          };
          case ("standard") {
            shippingRatesV2.usStandardBase + additionalItems * shippingRatesV2.usStandardPerItem;
          };
          case (_) {
            shippingRatesV2.usEconomyBase + additionalItems * shippingRatesV2.usEconomyPerItem;
          };
        };
      };
      case ("CA") {
        shippingRatesV2.canadaBase + additionalItems * shippingRatesV2.canadaPerItem;
      };
      case ("AU") {
        shippingRatesV2.australiaBase + additionalItems * shippingRatesV2.australiaPerItem;
      };
      case (_) {
        shippingRatesV2.restOfWorldBase + additionalItems * shippingRatesV2.restOfWorldPerItem;
      };
    };
  };

  // Orders
  public shared ({ caller }) func createOrder(productList : [Product], total : Nat, shippingAddress : Address, shippingOption : ShippingOption) : async ?Order {
    let orderId = "ORDER-" # (orders.size() + 1001).toText();
    let order : Order = {
      id = orderId;
      userId = caller;
      products = productList;
      total;
      shippingAddress;
      shippingOption;
      status = "pending";
      timestamp = Time.now();
      printifyCost = null;
    };
    orders.add(orderId, order);
    ?order;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : Text) : async () {
    assertHasAdminPermission(caller);
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
    assertHasAdminPermission(caller);
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
        if (AccessControl.isAdmin(accessControlState, caller)) {
          return ?order;
        };
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
          Runtime.trap("Unauthorized: Only authenticated users can view orders");
        };
        if (order.userId == caller) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    assertHasAdminPermission(caller);
    orders.values().toArray();
  };

  // Contact Forms
  public shared func submitContactForm(form : ContactForm) : async () {
    contactForms.add(form.timestamp.toText(), form);
  };

  public query ({ caller }) func getContactForms() : async [ContactForm] {
    assertHasAdminPermission(caller);
    contactForms.values().toArray();
  };

  // Stripe Integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    assertHasAdminPermission(caller);
    stripeConfig := ?config;
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  func getStripeSecretKey() : Text {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?config) { config.secretKey };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func urlEncodeStripe(text : Text) : Text {
    text.replace(#char ' ', "%20").replace(#char '&', "%26").replace(#char '=', "%3D");
  };

  // Build the Stripe checkout session request body manually.
  // CRITICAL: Uses empty-bracket [] notation per Stripe docs for allowed_countries.
  // The caffeineai-stripe library uses [0] for every country (bug), so we bypass it
  // and call the Stripe API directly with correct serialization.
  // DO NOT change [] to [0] in the country params — [0] causes only Zimbabwe to be sent.
  func buildStripeBody(items : [Stripe.ShoppingItem], callerText : Text, successUrl : Text, cancelUrl : Text) : Text {
    let params = List.empty<Text>();

    // Line items
    var index = 0;
    for (item in items.vals()) {
      let i = index.toText();
      params.add("line_items[" # i # "][price_data][currency]=" # urlEncodeStripe(item.currency));
      params.add("line_items[" # i # "][price_data][product_data][name]=" # urlEncodeStripe(item.productName));
      params.add("line_items[" # i # "][price_data][product_data][description]=" # urlEncodeStripe(item.productDescription));
      params.add("line_items[" # i # "][price_data][unit_amount]=" # item.priceInCents.toText());
      params.add("line_items[" # i # "][quantity]=" # item.quantity.toText());
      index += 1;
    };

    // Mode and URLs
    params.add("mode=payment");
    params.add("success_url=" # urlEncodeStripe(successUrl));
    params.add("cancel_url=" # urlEncodeStripe(cancelUrl));
    params.add("client_reference_id=" # urlEncodeStripe(callerText));

    // Billing address — always collect
    params.add("billing_address_collection=required");

    // Phone number — always collect
    params.add("phone_number_collection[enabled]=true");

    // Shipping address — collect for ALL countries using [] notation (not [0]).
    // Each entry appends to the array on Stripe's side. This is the correct format
    // per Stripe docs: shipping_address_collection[allowed_countries][]=US
    // Using [0] for every iteration (as the library does) means only the last country survives.
    for (country in allShippingCountries.vals()) {
      params.add("shipping_address_collection[allowed_countries][]=" # urlEncodeStripe(country));
    };

    params.values().join("&");
  };

  // Custom createCheckoutSession that bypasses the caffeineai-stripe library's broken
  // allowedCountries serialization. Calls Stripe API directly with correct [] notation.
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    let secretKey = getStripeSecretKey();
    let body = buildStripeBody(items, caller.toText(), successUrl, cancelUrl);
    let headers = [
      { name = "authorization"; value = "Bearer " # secretKey },
      { name = "content-type"; value = "application/x-www-form-urlencoded" },
    ];
    try {
      await OutCall.httpPostRequest("https://api.stripe.com/v1/checkout/sessions", headers, body, transform);
    } catch (error) {
      Runtime.trap("Failed to create checkout session: " # error.message());
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    let config : Stripe.StripeConfiguration = {
      secretKey = getStripeSecretKey();
      allowedCountries = [];
    };
    await Stripe.getSessionStatus(config, sessionId, transform);
  };

  // Hero Section and Social Links
  public shared ({ caller }) func setHeroSection(section : HeroSection) : async () {
    assertHasAdminPermission(caller);
    heroSection := ?section;
  };

  public query func getHeroSection() : async ?HeroSection {
    heroSection;
  };

  public shared ({ caller }) func setSocialLinks(links : SocialLinks) : async () {
    assertHasAdminPermission(caller);
    socialLinks := ?links;
  };

  public query func getSocialLinks() : async ?SocialLinks {
    socialLinks;
  };

  // Newsletter
  public shared func subscribeToNewsletter(email : Text) : async () {
    if (newsletterSubscribers.get(email) != null) {
      Runtime.trap("Email already subscribed");
    };
    let subscriber : NewsletterSubscriber = {
      email;
      signupDate = Time.now();
    };
    newsletterSubscribers.add(email, subscriber);
  };

  public query ({ caller }) func getNewsletterSubscribers() : async [NewsletterSubscriber] {
    assertHasAdminPermission(caller);
    newsletterSubscribers.values().toArray();
  };

  // Shipping Rates — uses shippingRatesV2
  public shared ({ caller }) func setShippingRates(rates : ShippingRates) : async () {
    assertHasAdminPermission(caller);
    shippingRatesV2 := rates;
  };

  public query func getShippingRates() : async ShippingRates {
    shippingRatesV2;
  };

  // Announcement Banner
  public shared ({ caller }) func setAnnouncementBanner(banner : AnnouncementBanner) : async () {
    assertHasAdminPermission(caller);
    announcementBanner := ?banner;
  };

  public query func getAnnouncementBanner() : async ?AnnouncementBanner {
    announcementBanner;
  };
};
