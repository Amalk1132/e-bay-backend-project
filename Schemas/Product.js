const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  subcategory:String,
  qty: {
    type: Number,
    default:1,
  },  
});

module.exports = mongoose.model("product", productSchema);
