const PortfolioItem = require('../models/PortfolioModel');

// Create new portfolio item
exports.createPortfolio = async (req, res) => {
  try {
    const { title, description, skills, price } = req.body;
    const userId = req.user._id; // 👈 Make sure user is authenticated and available

    const imageUrls = req.files.map(f => `http://localhost:5000/uploads/${f.filename}`);

    const item = await PortfolioItem.create({
      title,
      description,
      skills: Array.isArray(skills) ? skills : [skills],
      price,
      imageUrls,
      user: userId // 👈 Associate with user
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create portfolio item' });
  }
};


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