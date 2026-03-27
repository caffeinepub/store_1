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

  // NOTE: The country list below is intentionally hardcoded with explicit unique indexes.
  // DO NOT replace this with a loop — a loop with a fixed index caused a bug where only
  // the last country (Zimbabwe) was sent to Stripe. Each country MUST have its own index.
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
    // Hardcoded country list — all Stripe-supported shipping countries, each with a unique index.
    // NEVER replace this block with a loop.
    params.add("shipping_address_collection[allowed_countries][0]=AC");
    params.add("shipping_address_collection[allowed_countries][1]=AD");
    params.add("shipping_address_collection[allowed_countries][2]=AE");
    params.add("shipping_address_collection[allowed_countries][3]=AF");
    params.add("shipping_address_collection[allowed_countries][4]=AG");
    params.add("shipping_address_collection[allowed_countries][5]=AI");
    params.add("shipping_address_collection[allowed_countries][6]=AL");
    params.add("shipping_address_collection[allowed_countries][7]=AM");
    params.add("shipping_address_collection[allowed_countries][8]=AO");
    params.add("shipping_address_collection[allowed_countries][9]=AQ");
    params.add("shipping_address_collection[allowed_countries][10]=AR");
    params.add("shipping_address_collection[allowed_countries][11]=AT");
    params.add("shipping_address_collection[allowed_countries][12]=AU");
    params.add("shipping_address_collection[allowed_countries][13]=AW");
    params.add("shipping_address_collection[allowed_countries][14]=AX");
    params.add("shipping_address_collection[allowed_countries][15]=AZ");
    params.add("shipping_address_collection[allowed_countries][16]=BA");
    params.add("shipping_address_collection[allowed_countries][17]=BB");
    params.add("shipping_address_collection[allowed_countries][18]=BD");
    params.add("shipping_address_collection[allowed_countries][19]=BE");
    params.add("shipping_address_collection[allowed_countries][20]=BF");
    params.add("shipping_address_collection[allowed_countries][21]=BG");
    params.add("shipping_address_collection[allowed_countries][22]=BH");
    params.add("shipping_address_collection[allowed_countries][23]=BI");
    params.add("shipping_address_collection[allowed_countries][24]=BJ");
    params.add("shipping_address_collection[allowed_countries][25]=BL");
    params.add("shipping_address_collection[allowed_countries][26]=BM");
    params.add("shipping_address_collection[allowed_countries][27]=BN");
    params.add("shipping_address_collection[allowed_countries][28]=BO");
    params.add("shipping_address_collection[allowed_countries][29]=BQ");
    params.add("shipping_address_collection[allowed_countries][30]=BR");
    params.add("shipping_address_collection[allowed_countries][31]=BS");
    params.add("shipping_address_collection[allowed_countries][32]=BT");
    params.add("shipping_address_collection[allowed_countries][33]=BV");
    params.add("shipping_address_collection[allowed_countries][34]=BW");
    params.add("shipping_address_collection[allowed_countries][35]=BY");
    params.add("shipping_address_collection[allowed_countries][36]=BZ");
    params.add("shipping_address_collection[allowed_countries][37]=CA");
    params.add("shipping_address_collection[allowed_countries][38]=CD");
    params.add("shipping_address_collection[allowed_countries][39]=CF");
    params.add("shipping_address_collection[allowed_countries][40]=CG");
    params.add("shipping_address_collection[allowed_countries][41]=CH");
    params.add("shipping_address_collection[allowed_countries][42]=CI");
    params.add("shipping_address_collection[allowed_countries][43]=CK");
    params.add("shipping_address_collection[allowed_countries][44]=CL");
    params.add("shipping_address_collection[allowed_countries][45]=CM");
    params.add("shipping_address_collection[allowed_countries][46]=CN");
    params.add("shipping_address_collection[allowed_countries][47]=CO");
    params.add("shipping_address_collection[allowed_countries][48]=CR");
    params.add("shipping_address_collection[allowed_countries][49]=CV");
    params.add("shipping_address_collection[allowed_countries][50]=CW");
    params.add("shipping_address_collection[allowed_countries][51]=CY");
    params.add("shipping_address_collection[allowed_countries][52]=CZ");
    params.add("shipping_address_collection[allowed_countries][53]=DE");
    params.add("shipping_address_collection[allowed_countries][54]=DJ");
    params.add("shipping_address_collection[allowed_countries][55]=DK");
    params.add("shipping_address_collection[allowed_countries][56]=DM");
    params.add("shipping_address_collection[allowed_countries][57]=DO");
    params.add("shipping_address_collection[allowed_countries][58]=DZ");
    params.add("shipping_address_collection[allowed_countries][59]=EC");
    params.add("shipping_address_collection[allowed_countries][60]=EE");
    params.add("shipping_address_collection[allowed_countries][61]=EG");
    params.add("shipping_address_collection[allowed_countries][62]=EH");
    params.add("shipping_address_collection[allowed_countries][63]=ER");
    params.add("shipping_address_collection[allowed_countries][64]=ES");
    params.add("shipping_address_collection[allowed_countries][65]=ET");
    params.add("shipping_address_collection[allowed_countries][66]=FI");
    params.add("shipping_address_collection[allowed_countries][67]=FJ");
    params.add("shipping_address_collection[allowed_countries][68]=FK");
    params.add("shipping_address_collection[allowed_countries][69]=FO");
    params.add("shipping_address_collection[allowed_countries][70]=FR");
    params.add("shipping_address_collection[allowed_countries][71]=GA");
    params.add("shipping_address_collection[allowed_countries][72]=GB");
    params.add("shipping_address_collection[allowed_countries][73]=GD");
    params.add("shipping_address_collection[allowed_countries][74]=GE");
    params.add("shipping_address_collection[allowed_countries][75]=GF");
    params.add("shipping_address_collection[allowed_countries][76]=GG");
    params.add("shipping_address_collection[allowed_countries][77]=GH");
    params.add("shipping_address_collection[allowed_countries][78]=GI");
    params.add("shipping_address_collection[allowed_countries][79]=GL");
    params.add("shipping_address_collection[allowed_countries][80]=GM");
    params.add("shipping_address_collection[allowed_countries][81]=GN");
    params.add("shipping_address_collection[allowed_countries][82]=GP");
    params.add("shipping_address_collection[allowed_countries][83]=GQ");
    params.add("shipping_address_collection[allowed_countries][84]=GR");
    params.add("shipping_address_collection[allowed_countries][85]=GS");
    params.add("shipping_address_collection[allowed_countries][86]=GT");
    params.add("shipping_address_collection[allowed_countries][87]=GU");
    params.add("shipping_address_collection[allowed_countries][88]=GW");
    params.add("shipping_address_collection[allowed_countries][89]=GY");
    params.add("shipping_address_collection[allowed_countries][90]=HK");
    params.add("shipping_address_collection[allowed_countries][91]=HN");
    params.add("shipping_address_collection[allowed_countries][92]=HR");
    params.add("shipping_address_collection[allowed_countries][93]=HT");
    params.add("shipping_address_collection[allowed_countries][94]=HU");
    params.add("shipping_address_collection[allowed_countries][95]=ID");
    params.add("shipping_address_collection[allowed_countries][96]=IE");
    params.add("shipping_address_collection[allowed_countries][97]=IL");
    params.add("shipping_address_collection[allowed_countries][98]=IM");
    params.add("shipping_address_collection[allowed_countries][99]=IN");
    params.add("shipping_address_collection[allowed_countries][100]=IO");
    params.add("shipping_address_collection[allowed_countries][101]=IQ");
    params.add("shipping_address_collection[allowed_countries][102]=IS");
    params.add("shipping_address_collection[allowed_countries][103]=IT");
    params.add("shipping_address_collection[allowed_countries][104]=JE");
    params.add("shipping_address_collection[allowed_countries][105]=JM");
    params.add("shipping_address_collection[allowed_countries][106]=JO");
    params.add("shipping_address_collection[allowed_countries][107]=JP");
    params.add("shipping_address_collection[allowed_countries][108]=KE");
    params.add("shipping_address_collection[allowed_countries][109]=KG");
    params.add("shipping_address_collection[allowed_countries][110]=KH");
    params.add("shipping_address_collection[allowed_countries][111]=KI");
    params.add("shipping_address_collection[allowed_countries][112]=KM");
    params.add("shipping_address_collection[allowed_countries][113]=KN");
    params.add("shipping_address_collection[allowed_countries][114]=KR");
    params.add("shipping_address_collection[allowed_countries][115]=KW");
    params.add("shipping_address_collection[allowed_countries][116]=KY");
    params.add("shipping_address_collection[allowed_countries][117]=KZ");
    params.add("shipping_address_collection[allowed_countries][118]=LA");
    params.add("shipping_address_collection[allowed_countries][119]=LB");
    params.add("shipping_address_collection[allowed_countries][120]=LC");
    params.add("shipping_address_collection[allowed_countries][121]=LI");
    params.add("shipping_address_collection[allowed_countries][122]=LK");
    params.add("shipping_address_collection[allowed_countries][123]=LR");
    params.add("shipping_address_collection[allowed_countries][124]=LS");
    params.add("shipping_address_collection[allowed_countries][125]=LT");
    params.add("shipping_address_collection[allowed_countries][126]=LU");
    params.add("shipping_address_collection[allowed_countries][127]=LV");
    params.add("shipping_address_collection[allowed_countries][128]=LY");
    params.add("shipping_address_collection[allowed_countries][129]=MA");
    params.add("shipping_address_collection[allowed_countries][130]=MC");
    params.add("shipping_address_collection[allowed_countries][131]=MD");
    params.add("shipping_address_collection[allowed_countries][132]=ME");
    params.add("shipping_address_collection[allowed_countries][133]=MF");
    params.add("shipping_address_collection[allowed_countries][134]=MG");
    params.add("shipping_address_collection[allowed_countries][135]=MK");
    params.add("shipping_address_collection[allowed_countries][136]=ML");
    params.add("shipping_address_collection[allowed_countries][137]=MM");
    params.add("shipping_address_collection[allowed_countries][138]=MN");
    params.add("shipping_address_collection[allowed_countries][139]=MO");
    params.add("shipping_address_collection[allowed_countries][140]=MQ");
    params.add("shipping_address_collection[allowed_countries][141]=MR");
    params.add("shipping_address_collection[allowed_countries][142]=MS");
    params.add("shipping_address_collection[allowed_countries][143]=MT");
    params.add("shipping_address_collection[allowed_countries][144]=MU");
    params.add("shipping_address_collection[allowed_countries][145]=MV");
    params.add("shipping_address_collection[allowed_countries][146]=MW");
    params.add("shipping_address_collection[allowed_countries][147]=MX");
    params.add("shipping_address_collection[allowed_countries][148]=MY");
    params.add("shipping_address_collection[allowed_countries][149]=MZ");
    params.add("shipping_address_collection[allowed_countries][150]=NA");
    params.add("shipping_address_collection[allowed_countries][151]=NC");
    params.add("shipping_address_collection[allowed_countries][152]=NE");
    params.add("shipping_address_collection[allowed_countries][153]=NG");
    params.add("shipping_address_collection[allowed_countries][154]=NI");
    params.add("shipping_address_collection[allowed_countries][155]=NL");
    params.add("shipping_address_collection[allowed_countries][156]=NO");
    params.add("shipping_address_collection[allowed_countries][157]=NP");
    params.add("shipping_address_collection[allowed_countries][158]=NR");
    params.add("shipping_address_collection[allowed_countries][159]=NU");
    params.add("shipping_address_collection[allowed_countries][160]=NZ");
    params.add("shipping_address_collection[allowed_countries][161]=OM");
    params.add("shipping_address_collection[allowed_countries][162]=PA");
    params.add("shipping_address_collection[allowed_countries][163]=PE");
    params.add("shipping_address_collection[allowed_countries][164]=PF");
    params.add("shipping_address_collection[allowed_countries][165]=PG");
    params.add("shipping_address_collection[allowed_countries][166]=PH");
    params.add("shipping_address_collection[allowed_countries][167]=PK");
    params.add("shipping_address_collection[allowed_countries][168]=PL");
    params.add("shipping_address_collection[allowed_countries][169]=PM");
    params.add("shipping_address_collection[allowed_countries][170]=PN");
    params.add("shipping_address_collection[allowed_countries][171]=PR");
    params.add("shipping_address_collection[allowed_countries][172]=PS");
    params.add("shipping_address_collection[allowed_countries][173]=PT");
    params.add("shipping_address_collection[allowed_countries][174]=PW");
    params.add("shipping_address_collection[allowed_countries][175]=PY");
    params.add("shipping_address_collection[allowed_countries][176]=QA");
    params.add("shipping_address_collection[allowed_countries][177]=RE");
    params.add("shipping_address_collection[allowed_countries][178]=RO");
    params.add("shipping_address_collection[allowed_countries][179]=RS");
    params.add("shipping_address_collection[allowed_countries][180]=RW");
    params.add("shipping_address_collection[allowed_countries][181]=SA");
    params.add("shipping_address_collection[allowed_countries][182]=SB");
    params.add("shipping_address_collection[allowed_countries][183]=SC");
    params.add("shipping_address_collection[allowed_countries][184]=SE");
    params.add("shipping_address_collection[allowed_countries][185]=SG");
    params.add("shipping_address_collection[allowed_countries][186]=SH");
    params.add("shipping_address_collection[allowed_countries][187]=SI");
    params.add("shipping_address_collection[allowed_countries][188]=SJ");
    params.add("shipping_address_collection[allowed_countries][189]=SK");
    params.add("shipping_address_collection[allowed_countries][190]=SL");
    params.add("shipping_address_collection[allowed_countries][191]=SM");
    params.add("shipping_address_collection[allowed_countries][192]=SN");
    params.add("shipping_address_collection[allowed_countries][193]=SO");
    params.add("shipping_address_collection[allowed_countries][194]=SR");
    params.add("shipping_address_collection[allowed_countries][195]=SS");
    params.add("shipping_address_collection[allowed_countries][196]=ST");
    params.add("shipping_address_collection[allowed_countries][197]=SV");
    params.add("shipping_address_collection[allowed_countries][198]=SX");
    params.add("shipping_address_collection[allowed_countries][199]=SZ");
    params.add("shipping_address_collection[allowed_countries][200]=TA");
    params.add("shipping_address_collection[allowed_countries][201]=TC");
    params.add("shipping_address_collection[allowed_countries][202]=TD");
    params.add("shipping_address_collection[allowed_countries][203]=TF");
    params.add("shipping_address_collection[allowed_countries][204]=TG");
    params.add("shipping_address_collection[allowed_countries][205]=TH");
    params.add("shipping_address_collection[allowed_countries][206]=TJ");
    params.add("shipping_address_collection[allowed_countries][207]=TK");
    params.add("shipping_address_collection[allowed_countries][208]=TL");
    params.add("shipping_address_collection[allowed_countries][209]=TM");
    params.add("shipping_address_collection[allowed_countries][210]=TN");
    params.add("shipping_address_collection[allowed_countries][211]=TO");
    params.add("shipping_address_collection[allowed_countries][212]=TR");
    params.add("shipping_address_collection[allowed_countries][213]=TT");
    params.add("shipping_address_collection[allowed_countries][214]=TV");
    params.add("shipping_address_collection[allowed_countries][215]=TW");
    params.add("shipping_address_collection[allowed_countries][216]=TZ");
    params.add("shipping_address_collection[allowed_countries][217]=UA");
    params.add("shipping_address_collection[allowed_countries][218]=UG");
    params.add("shipping_address_collection[allowed_countries][219]=US");
    params.add("shipping_address_collection[allowed_countries][220]=UY");
    params.add("shipping_address_collection[allowed_countries][221]=UZ");
    params.add("shipping_address_collection[allowed_countries][222]=VA");
    params.add("shipping_address_collection[allowed_countries][223]=VC");
    params.add("shipping_address_collection[allowed_countries][224]=VE");
    params.add("shipping_address_collection[allowed_countries][225]=VG");
    params.add("shipping_address_collection[allowed_countries][226]=VN");
    params.add("shipping_address_collection[allowed_countries][227]=VU");
    params.add("shipping_address_collection[allowed_countries][228]=WF");
    params.add("shipping_address_collection[allowed_countries][229]=WS");
    params.add("shipping_address_collection[allowed_countries][230]=XK");
    params.add("shipping_address_collection[allowed_countries][231]=YE");
    params.add("shipping_address_collection[allowed_countries][232]=YT");
    params.add("shipping_address_collection[allowed_countries][233]=ZA");
    params.add("shipping_address_collection[allowed_countries][234]=ZM");
    params.add("shipping_address_collection[allowed_countries][235]=ZW");
    switch (clientReferenceId) {
      case (?id) { params.add("client_reference_id=" # urlEncode(id)) };
      case (null) {};
    };
    params.values().join("&");
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
