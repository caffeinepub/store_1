import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // Type definitions for old and new actor states
  type OldActor = {
    products : Map.Map<Text, { id : Text; name : Text; description : Text; price : Nat; images : [Blob]; sizes : [{ #S; #M; #L; #XL; #XXL; #XXXL; #XXXXL; #XXXXXL }]; colors : [Text]; categoryId : Text; weight : Nat }>;
    categories : Map.Map<Text, { id : Text; name : Text; order : Nat }>;
    orders : Map.Map<Text, { id : Text; userId : Principal; products : [{ id : Text; name : Text; description : Text; price : Nat; images : [Blob]; sizes : [{ #S; #M; #L; #XL; #XXL; #XXXL; #XXXXL; #XXXXXL }]; colors : [Text]; categoryId : Text; weight : Nat }]; total : Nat; shippingAddress : { name : Text; street : Text; city : Text; state : Text; zip : Text; country : Text }; shippingOption : { name : Text; basePrice : Nat; itemPrice : Nat }; status : Text; timestamp : Int; printifyCost : ?Nat }>;
    contactForms : Map.Map<Text, { name : Text; email : Text; message : Text; timestamp : Int }>;
    userProfiles : Map.Map<Principal, { defaultShippingAddress : ?{ name : Text; street : Text; city : Text; state : Text; zip : Text; country : Text }; orderHistory : [Text] }>;
    stripeConfig : ?{ secretKey : Text; allowedCountries : [Text] };
  };

  type NewActor = {
    products : Map.Map<Text, { id : Text; name : Text; description : Text; price : Nat; images : [Blob]; sizes : [{ #S; #M; #L; #XL; #XXL; #XXXL; #XXXXL; #XXXXXL }]; colors : [Text]; categoryId : Text; weight : Nat }>;
    categories : Map.Map<Text, { id : Text; name : Text; order : Nat }>;
    orders : Map.Map<Text, { id : Text; userId : Principal; products : [{ id : Text; name : Text; description : Text; price : Nat; images : [Blob]; sizes : [{ #S; #M; #L; #XL; #XXL; #XXXL; #XXXXL; #XXXXXL }]; colors : [Text]; categoryId : Text; weight : Nat }]; total : Nat; shippingAddress : { name : Text; street : Text; city : Text; state : Text; zip : Text; country : Text }; shippingOption : { name : Text; basePrice : Nat; itemPrice : Nat }; status : Text; timestamp : Int; printifyCost : ?Nat }>;
    contactForms : Map.Map<Text, { name : Text; email : Text; message : Text; timestamp : Int }>;
    stripeConfig : ?{ secretKey : Text; allowedCountries : [Text] };
    heroSection : ?{ image : ?Blob; headline : Text; tagline : Text };
    socialLinks : ?{ youtube : Text; instagram : Text; tiktok : Text; twitch : Text; kick : Text };
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      heroSection = null;
      socialLinks = null;
    };
  };
};
