import List "mo:core/List";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  public type Category = {
    #men;
    #women;
    #kids;
    #casual;
    #bridal;
  };

  public type ClothingItem = {
    name : Text;
    category : Category;
    itemType : Text;
    color : Text;
    pattern : Text;
    price : Nat;
    photo : Text;
  };

  public type Shop = {
    name : Text;
    phone : Text;
    location : Text;
    clothing : [ClothingItem];
  };

  let shops = List.empty<Shop>();
  let itemPhotos = Map.empty<Text, Storage.ExternalBlob>();

  public query ({ caller }) func listCategories() : async [Category] {
    [#men, #women, #kids, #casual, #bridal];
  };

  func normalizeText(text : Text) : Text {
    text.trim(#char ' ').toLower();
  };

  func matchesCategory(item : ClothingItem, category : ?Category) : Bool {
    switch (category) {
      case (null) { true };
      case (?cat) { item.category == cat };
    };
  };

  func matchesTextField(itemField : Text, searchValue : ?Text) : Bool {
    switch (searchValue) {
      case (null) { true };
      case (?val) { normalizeText(itemField).contains(#text(normalizeText(val))) };
    };
  };

  func matchesItem(item : ClothingItem, category : ?Category, itemType : ?Text, color : ?Text, pattern : ?Text) : Bool {
    matchesCategory(item, category) and matchesTextField(item.itemType, itemType) and matchesTextField(item.color, color) and matchesTextField(item.pattern, pattern);
  };

  public query ({ caller }) func searchItems(
    category : ?Category,
    itemType : ?Text,
    color : ?Text,
    pattern : ?Text,
  ) : async [ClothingItem] {
    let items = List.empty<ClothingItem>();

    for (shop in shops.values()) {
      for (item in shop.clothing.values()) {
        if (matchesItem(item, category, itemType, color, pattern)) {
          items.add(item);
        };
      };
    };

    items.toArray();
  };

  public query ({ caller }) func getItemDetails(itemName : Text) : async (ClothingItem, [Shop]) {
    let matchingShops = List.empty<Shop>();
    var foundItem : ?ClothingItem = null;

    for (shop in shops.values()) {
      for (item in shop.clothing.values()) {
        if (item.name == itemName) {
          foundItem := ?item;
          matchingShops.add(shop);
        };
      };
    };

    switch (foundItem) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) { (item, matchingShops.toArray()) };
    };
  };

  public shared ({ caller }) func addClothingItem(shopName : Text, item : ClothingItem) : async () {
    let shopOpt = shops.find(func(shop) { shop.name == shopName });

    switch (shopOpt) {
      case (null) { Runtime.trap("Shop not found") };
      case (?shop) {
        let newClothing = shop.clothing.concat([item]);
        let newShop : Shop = {
          shop with clothing = newClothing
        };

        let updatedShops = shops.map<Shop, Shop>(
          func(s) {
            if (s.name == shopName) { newShop } else { s };
          }
        );

        shops.clear();
        for (shop in updatedShops.values()) {
          shops.add(shop);
        };
      };
    };
  };

  public shared ({ caller }) func attachPhotoToItem(itemName : Text, blob : Storage.ExternalBlob) : async Text {
    itemPhotos.add(itemName, blob);
    itemName;
  };

  public query ({ caller }) func getItemPhoto(itemName : Text) : async ?Storage.ExternalBlob {
    itemPhotos.get(itemName);
  };

  public shared ({ caller }) func _initializeShops() : async () {
    if (shops.isEmpty()) {
      let shopA : Shop = {
        name = "Elegant Attire";
        phone = "9845123456";
        location = "MG Road, Bangalore";
        clothing = [
          {
            name = "Men's Casual Shirt";
            category = #men;
            itemType = "Shirt";
            color = "Blue";
            pattern = "Solid";
            price = 1500;
            photo = "/assets/generated/men_casual_shirt_blue_solid.jpeg";
          },
          {
            name = "Men's White Casual Striped Shirt";
            category = #men;
            itemType = "Shirt";
            color = "White";
            pattern = "Striped";
            price = 1700;
            photo = "/assets/generated/men_white_casual_striped_shirt_jpeg.dim_480x640.jpeg";
          },
          {
            name = "Men's Red Floral Shirt";
            category = #men;
            itemType = "Shirt";
            color = "Red";
            pattern = "Floral";
            price = 1900;
            photo = "/assets/generated/mens_red_floral_shirt_mens_shirt_red_floral.jpeg";
          },
          {
            name = "Women's Designer Dress";
            category = #women;
            itemType = "Dress";
            color = "Red";
            pattern = "Floral";
            price = 3200;
            photo = "/assets/generated/women_designer_dress_red_floral.jpeg";
          },
          {
            name = "Kids Blue T-shirt";
            category = #kids;
            itemType = "Shirt";
            color = "Blue";
            pattern = "Solid";
            price = 1200;
            photo = "/assets/generated/kids_blue_tshirt.jpeg";
          },
        ];
      };

      let shopB : Shop = {
        name = "Fashion Hub";
        phone = "9876543210";
        location = "Indiranagar, Bangalore";
        clothing = [
          {
            name = "Kids Party Dress";
            category = #kids;
            itemType = "Dress";
            color = "Pink";
            pattern = "Polka Dots";
            price = 1800;
            photo = "/assets/generated/kids_party_dress_pink_polka_dots.jpeg";
          },
          {
            name = "Men's Formal Shirt";
            category = #men;
            itemType = "Shirt";
            color = "White";
            pattern = "Striped";
            price = 2000;
            photo = "/assets/generated/men_formal_shirt_white_striped.jpeg";
          },
          {
            name = "Women's Casual Shirt";
            category = #women;
            itemType = "Shirt";
            color = "Yellow";
            pattern = "Solid";
            price = 1400;
            photo = "/assets/generated/women_casual_shirt_yellow_solid.jpeg";
          },
          {
            name = "Women's Casual Pink Dress";
            category = #women;
            itemType = "Dress";
            color = "Pink";
            pattern = "Solid";
            price = 2300;
            photo = "/assets/generated/women_casual_pink_dress.jpeg";
          },
        ];
      };

      let shopC : Shop = {
        name = "Trendy Styles";
        phone = "9898989898";
        location = "Koramangala, Bangalore";
        clothing = [
          {
            name = "Men's Slim Fit Shirt";
            category = #men;
            itemType = "Shirt";
            color = "Black";
            pattern = "Solid";
            price = 1750;
            photo = "/assets/generated/men_slim_fit_shirt_black_solid.jpeg";
          },
          {
            name = "Women's Ethnic Dress";
            category = #women;
            itemType = "Dress";
            color = "Green";
            pattern = "Embroidered";
            price = 3400;
            photo = "/assets/generated/women_ethnic_dress_green_embroidered.jpeg";
          },
          {
            name = "Women's Ivory Ruffle Dress";
            category = #women;
            itemType = "Dress";
            color = "Ivory";
            pattern = "Ruffle";
            price = 2600;
            photo = "/assets/generated/women_ivory_ruffle_dress.jpeg";
          },
        ];
      };

      let shopD : Shop = {
        name = "Vogue";
        phone = "9100232456";
        location = "Electronic City, Bangalore";
        clothing = [
          {
            name = "Women's Formal Dress";
            category = #women;
            itemType = "Dress";
            color = "Blue";
            pattern = "Solid";
            price = 2100;
            photo = "/assets/generated/women_formal_dress_blue_solid.jpeg";
          },
          {
            name = "Men's Party Shirt";
            category = #men;
            itemType = "Shirt";
            color = "Pink";
            pattern = "Patterned";
            price = 1800;
            photo = "/assets/generated/men_party_shirt_pink_patterned.jpeg";
          },
          {
            name = "Kids Flower Print Dress";
            category = #kids;
            itemType = "Dress";
            color = "Yellow";
            pattern = "Floral";
            price = 1500;
            photo = "/assets/generated/kids_flower_print_dress_yellow_floral.jpeg";
          },
          {
            name = "Women's Patterned Dress";
            category = #women;
            itemType = "Dress";
            color = "Blue";
            pattern = "Patterned";
            price = 2800;
            photo = "/assets/generated/women_patterned_dress_blue.jpeg";
          },
          {
            name = "Women's Casual Yellow Dress";
            category = #women;
            itemType = "Dress";
            color = "Yellow";
            pattern = "Solid";
            price = 2450;
            photo = "/assets/generated/women_casual_yellow_dress.jpeg";
          },
        ];
      };

      shops.add(shopA);
      shops.add(shopB);
      shops.add(shopC);
      shops.add(shopD);
    };
  };
};
