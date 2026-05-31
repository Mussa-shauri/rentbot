const express = require("express");
const router = express.Router();

const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertycontroller");

// GET ALL
router.get("/", getProperties);

// GET ONE
router.get("/:id", getPropertyById);

// CREATE
router.post("/", createProperty);

// UPDATE
router.put("/:id", updateProperty);

// DELETE
router.delete("/:id", deleteProperty);

module.exports = router;