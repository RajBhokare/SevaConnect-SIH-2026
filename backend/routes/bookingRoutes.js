const express = require('express');
const router = express.Router();
const {
  createBooking,
  getCustomerBookings,
  getWorkerBookings,
  updateBookingStatus,
  getBookingById
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/customer', protect, getCustomerBookings);
router.get('/worker', protect, getWorkerBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/status', protect, updateBookingStatus);

module.exports = router;
