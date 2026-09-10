const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Plumber', 'Electrician', 'Carpenter', 'Cleaner', 'Painter', 'Appliance Repair']
  },
  description: { type: String, required: true },
  startingPrice: { type: Number, required: true, default: 249 },
  icon: { type: String, default: 'Wrench' },
  popularTasks: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.models.Service || mongoose.model('Service', serviceSchema);
