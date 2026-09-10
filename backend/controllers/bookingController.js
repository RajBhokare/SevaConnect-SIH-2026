const store = require('../config/store');

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
      amount: Number(amount) || worker.hourlyRate || 299,
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

// Update booking status directly (State transitions)
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

    // Update worker workload & completed stats on state transitions
    if (worker) {
      if (status === 'ACCEPTED' || status === 'IN_PROGRESS') {
        if (previousStatus === 'REQUESTED') {
          worker.activeWorkload = (worker.activeWorkload || 0) + 1;
        }
      } else if (status === 'COMPLETED') {
        if (previousStatus !== 'COMPLETED') {
          worker.activeWorkload = Math.max(0, (worker.activeWorkload || 1) - 1);
          worker.completedJobs = (worker.completedJobs || 0) + 1;
          if (worker.welfareStatus) {
            worker.welfareStatus.totalEarnings = (worker.welfareStatus.totalEarnings || 0) + booking.amount;
          }
        }
      } else if (status === 'DECLINED' || status === 'CANCELLED') {
        if (previousStatus === 'ACCEPTED' || previousStatus === 'IN_PROGRESS') {
          worker.activeWorkload = Math.max(0, (worker.activeWorkload || 1) - 1);
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

module.exports = {
  createBooking,
  getCustomerBookings,
  getWorkerBookings,
  updateBookingStatus,
  getBookingById
};
