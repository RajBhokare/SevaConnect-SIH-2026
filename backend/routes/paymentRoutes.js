const express = require('express');
const router = express.Router();
const { processPayment, getPaymentByBooking } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/simulate', protect, processPayment);
router.get('/booking/:bookingId', protect, getPaymentByBooking);

module.exports = router;
