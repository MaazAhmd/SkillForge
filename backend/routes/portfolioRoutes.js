const express = require('express');
const { createPortfolio } = require('../controllers/portfolioController');

const router = express.Router();


router.post('/', createPortfolio);

module.exports = router;
