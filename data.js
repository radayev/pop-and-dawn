// Brand and product data. Edit here; the pages read from this object.
// Packaging and ingredient lines follow the team's pouch design. Nutrition numbers come after lab testing, so the site makes no protein or sugar claims.
window.SITE = {
  brand: "Pop & Dawn",
  tagline: "Eat it. Pour it. Top it.",
  heroLead: "Sea Salt Dark Chocolate Popcorn Clusters are a plant-based, sweet-and-salty snack: crunchy whole-grain popcorn in real dark chocolate with a sea salt finish. Grab a handful from the bag, pour on milk for a quick cereal, or sprinkle them on yogurt.",
  shippingFlat: 4.99,
  freeShippingOver: 30,
  taxRate: 0.0825, // Austin, TX sales tax (pilot city), used only for the checkout simulation
  products: [
    {
      id: "sea-salt-dark-chocolate",
      name: "Sea Salt Dark Chocolate",
      short: "The original: whole-grain popcorn clusters in real dark chocolate with a sea salt finish.",
      price: 7.99,
      size: "8 oz pouch",
      image: "assets/photos/pack-sea-salt-dark-chocolate.jpg",
      photo: "assets/photos/flavor-sea-salt-dark-chocolate.jpg",
      tags: ["Plant-based", "Whole-grain popcorn"],
      facts: [["Base", "Whole-grain popcorn"], ["Coating", "Real dark chocolate, sea salt finish"], ["Dairy", "None (plant-based)"], ["Free from", "Artificial flavors and colors"]]
    },
    {
      id: "peanut-butter-dark-chocolate",
      name: "Peanut Butter Dark Chocolate",
      short: "Our dark chocolate clusters with a creamy peanut butter flavor.",
      price: 7.99,
      size: "8 oz pouch",
      image: "assets/photos/pack-peanut-butter-dark-chocolate.jpg",
      photo: "assets/photos/flavor-peanut-butter-dark-chocolate.jpg",
      tags: ["Coming later", "Plant-based", "Contains peanuts"],
      facts: [["Base", "Whole-grain popcorn"], ["Coating", "Real dark chocolate, creamy peanut butter flavor"], ["Dairy", "None (plant-based)"], ["Allergen", "Contains peanuts"]]
    },
    {
      id: "cinnamon-sea-salt",
      name: "Cinnamon Sea Salt",
      short: "Whole-grain popcorn clusters with cinnamon and a sea salt finish, no chocolate.",
      price: 7.99,
      size: "8 oz pouch",
      image: "assets/photos/pack-cinnamon-sea-salt.jpg",
      photo: "assets/photos/flavor-cinnamon-sea-salt.jpg",
      tags: ["Coming later", "Plant-based", "Chocolate-free"],
      facts: [["Base", "Whole-grain popcorn"], ["Coating", "Cinnamon seasoning, sea salt finish"], ["Dairy", "None (plant-based)"], ["Free from", "Artificial flavors and colors"]]
    },
    {
      id: "white-chocolate-caramel",
      name: "White Chocolate Caramel",
      short: "Golden popcorn clusters with white chocolate and caramel flavors.",
      price: 7.99,
      size: "8 oz pouch",
      image: "assets/photos/pack-white-chocolate-caramel.jpg",
      photo: "assets/photos/flavor-white-chocolate-caramel.jpg",
      tags: ["Coming later", "Plant-based"],
      facts: [["Base", "Whole-grain popcorn"], ["Flavors", "White chocolate, caramel"], ["Dairy", "None (plant-based)"], ["Free from", "Artificial flavors and colors"]]
    }
  ]
};
