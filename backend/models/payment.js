const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
    },
    tenantName: String,
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
    amount: Number,
    paymentDate:   Date,
    paymentMethod: String,
    periodStart:   Date,
    periodEnd:     Date,
    durationMonths: {
      type: Number,
      default: 1,    },
    notes: String,
    status: {
      type: String,
      enum: ['paid', 'pending'],
      default: 'paid',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);