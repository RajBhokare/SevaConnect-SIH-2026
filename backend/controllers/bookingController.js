const store = require('../config/store');
const { COMMISSION_RATE } = require('../config/constants');

// Create new service request
const createBooking = async (req, res) => {
  try {
    const {
      workerId,
      serviceCategory,
      serviceTitle,
      requirement,
      location,
      date,
      timeSlot,
      amount,
      isEmergency = false
    } = req.body;

    if (!workerId || !requirement || !location) {
      return res.status(400).json({ message: 'Missing required booking fields (worker, requirement, location).' });
    }

    const worker = store.workers.find(w => w._id === workerId || w.userId === workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Selected worker not found.' });
    }

    const bookingId = `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const parsedAmount = Number(amount) || worker.hourlyRate || 299;

    const newBooking = {
      _id: `bk-${Date.now()}`,
      bookingId,
      customerId: req.user._id,
      customerName: req.user.name,
      customerPhone: req.user.phone || '9876543210',
      workerId: worker._id,
      workerName: worker.name,
      workerPhone: worker.phone,
      serviceCategory: serviceCategory || worker.primarySkill || 'General Service',
      serviceTitle: serviceTitle || `${worker.primarySkill || 'Home'} Service`,
      requirement,
      location: location || req.user.location || 'Pune',
      date: date || new Date().toISOString().split('T')[0],
      timeSlot: timeSlot || (isEmergency ? 'Immediate / Emergency' : 'Morning (09:00 AM - 12:00 PM)'),
      amount: parsedAmount,
      commissionRate: COMMISSION_RATE,
      commissionAmount: 0,
      workerEarning: 0,
      completedAt: null,
      isEmergency: Boolean(isEmergency),
      status: 'REQUESTED',
      paymentStatus: 'PENDING',
      isRated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.bookings.unshift(newBooking);

    res.status(201).json({
      message: 'Service request submitted successfully.',
      booking: newBooking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Error creating booking.' });
  }
};

// Get bookings for logged-in customer
const getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user._id;
    const list = store.bookings.filter(b => b.customerId === customerId);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer bookings.' });
  }
};

// Get bookings for logged-in worker
const getWorkerBookings = async (req, res) => {
  try {
    const worker = store.workers.find(w => w.userId === req.user._id || w._id === req.user._id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found.' });
    }

    const list = store.bookings.filter(b => b.workerId === worker._id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching worker bookings.' });
  }
};

// Update booking status directly (State transitions with 10% commission calculation)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'DECLINED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status transition: ${status}` });
    }

    const booking = store.bookings.find(b => b._id === id || b.bookingId === id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const previousStatus = booking.status;
    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    const worker = store.workers.find(w => w._id === booking.workerId);

    // Strict Commission Accounting: Recognized ONLY when COMPLETED
    if (status === 'COMPLETED') {
      if (previousStatus !== 'COMPLETED') {
        booking.commissionRate = COMMISSION_RATE;
        booking.commissionAmount = Math.round((booking.amount * COMMISSION_RATE) * 100) / 100;
        booking.workerEarning = Math.round((booking.amount - booking.commissionAmount) * 100) / 100;
        booking.completedAt = new Date().toISOString();

        if (worker) {
          worker.activeWorkload = Math.max(0, (worker.activeWorkload || 1) - 1);
          worker.completedJobs = (worker.completedJobs || 0) + 1;
          if (worker.welfareStatus) {
            worker.welfareStatus.totalEarnings = (worker.welfareStatus.totalEarnings || 0) + booking.workerEarning;
          }
        }
      }
    } else {
      // Incomplete or cancelled bookings earn ₹0 commission and ₹0 worker payout
      booking.commissionRate = COMMISSION_RATE;
      booking.commissionAmount = 0;
      booking.workerEarning = 0;
      booking.completedAt = null;

      if (worker) {
        if (status === 'ACCEPTED' || status === 'IN_PROGRESS') {
          if (previousStatus === 'REQUESTED') {
            worker.activeWorkload = (worker.activeWorkload || 0) + 1;
          }
        } else if (status === 'DECLINED' || status === 'CANCELLED') {
          if (previousStatus === 'ACCEPTED' || previousStatus === 'IN_PROGRESS') {
            worker.activeWorkload = Math.max(0, (worker.activeWorkload || 1) - 1);
          }
        }
      }
    }

    res.json({
      message: `Booking status updated to ${status}.`,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status.' });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = store.bookings.find(b => b._id === id || b.bookingId === id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details.' });
  }
};

// Admin: Platform-wide Overview Statistics from Real Database / Store
const getAdminOverview = async (req, res) => {
  try {
    const totalWorkers = store.workers.length;
    const verifiedWorkers = store.workers.filter(w => (w.verificationStatus === 'VERIFIED' || w.verificationStatus === 'APPROVED') && w.isListed !== false).length;
    const pendingVerification = store.workers.filter(w => w.verificationStatus === 'PENDING').length;
    const totalCustomers = store.users.filter(u => u.role === 'CUSTOMER').length;
    const totalBookings = store.bookings.length;
    const completedBookings = store.bookings.filter(b => b.status === 'COMPLETED').length;

    res.json({
      totalWorkers,
      verifiedWorkers,
      pendingVerification,
      totalCustomers,
      totalBookings,
      completedBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin overview statistics.' });
  }
};

// Admin: Commission & Financial Overview from Real Completed Bookings Only
const getAdminCommissionStats = async (req, res) => {
  try {
    const completedList = store.bookings.filter(b => b.status === 'COMPLETED');

    const completedServiceValue = completedList.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    const commissionAmount = completedList.reduce((sum, b) => sum + (b.commissionAmount !== undefined ? b.commissionAmount : Math.round((b.amount * COMMISSION_RATE) * 100) / 100), 0);
    const workerEarnings = completedList.reduce((sum, b) => sum + (b.workerEarning !== undefined ? b.workerEarning : Math.round((b.amount * (1 - COMMISSION_RATE)) * 100) / 100), 0);
    const completedBookingsCount = completedList.length;

    const transactions = completedList.map(b => ({
      _id: b._id,
      bookingId: b.bookingId,
      serviceTitle: b.serviceTitle,
      serviceCategory: b.serviceCategory,
      workerId: b.workerId,
      workerName: b.workerName,
      customerName: b.customerName,
      amount: b.amount,
      commissionRate: b.commissionRate || COMMISSION_RATE,
      commissionAmount: b.commissionAmount !== undefined ? b.commissionAmount : Math.round((b.amount * COMMISSION_RATE) * 100) / 100,
      workerEarning: b.workerEarning !== undefined ? b.workerEarning : Math.round((b.amount * (1 - COMMISSION_RATE)) * 100) / 100,
      paymentStatus: b.paymentStatus,
      completedAt: b.completedAt || b.updatedAt || b.createdAt,
      createdAt: b.createdAt
    }));

    res.json({
      commissionRate: COMMISSION_RATE,
      completedServiceValue,
      commissionAmount,
      workerEarnings,
      completedBookingsCount,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commission statistics.' });
  }
};

module.exports = {
  createBooking,
  getCustomerBookings,
  getWorkerBookings,
  updateBookingStatus,
  getBookingById,
  getAdminOverview,
  getAdminCommissionStats
};
