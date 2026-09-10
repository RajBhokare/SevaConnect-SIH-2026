const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  workerName: { type: String, required: true },
  workerPhone: { type: String, required: true },
  serviceCategory: { type: String, required: true },
  serviceTitle: { type: String, required: true },
  requirement: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  amount: { type: Number, required: true, default: 350 },
  isEmergency: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'DECLINED', 'CANCELLED'],
    default: 'REQUESTED'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'CASH_ON_SERVICE'],
    default: 'PENDING'
  },
  isRated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
