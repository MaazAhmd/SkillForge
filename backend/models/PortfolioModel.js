const mongoose = require("mongoose");

const PortfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  price: { type: Number, required: true },
  imageUrls: [{ type: String, required: true }]
}, { timestamps: true });

module.exports = mongoose.model("PortfolioItem", PortfolioItemSchema);
