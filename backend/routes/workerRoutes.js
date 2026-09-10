const express = require('express');
const router = express.Router();
const {
  getWorkers,
  getWorkerById,
  updateWorkerProfile,
  toggleAvailability,
  getWorkerDashboard,
  getWelfareDetails
} = require('../controllers/workerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getWorkers);
router.get('/dashboard', protect, getWorkerDashboard);
router.get('/welfare', protect, getWelfareDetails);
router.get('/:id', getWorkerById);
router.put('/:id', protect, updateWorkerProfile);
router.patch('/availability', protect, toggleAvailability);

module.exports = router;
