const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER', 'WORKER'], default: 'CUSTOMER' },
  location: { type: String, default: 'Kothrud, Pune' },
  coordinates: {
    lat: { type: Number, default: 18.5074 },
    lng: { type: Number, default: 73.8077 }
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
