const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/:type/:filename', (req, res) => {
    const { type, filename } = req.params;
    const { name } = req.query;
  
    const folder = type === 'files' ? 'files' : 'images'; 
    const filePath = path.join(__dirname, '..', 'uploads', folder, filename);
  
    res.download(filePath, name || filename, err => {
      if (err) {
        console.error('Download error:', err);
        res.status(404).json({ error: 'File not found' });
      }
    });
  });
  
module.exports = router;
