const Payment = require("../models/Payment");

/**
 * GET ALL PAYMENTS
 * /api/payments
 */
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("tenant")
      .populate("property");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SINGLE PAYMENT
 * /api/payments/:id
 */
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("tenant")
      .populate("property");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CREATE PAYMENT
 * /api/payments
 */
exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);

    res.status(201).json({
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE PAYMENT
 * /api/payments/:id
 */
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({
      message: "Payment updated successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE PAYMENT
 * /api/payments/:id
 */
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET TOTAL REVENUE (DASHBOARD CARD)
 * /api/payments/revenue/total
 */
exports.getTotalRevenue = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "paid" });

    const totalRevenue = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    res.json({
      totalRevenue,
      currency: "TZS",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};