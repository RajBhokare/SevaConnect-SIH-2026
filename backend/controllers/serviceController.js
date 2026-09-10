const store = require('../config/store');

const getServices = async (req, res) => {
  try {
    res.json(store.services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services.' });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = store.services.find(s => s._id === id || s.category.toLowerCase() === id.toLowerCase());
    if (!service) {
      return res.status(404).json({ message: 'Service category not found.' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service details.' });
  }
};

module.exports = { getServices, getServiceById };
