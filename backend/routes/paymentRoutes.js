const express = require("express");
const router = express.Router();

const {
  getPayments,
  createPayment,
  getPaymentById,
  updatePayment,
  deletePayment,
  getTotalRevenue,
} = require("../controllers/paymentcontroller");

/**
 * GET all payments
 * /api/payments
 */
router.get("/", getPayments);

/**
 * GET single payment
 * /api/payments/:id
 */
router.get("/:id", getPaymentById);

/**
 * CREATE new payment
 * /api/payments
 */
router.post("/", createPayment);

/**
 * UPDATE payment
 * /api/payments/:id
 */
router.put("/:id", updatePayment);

/**
 * DELETE payment
 * /api/payments/:id
 */
router.delete("/:id", deletePayment);

/**
 * GET total revenue (for dashboard)
 * /api/payments/revenue/total
 */
router.get("/revenue/total", getTotalRevenue);

module.exports = router;