const store = require('../config/store');

// Process simulated payment
const processPayment = async (req, res) => {
  try {
    const { bookingId, amount, method = 'UPI' } = req.body;

    const booking = store.bookings.find(b => b._id === bookingId || b.bookingId === bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found for payment settlement.' });
    }

    const txRef = `TXN_SEVA_${Date.now().toString().slice(-8)}`;
    const newPayment = {
      _id: `pay-${Date.now()}`,
      bookingId: booking._id,
      customerId: req.user._id,
      workerId: booking.workerId,
      amount: Number(amount) || booking.amount,
      method,
      transactionRef: txRef,
      status: 'SUCCESS',
      isSimulated: true,
      timestamp: new Date().toISOString()
    };

    store.payments.push(newPayment);

    // Update booking payment status
    booking.paymentStatus = method === 'CASH_ON_SERVICE' ? 'CASH_ON_SERVICE' : 'PAID';

    res.status(201).json({
      message: 'Payment simulated successfully. Settlement marked in cooperative ledger.',
      payment: newPayment,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment settlement.' });
  }
};

// Get payment receipt by booking ID
const getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const payment = store.payments.find(p => p.bookingId === bookingId);
    res.json(payment || null);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment record.' });
  }
};

module.exports = { processPayment, getPaymentByBooking };
