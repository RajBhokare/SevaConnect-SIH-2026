const express = require('express');
const router = express.Router();
const {
  getWorkers,
  getWorkerById,
  updateWorkerProfile,
  toggleAvailability,
  getWorkerDashboard,
  getWelfareDetails,
  getAdminVerificationQueue,
  verifyWorker
} = require('../controllers/workerController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Public Marketplace list
router.get('/', getWorkers);

// Admin Verification Queue & Worker Approval (Protected for ADMIN and COOPERATIVE_ADMIN)
router.get('/admin/queue', protect, requireRole(['ADMIN', 'COOPERATIVE_ADMIN']), getAdminVerificationQueue);
router.patch('/admin/:id/verify', protect, requireRole(['ADMIN', 'COOPERATIVE_ADMIN']), verifyWorker);

// Worker authenticated routes
router.get('/dashboard', protect, getWorkerDashboard);
router.get('/welfare', protect, getWelfareDetails);
router.patch('/availability', protect, toggleAvailability);

// Generic ID lookup and profile update
router.get('/:id', getWorkerById);
router.put('/:id', protect, updateWorkerProfile);

module.exports = router;
