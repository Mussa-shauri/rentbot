const express = require("express");

const router = express.Router();

const {
  getTenants,
  createTenant,
} = require("../controllers/tenantController");

router.get("/", getTenants);

router.post("/", createTenant);

module.exports = router;