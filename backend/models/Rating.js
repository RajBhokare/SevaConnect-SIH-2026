const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  
  // AI Sentiment & Category Classification
  sentiment: { 
    type: String, 
    enum: ['positive', 'neutral', 'negative'], 
    default: 'positive' 
  },
  sentimentScore: { type: Number, default: 0.8 },
  confidence: { type: Number, default: 0.9 },
  categories: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);
