
const Property = require('../models/property');

// GET ALL PROPERTIES
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE PROPERTY
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE PROPERTY
exports.createProperty = async (req, res) => {
  try {
    const data = { ...req.body };

    // If images were uploaded via Cloudinary, save their URLs
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => f.path);
    }

    // Parse amenities and videoLinks if sent as JSON string
    if (typeof data.amenities === 'string') {
      try { data.amenities = JSON.parse(data.amenities); } catch { data.amenities = []; }
    }
    if (typeof data.videoLinks === 'string') {
      try { data.videoLinks = JSON.parse(data.videoLinks); } catch { data.videoLinks = []; }
    }

    const property = await Property.create(data);
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROPERTY
exports.updateProperty = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => f.path);
    }

    if (typeof data.amenities === 'string') {
      try { data.amenities = JSON.parse(data.amenities); } catch { data.amenities = []; }
    }
    if (typeof data.videoLinks === 'string') {
      try { data.videoLinks = JSON.parse(data.videoLinks); } catch { data.videoLinks = []; }
    }

    const property = await Property.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!property) return res.status(404).json({ message: 'Not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PROPERTY
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};