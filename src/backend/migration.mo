import List "mo:core/List";

module {
  type Category = {
    #men;
    #women;
    #kids;
    #casual;
    #bridal;
  };

  type ClothingItem = {
    name : Text;
    category : Category;
    itemType : Text;
    color : Text;
    pattern : Text;
    price : Nat;
    photo : Text;
  };

  type Shop = {
    name : Text;
    phone : Text;
    location : Text;
    clothing : [ClothingItem];
  };

  type Actor = {
    shops : List.List<Shop>;
  };

  public func run(old : Actor) : Actor {
    let updatedShops = old.shops.map<Shop, Shop>(
      func(shop) {
        if (shop.name == "Trendy Styles") {
          let newItem : ClothingItem = {
            name = "Women's Blue Floral Dress";
            category = #women;
            itemType = "Dress";
            color = "Blue";
            pattern = "Floral";
            price = 2900;
            photo = "/assets/generated/women_blue_floral_dress.jpeg";
          };
          let newClothingList = shop.clothing.concat([newItem]);
          { shop with clothing = newClothingList };
        } else {
          shop;
        };
      }
    );
    { shops = updatedShops };
  };
};
