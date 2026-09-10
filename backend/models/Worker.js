const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, default: 'Pune' },
  serviceArea: { type: String, default: 'Kothrud, Deccan, Shivajinagar, Karve Nagar' },
  coordinates: {
    lat: { type: Number, default: 18.5074 },
    lng: { type: Number, default: 73.8077 }
  },
  skills: [{ type: String }],
  primarySkill: { type: String, default: 'Plumber' },
  experience: { type: Number, default: 5 }, // years
  hourlyRate: { type: Number, default: 299 },
  cooperativeName: { type: String, default: 'Maharashtra Shramik Swavalamban Cooperative' },
  cooperativeMemberId: { type: String, default: 'MSSC-4092' },
  verificationStatus: { 
    type: String, 
    enum: ['PENDING', 'VERIFIED', 'REJECTED'], 
    default: 'VERIFIED' 
  },
  certificationStatus: { type: Boolean, default: true },
  welfareStatus: {
    insuranceActive: { type: Boolean, default: true },
    insurancePolicy: { type: String, default: 'PM-SYM / Shramik Suraksha #7782' },
    welfareFundContribution: { type: Number, default: 2450 },
    totalEarnings: { type: Number, default: 18400 }
  },
  isAvailable: { type: Boolean, default: true },
  serviceRadius: { type: Number, default: 10 }, // km
  emergencyAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 28 },
  completedJobs: { type: Number, default: 42 },
  activeWorkload: { type: Number, default: 0 }, // For FairMatch workload fairness
  bio: { type: String, default: 'Certified professional with verified background and cooperative membership.' },
  
  // AI-Powered Ranking & Performance Metrics
  rank: { 
    type: String, 
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Unranked'], 
    default: 'Unranked' 
  },
  score: { type: Number, default: 0 },
  rankConfidence: { type: Number, default: 0.0 },
  positiveFeedbackPercentage: { type: Number, default: 100 },
  sentimentScore: { type: Number, default: 0.0 },
  rankSummary: { type: String, default: 'New Service Provider' },
  rankBreakdown: {
    ratingScore: { type: Number, default: 0 },
    sentimentScore: { type: Number, default: 0 },
    volumeScore: { type: Number, default: 0 },
    consistencyScore: { type: Number, default: 0 },
    reliabilityScore: { type: Number, default: 0 }
  },
  topCategories: [{ type: String }],
  lastCalculatedAt: { type: Date, default: Date.now },

  // Government ID is stored privately and MUST NEVER be exposed in public API projections
  governmentIdRef: { type: String, select: false }
}, { timestamps: true });

module.exports = mongoose.models.Worker || mongoose.model('Worker', workerSchema);
