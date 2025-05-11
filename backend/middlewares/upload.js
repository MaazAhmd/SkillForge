const multer = require('multer');
const path  = require('path');
const fs    = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const mode = req.body.mode || 'images';
    const folder = mode === 'file'
      ? 'files'
      : 'images';

    const uploadPath = path.join(__dirname, '..', 'uploads', folder);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    const ext    = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique + ext);
  }
});

const upload = multer({ storage });

module.exports = upload;
