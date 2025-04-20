const mongoose = require('mongoose');

const PortfolioItemSchema = new mongoose.Schema({
    title: String,
    description: String,
    fileType: String,
    fileUrls: [String]
  });
  
  module.exports = mongoose.model('PortfolioItem', PortfolioItemSchema);