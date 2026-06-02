const express    = require('express');
const router     = express.Router();
const { upload } = require('../config/cloudinary');

const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertycontroller');

// GET ALL
router.get('/', getProperties);

// GET ONE
router.get('/:id', getPropertyById);

// CREATE — accepts up to 10 images
router.post('/', upload.array('images', 10), createProperty);

// UPDATE — accepts up to 10 images
router.put('/:id', upload.array('images', 10), updateProperty);

// DELETE
router.delete('/:id', deleteProperty);

module.exports = router;