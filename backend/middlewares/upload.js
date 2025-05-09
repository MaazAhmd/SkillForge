const multer = require('multer');
const path = require('path');

// 1. Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext    = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique + ext);
  }
});

const upload = multer({ storage });

module.exports = upload;
