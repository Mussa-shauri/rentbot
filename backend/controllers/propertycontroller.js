const Property = require("../models/property");

// GET ALL PROPERTIES
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET ONE PROPERTY
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });

    res.json(property);
  } catch (error) {
    res.status(500).json(error);
  }
};

// CREATE PROPERTY
exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json(error);
  }
};

// UPDATE PROPERTY
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!property) return res.status(404).json({ message: "Not found" });

    res.json(property);
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE PROPERTY
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};