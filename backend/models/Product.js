const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imagePath: { type: String, required: true },
  category: { type: String, required: true }, // casual, traditional, party
  idealShape: { type: String, default: "all" }, // pear, hourglass, inverted, straight
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
