import Map "mo:core/Map";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

module {
  type Size = {
    #S;
    #M;
    #L;
    #XL;
    #XXL;
    #XXXL;
    #XXXXL;
    #XXXXXL;
  };

  type Color = Text;
  type Product = {
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
  };

  type Category = {
    id : Text;
    name : Text;
    description : Text;
    order : Nat;
  };

  type ShippingOption = {
    name : Text;
    basePrice : Nat;
    itemPrice : Nat;
  };

  type ShippingRates = {
    usStandard : Nat;
    usExpress : Nat;
    usOvernight : Nat;
    canada : Nat;
    australia : Nat;
    restOfWorld : Nat;
  };

  type Address = {
    name : Text;
    street : Text;
    city : Text;
    state : Text;
    zip : Text;
    country : Text;
  };

  type LegacyOrder = {
    id : Text;
    userId : Principal;
    products : [Product];
    total : Nat;
    shippingAddress : Address;
    shippingOption : ShippingOption;
    status : Text;
    timestamp : Int.Int;
    printifyCost : ?Nat;
  };

  type ContactForm = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int.Int;
  };

  type HeroSection = {
    image : ?Storage.ExternalBlob;
    headline : Text;
    tagline : Text;
  };

  type SocialLinks = {
    youtube : Text;
    instagram : Text;
    tiktok : Text;
    twitch : Text;
    kick : Text;
  };

  type UserProfile = {
    name : Text;
    email : Text;
  };

  type NewsletterSubscriber = {
    email : Text;
    signupDate : Int.Int;
  };

  type ShippingRatesLegacy = {
    usStandard : Nat;
    usExpress : Nat;
    usOvernight : Nat;
    canada : Nat;
    australia : Nat;
    restOfWorld : Nat;
  };

  // Legacy Actor State
  type OldActor = {
    products : Map.Map<Text, Product>;
    categories : Map.Map<Text, Category>;
    orders : Map.Map<Text, LegacyOrder>;
    contactForms : Map.Map<Text, ContactForm>;
    userProfiles : Map.Map<Principal, UserProfile>;
    newsletterSubscribers : Map.Map<Text, NewsletterSubscriber>;
    heroSection : ?HeroSection;
    socialLinks : ?SocialLinks;
    shippingRates : ShippingRatesLegacy;
  };

  // New Product type with status field
  type ProductStatus = {
    #available;
    #soldOut;
    #hidden;
  };

  type NewProduct = {
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

  type NewOrder = {
    id : Text;
    userId : Principal;
    products : [NewProduct];
    total : Nat;
    shippingAddress : Address;
    shippingOption : ShippingOption;
    status : Text;
    timestamp : Int.Int;
    printifyCost : ?Nat;
  };

  type NewActor = {
    products : Map.Map<Text, NewProduct>;
    categories : Map.Map<Text, Category>;
    orders : Map.Map<Text, NewOrder>;
    contactForms : Map.Map<Text, ContactForm>;
    userProfiles : Map.Map<Principal, UserProfile>;
    newsletterSubscribers : Map.Map<Text, NewsletterSubscriber>;
    heroSection : ?HeroSection;
    socialLinks : ?SocialLinks;
    shippingRates : ShippingRates;
    announcementBanner : ?{ message : Text; enabled : Bool };
  };

  public func run(old : OldActor) : NewActor {
    // Migrate products with default status
    let newProducts = old.products.map<Text, Product, NewProduct>(
      func(_id, legacyProduct) {
        {
          legacyProduct with
          status = #available; // Default all legacy products to available
        };
      }
    );

    // Migrate orders to use new product schema
    let newOrders = old.orders.map<Text, LegacyOrder, NewOrder>(
      func(_id, legacyOrder) {
        {
          legacyOrder with
          products = legacyOrder.products.map(
            func(legacyProduct) {
              {
                legacyProduct with
                status = #available; // Default legacy products in orders to available
              };
            }
          );
        };
      }
    );

    {
      old with
      products = newProducts;
      orders = newOrders;
      announcementBanner = null; // No existing legacy banner, so set as null
    };
  };
};
