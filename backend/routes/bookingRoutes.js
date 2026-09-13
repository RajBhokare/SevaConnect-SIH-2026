const express = require('express');
const router = express.Router();
const {
  createBooking,
  getCustomerBookings,
  getWorkerBookings,
  updateBookingStatus,
  getBookingById,
  getAdminOverview,
  getAdminCommissionStats
} = require('../controllers/bookingController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/customer', protect, getCustomerBookings);
router.get('/worker', protect, getWorkerBookings);

// Admin Financial & Platform Overview Endpoints
router.get('/admin/overview', protect, requireRole(['ADMIN', 'COOPERATIVE_ADMIN']), getAdminOverview);
router.get('/admin/commission', protect, requireRole(['ADMIN', 'COOPERATIVE_ADMIN']), getAdminCommissionStats);

router.get('/:id', protect, getBookingById);
router.patch('/:id/status', protect, updateBookingStatus);

module.exports = router;
