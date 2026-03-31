import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Error "mo:core/Error";
import List "mo:core/List";
import OutCall "../http-outcalls/outcall";

module {
  public type StripeConfiguration = {
    secretKey : Text;
    allowedCountries : [Text];
  };

  public type ShoppingItem = {
    currency : Text;
    productName : Text;
    productDescription : Text;
    priceInCents : Nat;
    quantity : Nat;
  };

  // IMPORTANT: Do NOT change allCountriesParams. This is a static string using empty bracket [] notation
  // per Stripe docs. Do NOT use a loop with [0] index — that causes only the last country (Zimbabwe) to
  // be sent, breaking shipping address collection. This static string is the permanent fix.
  let allCountriesParams : Text = "shipping_address_collection[allowed_countries][]=AC&shipping_address_collection[allowed_countries][]=AD&shipping_address_collection[allowed_countries][]=AE&shipping_address_collection[allowed_countries][]=AF&shipping_address_collection[allowed_countries][]=AG&shipping_address_collection[allowed_countries][]=AI&shipping_address_collection[allowed_countries][]=AL&shipping_address_collection[allowed_countries][]=AM&shipping_address_collection[allowed_countries][]=AO&shipping_address_collection[allowed_countries][]=AQ&shipping_address_collection[allowed_countries][]=AR&shipping_address_collection[allowed_countries][]=AT&shipping_address_collection[allowed_countries][]=AU&shipping_address_collection[allowed_countries][]=AW&shipping_address_collection[allowed_countries][]=AX&shipping_address_collection[allowed_countries][]=AZ&shipping_address_collection[allowed_countries][]=BA&shipping_address_collection[allowed_countries][]=BB&shipping_address_collection[allowed_countries][]=BD&shipping_address_collection[allowed_countries][]=BE&shipping_address_collection[allowed_countries][]=BF&shipping_address_collection[allowed_countries][]=BG&shipping_address_collection[allowed_countries][]=BH&shipping_address_collection[allowed_countries][]=BI&shipping_address_collection[allowed_countries][]=BJ&shipping_address_collection[allowed_countries][]=BL&shipping_address_collection[allowed_countries][]=BM&shipping_address_collection[allowed_countries][]=BN&shipping_address_collection[allowed_countries][]=BO&shipping_address_collection[allowed_countries][]=BQ&shipping_address_collection[allowed_countries][]=BR&shipping_address_collection[allowed_countries][]=BS&shipping_address_collection[allowed_countries][]=BT&shipping_address_collection[allowed_countries][]=BV&shipping_address_collection[allowed_countries][]=BW&shipping_address_collection[allowed_countries][]=BY&shipping_address_collection[allowed_countries][]=BZ&shipping_address_collection[allowed_countries][]=CA&shipping_address_collection[allowed_countries][]=CD&shipping_address_collection[allowed_countries][]=CF&shipping_address_collection[allowed_countries][]=CG&shipping_address_collection[allowed_countries][]=CH&shipping_address_collection[allowed_countries][]=CI&shipping_address_collection[allowed_countries][]=CK&shipping_address_collection[allowed_countries][]=CL&shipping_address_collection[allowed_countries][]=CM&shipping_address_collection[allowed_countries][]=CN&shipping_address_collection[allowed_countries][]=CO&shipping_address_collection[allowed_countries][]=CR&shipping_address_collection[allowed_countries][]=CV&shipping_address_collection[allowed_countries][]=CW&shipping_address_collection[allowed_countries][]=CY&shipping_address_collection[allowed_countries][]=CZ&shipping_address_collection[allowed_countries][]=DE&shipping_address_collection[allowed_countries][]=DJ&shipping_address_collection[allowed_countries][]=DK&shipping_address_collection[allowed_countries][]=DM&shipping_address_collection[allowed_countries][]=DO&shipping_address_collection[allowed_countries][]=DZ&shipping_address_collection[allowed_countries][]=EC&shipping_address_collection[allowed_countries][]=EE&shipping_address_collection[allowed_countries][]=EG&shipping_address_collection[allowed_countries][]=EH&shipping_address_collection[allowed_countries][]=ER&shipping_address_collection[allowed_countries][]=ES&shipping_address_collection[allowed_countries][]=ET&shipping_address_collection[allowed_countries][]=FI&shipping_address_collection[allowed_countries][]=FJ&shipping_address_collection[allowed_countries][]=FK&shipping_address_collection[allowed_countries][]=FO&shipping_address_collection[allowed_countries][]=FR&shipping_address_collection[allowed_countries][]=GA&shipping_address_collection[allowed_countries][]=GB&shipping_address_collection[allowed_countries][]=GD&shipping_address_collection[allowed_countries][]=GE&shipping_address_collection[allowed_countries][]=GF&shipping_address_collection[allowed_countries][]=GG&shipping_address_collection[allowed_countries][]=GH&shipping_address_collection[allowed_countries][]=GI&shipping_address_collection[allowed_countries][]=GL&shipping_address_collection[allowed_countries][]=GM&shipping_address_collection[allowed_countries][]=GN&shipping_address_collection[allowed_countries][]=GP&shipping_address_collection[allowed_countries][]=GQ&shipping_address_collection[allowed_countries][]=GR&shipping_address_collection[allowed_countries][]=GS&shipping_address_collection[allowed_countries][]=GT&shipping_address_collection[allowed_countries][]=GU&shipping_address_collection[allowed_countries][]=GW&shipping_address_collection[allowed_countries][]=GY&shipping_address_collection[allowed_countries][]=HK&shipping_address_collection[allowed_countries][]=HN&shipping_address_collection[allowed_countries][]=HR&shipping_address_collection[allowed_countries][]=HT&shipping_address_collection[allowed_countries][]=HU&shipping_address_collection[allowed_countries][]=ID&shipping_address_collection[allowed_countries][]=IE&shipping_address_collection[allowed_countries][]=IL&shipping_address_collection[allowed_countries][]=IM&shipping_address_collection[allowed_countries][]=IN&shipping_address_collection[allowed_countries][]=IO&shipping_address_collection[allowed_countries][]=IQ&shipping_address_collection[allowed_countries][]=IS&shipping_address_collection[allowed_countries][]=IT&shipping_address_collection[allowed_countries][]=JE&shipping_address_collection[allowed_countries][]=JM&shipping_address_collection[allowed_countries][]=JO&shipping_address_collection[allowed_countries][]=JP&shipping_address_collection[allowed_countries][]=KE&shipping_address_collection[allowed_countries][]=KG&shipping_address_collection[allowed_countries][]=KH&shipping_address_collection[allowed_countries][]=KI&shipping_address_collection[allowed_countries][]=KM&shipping_address_collection[allowed_countries][]=KN&shipping_address_collection[allowed_countries][]=KR&shipping_address_collection[allowed_countries][]=KW&shipping_address_collection[allowed_countries][]=KY&shipping_address_collection[allowed_countries][]=KZ&shipping_address_collection[allowed_countries][]=LA&shipping_address_collection[allowed_countries][]=LB&shipping_address_collection[allowed_countries][]=LC&shipping_address_collection[allowed_countries][]=LI&shipping_address_collection[allowed_countries][]=LK&shipping_address_collection[allowed_countries][]=LR&shipping_address_collection[allowed_countries][]=LS&shipping_address_collection[allowed_countries][]=LT&shipping_address_collection[allowed_countries][]=LU&shipping_address_collection[allowed_countries][]=LV&shipping_address_collection[allowed_countries][]=LY&shipping_address_collection[allowed_countries][]=MA&shipping_address_collection[allowed_countries][]=MC&shipping_address_collection[allowed_countries][]=MD&shipping_address_collection[allowed_countries][]=ME&shipping_address_collection[allowed_countries][]=MF&shipping_address_collection[allowed_countries][]=MG&shipping_address_collection[allowed_countries][]=MK&shipping_address_collection[allowed_countries][]=ML&shipping_address_collection[allowed_countries][]=MM&shipping_address_collection[allowed_countries][]=MN&shipping_address_collection[allowed_countries][]=MO&shipping_address_collection[allowed_countries][]=MQ&shipping_address_collection[allowed_countries][]=MR&shipping_address_collection[allowed_countries][]=MS&shipping_address_collection[allowed_countries][]=MT&shipping_address_collection[allowed_countries][]=MU&shipping_address_collection[allowed_countries][]=MV&shipping_address_collection[allowed_countries][]=MW&shipping_address_collection[allowed_countries][]=MX&shipping_address_collection[allowed_countries][]=MY&shipping_address_collection[allowed_countries][]=MZ&shipping_address_collection[allowed_countries][]=NA&shipping_address_collection[allowed_countries][]=NC&shipping_address_collection[allowed_countries][]=NE&shipping_address_collection[allowed_countries][]=NG&shipping_address_collection[allowed_countries][]=NI&shipping_address_collection[allowed_countries][]=NL&shipping_address_collection[allowed_countries][]=NO&shipping_address_collection[allowed_countries][]=NP&shipping_address_collection[allowed_countries][]=NR&shipping_address_collection[allowed_countries][]=NU&shipping_address_collection[allowed_countries][]=NZ&shipping_address_collection[allowed_countries][]=OM&shipping_address_collection[allowed_countries][]=PA&shipping_address_collection[allowed_countries][]=PE&shipping_address_collection[allowed_countries][]=PF&shipping_address_collection[allowed_countries][]=PG&shipping_address_collection[allowed_countries][]=PH&shipping_address_collection[allowed_countries][]=PK&shipping_address_collection[allowed_countries][]=PL&shipping_address_collection[allowed_countries][]=PM&shipping_address_collection[allowed_countries][]=PN&shipping_address_collection[allowed_countries][]=PR&shipping_address_collection[allowed_countries][]=PS&shipping_address_collection[allowed_countries][]=PT&shipping_address_collection[allowed_countries][]=PW&shipping_address_collection[allowed_countries][]=PY&shipping_address_collection[allowed_countries][]=QA&shipping_address_collection[allowed_countries][]=RE&shipping_address_collection[allowed_countries][]=RO&shipping_address_collection[allowed_countries][]=RS&shipping_address_collection[allowed_countries][]=RU&shipping_address_collection[allowed_countries][]=RW&shipping_address_collection[allowed_countries][]=SA&shipping_address_collection[allowed_countries][]=SB&shipping_address_collection[allowed_countries][]=SC&shipping_address_collection[allowed_countries][]=SE&shipping_address_collection[allowed_countries][]=SG&shipping_address_collection[allowed_countries][]=SH&shipping_address_collection[allowed_countries][]=SI&shipping_address_collection[allowed_countries][]=SJ&shipping_address_collection[allowed_countries][]=SK&shipping_address_collection[allowed_countries][]=SL&shipping_address_collection[allowed_countries][]=SM&shipping_address_collection[allowed_countries][]=SN&shipping_address_collection[allowed_countries][]=SO&shipping_address_collection[allowed_countries][]=SR&shipping_address_collection[allowed_countries][]=SS&shipping_address_collection[allowed_countries][]=ST&shipping_address_collection[allowed_countries][]=SV&shipping_address_collection[allowed_countries][]=SX&shipping_address_collection[allowed_countries][]=SZ&shipping_address_collection[allowed_countries][]=TA&shipping_address_collection[allowed_countries][]=TC&shipping_address_collection[allowed_countries][]=TD&shipping_address_collection[allowed_countries][]=TF&shipping_address_collection[allowed_countries][]=TG&shipping_address_collection[allowed_countries][]=TH&shipping_address_collection[allowed_countries][]=TJ&shipping_address_collection[allowed_countries][]=TK&shipping_address_collection[allowed_countries][]=TL&shipping_address_collection[allowed_countries][]=TM&shipping_address_collection[allowed_countries][]=TN&shipping_address_collection[allowed_countries][]=TO&shipping_address_collection[allowed_countries][]=TR&shipping_address_collection[allowed_countries][]=TT&shipping_address_collection[allowed_countries][]=TV&shipping_address_collection[allowed_countries][]=TW&shipping_address_collection[allowed_countries][]=TZ&shipping_address_collection[allowed_countries][]=UA&shipping_address_collection[allowed_countries][]=UG&shipping_address_collection[allowed_countries][]=US&shipping_address_collection[allowed_countries][]=UY&shipping_address_collection[allowed_countries][]=UZ&shipping_address_collection[allowed_countries][]=VA&shipping_address_collection[allowed_countries][]=VC&shipping_address_collection[allowed_countries][]=VE&shipping_address_collection[allowed_countries][]=VG&shipping_address_collection[allowed_countries][]=VN&shipping_address_collection[allowed_countries][]=VU&shipping_address_collection[allowed_countries][]=WF&shipping_address_collection[allowed_countries][]=WS&shipping_address_collection[allowed_countries][]=XK&shipping_address_collection[allowed_countries][]=YE&shipping_address_collection[allowed_countries][]=YT&shipping_address_collection[allowed_countries][]=ZA&shipping_address_collection[allowed_countries][]=ZM&shipping_address_collection[allowed_countries][]=ZW";

  public func createCheckoutSession(configuration : StripeConfiguration, caller : Principal, items : [ShoppingItem], successUrl : Text, cancelUrl : Text, transform : OutCall.Transform) : async Text {
    let requestBody = buildCheckoutSessionBody(items, successUrl, cancelUrl, ?caller.toText());
    try {
      await callStripe(configuration, "v1/checkout/sessions", #post, ?requestBody, transform);
    } catch (error) {
      Runtime.trap("Failed to create checkout session: " # error.message());
    };
  };

  public type StripeSessionStatus = {
    #failed : { error : Text };
    #completed : { response : Text; userPrincipal : ?Text };
  };

  public func getSessionStatus(configuration : StripeConfiguration, sessionId : Text, transform : OutCall.Transform) : async StripeSessionStatus {
    try {
      let reply = await callStripe(configuration, "v1/checkout/sessions/" # sessionId, #get, null, transform);
      if (reply.contains(#text "\"error\"")) {
        #failed({ error = "Stripe API error" });
      } else {
        let extractedPrincipal = extractClientReferenceId(reply);
        #completed({ response = reply; userPrincipal = extractedPrincipal });
      };
    } catch (error) {
      #failed({ error = error.message() });
    };
  };

  func callStripe(configuration : StripeConfiguration, endpoint : Text, method : { #get; #post }, body : ?Text, transform : OutCall.Transform) : async Text {
    var headers = [
      {
        name = "authorization";
        value = "Bearer " # configuration.secretKey;
      },
      {
        name = "content-type";
        value = if (method == #get) { "application/json" } else {
          "application/x-www-form-urlencoded";
        };
      },
    ];
    let url = "https://api.stripe.com/" # endpoint;
    switch (method) {
      case (#get) {
        switch (body) {
          case (?_) { Runtime.trap("HTTP GET does not support a HTTP body") };
          case (null) {};
        };
        await OutCall.httpGetRequest(url, headers, transform);
      };
      case (#post) {
        let postBody = switch (body) {
          case (?rawBody) { rawBody };
          case (null) { Runtime.trap("HTTP POST requires a HTTP body") };
        };
        await OutCall.httpPostRequest(url, headers, postBody, transform);
      };
    };
  };

  func urlEncode(text : Text) : Text {
    text.replace(#char ' ', "%20").replace(#char '&', "%26").replace(#char '=', "%3D");
  };

  func buildCheckoutSessionBody(items : [ShoppingItem], successUrl : Text, cancelUrl : Text, clientReferenceId : ?Text) : Text {
    let params = List.empty<Text>();
    var index = 0;
    for (item in items.vals()) {
      let indexText = index.toText();
      params.add("line_items[" # indexText # "][price_data][currency]=" # urlEncode(item.currency));
      params.add("line_items[" # indexText # "][price_data][product_data][name]=" # urlEncode(item.productName));
      params.add("line_items[" # indexText # "][price_data][product_data][description]=" # urlEncode(item.productDescription));
      params.add("line_items[" # indexText # "][price_data][unit_amount]=" # item.priceInCents.toText());
      params.add("line_items[" # indexText # "][quantity]=" # item.quantity.toText());
      index += 1;
    };
    params.add("mode=payment");
    params.add("success_url=" # urlEncode(successUrl));
    params.add("cancel_url=" # urlEncode(cancelUrl));
    params.add("billing_address_collection=required");
    params.add("phone_number_collection[enabled]=true");
    switch (clientReferenceId) {
      case (?id) { params.add("client_reference_id=" # urlEncode(id)) };
      case (null) {};
    };
    // Append static country list using [] notation (NOT [0]) — do not change this
    params.values().join("&") # "&" # allCountriesParams;
  };

  func extractClientReferenceId(jsonText : Text) : ?Text {
    let patterns = ["\"client_reference_id\":\"", "\"client_reference_id\": \""];
    for (pattern in patterns.values()) {
      if (jsonText.contains(#text pattern)) {
        let parts = jsonText.split(#text pattern);
        switch (parts.next()) {
          case (null) {};
          case (?_) {
            switch (parts.next()) {
              case (?afterPattern) {
                switch (afterPattern.split(#text "\"").next()) {
                  case (?value) {
                    if (value.size() > 0) {
                      return ?value;
                    };
                  };
                  case (_) {};
                };
              };
              case (null) {};
            };
          };
        };
      };
    };
    null;
  };
};
