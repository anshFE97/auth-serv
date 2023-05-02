const cloudinary = require('cloudinary').v2;
const express = require('express');
const router = express.Router();
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });


// Set up Multer storage configuration
const storage = multer.diskStorage({
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    }
  });
  
  // Set up Multer file filter configuration
  const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      callback(null, true);
    } else {
      callback(new Error('File format not supported'), false);
    }
  };
  
  // Set up Multer upload configuration
  const upload = multer({ storage: storage, fileFilter: fileFilter });
  
// Route to handle image upload
router.post('/', upload.single('image'), async (req, res) => {
  const file = req.file;
  const token = req.body.token;

  // Check if an image with the specified token already exists
  const existingImage = await cloudinary.search
    .expression(`public_id:${token}`)
    .execute();

  if (existingImage.total_count > 0) {
    // If an image with the specified token exists, delete it
    await cloudinary.uploader.destroy(token);
  }

  // Upload the new image with the specified token
  const uploadOptions = {
    public_id: token
  };

  cloudinary.uploader.upload(file.path, uploadOptions, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(result.secure_url);
      console.log(token)
    }
  });
});

module.exports = router;