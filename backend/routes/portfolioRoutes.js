const express = require('express');
const {
  createPortfolio,
  getPortfolioById,
  getUserPortfolios,
  updatePortfolio,
  deletePortfolio,
} = require('../controllers/portfolioController');
const upload = require('../middlewares/upload');

const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/rolesMiddleware');

// Create a new portfolio
router.post(
  '/create',
  verifyToken,
  authorizeRoles('freelancer'),
  upload.array('images', 6), // Allow up to 6 images
  createPortfolio
);

// Get all portfolios for the authenticated user
router.get('/', verifyToken, getUserPortfolios);

// Get a portfolio by ID
router.get('/:id', getPortfolioById);

// Update a portfolio by ID
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('freelancer'),
  upload.array('images', 6), 
  updatePortfolio
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('freelancer'),
  deletePortfolio
);

module.exports = router;