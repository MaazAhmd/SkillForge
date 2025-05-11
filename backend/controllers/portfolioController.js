const PortfolioItem = require('../models/PortfolioModel');
const path=require('path');
const fs   = require('fs').promises;

// Create new portfolio item
exports.createPortfolio = async (req, res) => {
  try {
    const { title, description, skills, price } = req.body;
    const userId = req.user._id; // Ensure user is authenticated and available

    const imageUrls = req.files.map(f => `http://localhost:5000/uploads/images/${f.filename}`);

    const item = await PortfolioItem.create({
      title,
      description,
      skills: Array.isArray(skills) ? skills : [skills],
      price,
      imageUrls,
      user: userId, // Associate with user
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create portfolio item' });
  }
};

// Get all portfolios for a user
exports.getUserPortfolios = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = await PortfolioItem.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    console.error('Failed to fetch user portfolios:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get portfolio by ID
exports.getPortfolioById = async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    console.error('Error fetching portfolio item:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update portfolio item
exports.updatePortfolio = async (req, res) => {
  try {
    const { title, description, skills, price } = req.body;

    // Handle new image uploads if any
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((f) => `http://localhost:5000/uploads/${f.filename}`);
    }

    // Find the portfolio item and update it
    const updatedPortfolio = await PortfolioItem.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        skills: Array.isArray(skills) ? skills : [skills],
        price,
        $push: { imageUrls }, // Add new images to the existing ones
      },
      { new: true } // Return the updated document
    );

    if (!updatedPortfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.status(200).json(updatedPortfolio);
  } catch (err) {
    console.error('Failed to update portfolio:', err);
    res.status(500).json({ message: 'Failed to update portfolio item' });
  }
};

// Delete portfolio item
exports.deletePortfolio = async (req, res) => {
  try {
    // 1) Find the portfolio
    const portfolio = await PortfolioItem.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    const deleteOps = portfolio.imageUrls.map((url) => {
      const filename = path.basename(url);
      const filePath = path.join(__dirname, '..', 'uploads', 'images', filename);

      return fs.unlink(filePath)
        .catch((err) => {
          console.error(`Failed to delete image ${filePath}:`, err);
        });
    });

    await Promise.all(deleteOps);

    await PortfolioItem.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Portfolio item deleted successfully' });

  } catch (err) {
    console.error('Failed to delete portfolio:', err);
    res.status(500).json({ message: 'Failed to delete portfolio item' });
  }
};