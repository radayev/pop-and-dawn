// Brand and product data. Edit here; the pages read from this object.
// Protein and sugar figures are development targets, so the site describes them without exact grams.
window.SITE = {
  brand: "Pop & Dawn",
  tagline: "Wake up to popcorn crunch.",
  heroLead: "Sea Salt Dark Chocolate Popcorn Crunch is a plant-based breakfast cereal made from crunchy popcorn clusters coated in rich dark chocolate and sprinkled with sea salt. It's designed to have more protein and less sugar than classic kids' chocolate cereals (targets until lab testing). Enjoy it in a bowl, or grab a handful straight from the box.",
  shippingFlat: 4.99,
  freeShippingOver: 30,
  taxRate: 0.0825, // Austin, TX sales tax (pilot city), used only for the checkout simulation
  products: [
    {
      id: "sea-salt-dark-chocolate",
      name: "Sea Salt Dark Chocolate",
      short: "The original: popcorn clusters in dark chocolate with a sprinkle of sea salt.",
      price: 7.99,
      size: "8 oz box",
      image: "assets/box-original.svg",
      tags: ["Plant-based", "Whole-grain popcorn"],
      facts: [["Base", "Whole-grain popcorn clusters and pea-protein crisps"], ["Coating", "Dark chocolate, sea salt"], ["Dairy", "None (plant-based)"], ["Goal", "More protein, less sugar than kids' chocolate cereals"]]
    },
    {
      id: "peanut-butter-dark-chocolate",
      name: "Peanut Butter Dark Chocolate",
      short: "Our classic clusters with roasted peanut butter folded in.",
      price: 7.99,
      size: "8 oz box",
      image: "assets/box-pb.svg",
      tags: ["Coming later", "Plant-based", "Contains peanuts"],
      facts: [["Base", "Whole-grain popcorn clusters"], ["Coating", "Dark chocolate, peanut butter"], ["Dairy", "None (plant-based)"], ["Allergen", "Contains peanuts"]]
    },
    {
      id: "cinnamon-sea-salt",
      name: "Cinnamon Sea Salt",
      short: "Warm cinnamon and sea salt on crunchy popcorn clusters, just without the chocolate.",
      price: 7.99,
      size: "8 oz box",
      image: "assets/box-cinnamon.svg",
      tags: ["Coming later", "Plant-based", "Chocolate-free"],
      facts: [["Base", "Whole-grain popcorn clusters"], ["Coating", "Cinnamon, sea salt"], ["Dairy", "None (plant-based)"], ["Goal", "Less sugar than classic cinnamon cereals"]]
    }
  ]
};
