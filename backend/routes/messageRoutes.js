const express = require("express");
const router = express.Router();
const Message = require("../models/message");

// GET ALL MESSAGES
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("property")
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE MESSAGE
router.post("/", async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MARK AS READ
router.put("/:id/read", async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE MESSAGE
router.delete("/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;