const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('../../middleware/auth');
const Prediction = require('../../models/Prediction');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// @route   POST api/predictions
// @desc    Create a new prediction
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // For now, we'll use mock prediction results
    // TODO: Integrate with actual ML model
    const mockPrediction = {
      disease: 'Late Blight',
      confidence: 92.00,
      recommendations: 'Apply fungicide treatment, remove infected leaves, and ensure proper air circulation.'
    };

    const prediction = new Prediction({
      user: req.user._id,
      image: req.file.path,
      disease: mockPrediction.disease,
      confidence: mockPrediction.confidence,
      recommendations: mockPrediction.recommendations
    });

    await prediction.save();
    res.json(prediction);
  } catch (err) {
    console.error('Prediction error:', err);
    res.status(500).json({ 
      message: err.message || 'Failed to process image'
    });
  }
});

// @route   GET api/predictions
// @desc    Get all predictions for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch predictions' });
  }
});

// @route   DELETE api/predictions/:id
// @desc    Delete a prediction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const prediction = await Prediction.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    // Delete the image file
    if (prediction.image) {
      const imagePath = path.join(__dirname, '../../', prediction.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
    }

    await prediction.deleteOne();
    res.json({ message: 'Prediction deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to delete prediction' });
  }
});

module.exports = router; 