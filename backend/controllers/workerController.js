const store = require('../config/store');

// Strip sensitive government ID reference
const sanitizeWorker = (worker) => {
  if (!worker) return null;
  const { governmentIdRef, ...safeWorker } = worker;
  return safeWorker;
};

// Get all verified/available workers with filters
const getWorkers = async (req, res) => {
  try {
    const { category, search, availableOnly, sort } = req.query;

    let list = store.workers.map(w => sanitizeWorker(w));

    // Filter by category / skill
    if (category && category !== 'All') {
      const catLower = category.toLowerCase();
      list = list.filter(w => 
        (w.primarySkill && w.primarySkill.toLowerCase().includes(catLower)) ||
        (w.skills && w.skills.some(s => s.toLowerCase().includes(catLower)))
      );
    }

    // Filter by search query
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(w => 
        w.name.toLowerCase().includes(q) ||
        (w.location && w.location.toLowerCase().includes(q)) ||
        (w.serviceArea && w.serviceArea.toLowerCase().includes(q)) ||
        (w.skills && w.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    // Filter available only
    if (availableOnly === 'true') {
      list = list.filter(w => w.isAvailable === true);
    }

    // Sorting
    if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'experience') {
      list.sort((a, b) => b.experience - a.experience);
    } else if (sort === 'price_asc') {
      list.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.hourlyRate - a.hourlyRate);
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workers.' });
  }
};

// Get single worker profile by ID
const getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = store.workers.find(w => w._id === id || w.userId === id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found.' });
    }

    res.json(sanitizeWorker(worker));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching worker profile.' });
  }
};

// Update worker profile
const updateWorkerProfile = async (req, res) => {
  try {
    const worker = store.workers.find(w => w.userId === req.user._id || w._id === req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found.' });
    }

    const { name, phone, location, serviceArea, skills, experience, hourlyRate, bio, serviceRadius } = req.body;

    if (name) worker.name = name;
    if (phone) worker.phone = phone;
    if (location) worker.location = location;
    if (serviceArea) worker.serviceArea = serviceArea;
    if (skills) {
      worker.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
      if (worker.skills.length > 0) worker.primarySkill = worker.skills[0];
    }
    if (experience !== undefined) worker.experience = Number(experience);
    if (hourlyRate !== undefined) worker.hourlyRate = Number(hourlyRate);
    if (bio !== undefined) worker.bio = bio;
    if (serviceRadius !== undefined) worker.serviceRadius = Number(serviceRadius);

    res.json({ message: 'Worker profile updated successfully.', worker: sanitizeWorker(worker) });
  } catch (error) {
    res.status(500).json({ message: 'Error updating worker profile.' });
  }
};

// Toggle Availability
const toggleAvailability = async (req, res) => {
  try {
    const worker = store.workers.find(w => w.userId === req.user._id || w._id === req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found.' });
    }

    worker.isAvailable = req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : !worker.isAvailable;

    res.json({
      message: `Availability updated to ${worker.isAvailable ? 'Available' : 'Offline'}.`,
      isAvailable: worker.isAvailable
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability.' });
  }
};

// Worker Dashboard Overview
const getWorkerDashboard = async (req, res) => {
  try {
    const worker = store.workers.find(w => w.userId === req.user._id || w._id === req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found.' });
    }

    const workerBookings = store.bookings.filter(b => b.workerId === worker._id);
    const pendingRequests = workerBookings.filter(b => b.status === 'REQUESTED');
    const activeJobs = workerBookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS');
    const completedJobs = workerBookings.filter(b => b.status === 'COMPLETED');

    const totalEarnings = completedJobs.reduce((acc, curr) => acc + (curr.amount || 0), worker.welfareStatus?.totalEarnings || 0);

    res.json({
      worker: sanitizeWorker(worker),
      stats: {
        totalEarnings,
        rating: worker.rating,
        reviewCount: worker.reviewCount,
        completedCount: worker.completedJobs + completedJobs.length,
        pendingCount: pendingRequests.length,
        activeCount: activeJobs.length,
        isAvailable: worker.isAvailable
      },
      activeJob: activeJobs.length > 0 ? activeJobs[0] : null,
      pendingRequests
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching worker dashboard.' });
  }
};

// Worker Welfare Details
const getWelfareDetails = async (req, res) => {
  try {
    const worker = store.workers.find(w => w.userId === req.user._id || w._id === req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found.' });
    }

    res.json({
      workerName: worker.name,
      cooperativeName: worker.cooperativeName,
      cooperativeMemberId: worker.cooperativeMemberId,
      verificationStatus: worker.verificationStatus,
      certificationStatus: worker.certificationStatus,
      welfareStatus: worker.welfareStatus || {
        insuranceActive: true,
        insurancePolicy: 'PM-SYM / Shramik Suraksha #7782',
        welfareFundContribution: 3850,
        totalEarnings: 34200
      },
      benefits: [
        { title: 'Accidental Disability Cover', coverage: 'Up to ₹2,00,000', status: 'Active' },
        { title: 'Hospitalization Cash Support', coverage: '₹1,000 / day (up to 15 days)', status: 'Active' },
        { title: 'Tool & Equipment Loan Facility', coverage: '0% Interest via Cooperative', status: 'Eligible' },
        { title: 'Cooperative Annual Dividend', coverage: 'Pro-rata on completed gigs', status: 'Enrolled' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching welfare details.' });
  }
};

module.exports = {
  getWorkers,
  getWorkerById,
  updateWorkerProfile,
  toggleAvailability,
  getWorkerDashboard,
  getWelfareDetails
};
