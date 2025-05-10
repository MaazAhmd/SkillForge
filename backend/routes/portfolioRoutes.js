const express = require('express');
const { createPortfolio,getPortfolioById, getUserPortfolios } = require('../controllers/portfolioController');
const upload = require('../middlewares/upload');

const router = express.Router();

const { verifyToken } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/rolesMiddleware");
router.post(
    '/create',verifyToken, authorizeRoles("freelancer"),
    upload.array('images', 6),        
    createPortfolio
  );

router.get('/',verifyToken, getUserPortfolios);
router.get('/:id', getPortfolioById);

module.exports = router;
