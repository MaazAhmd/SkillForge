const PortfolioItem = require('../models/PortfolioModel');

// Create new portfolio item
exports.createPortfolio = async (req, res) => {
  try {
    const { title, description, skills, price, imageUrls } = req.body;
    const item = await PortfolioItem.create({
      title,
      description,
      skills,
      price,
      imageUrls
    });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create portfolio item' });
  }
};
