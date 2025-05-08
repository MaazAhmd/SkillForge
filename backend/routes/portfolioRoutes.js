const express = require('express');
const { createPortfolio, getAllPortfolios, getPortfolioById } = require('../controllers/portfolioController');
const upload = require('../middlewares/upload');

const router = express.Router();


router.post(
    '/create',
    upload.array('images', 6),        
    createPortfolio
  );

router.get('/', getAllPortfolios);
router.get('/:id', getPortfolioById);

module.exports = router;
