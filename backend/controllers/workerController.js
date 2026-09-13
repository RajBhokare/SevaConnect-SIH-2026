const store = require('../config/store');
const { workerMatchesCategory, workerMatchesQuery } = require('../utils/searchHelper');

// Strip sensitive government ID reference unless requested by authorized admin
const sanitizeWorker = (worker) => {
  if (!worker) return null;
  const { governmentIdRef, ...safeWorker } = worker;
  return safeWorker;
};

// Get all verified/available workers with filters (Marketplace View)
const getWorkers = async (req, res) => {
  try {
    const { category, search, availableOnly, sort } = req.query;

    // Only return VERIFIED / APPROVED workers who are listed in the marketplace
    let list = store.workers
      .filter(w => (w.verificationStatus === 'VERIFIED' || w.verificationStatus === 'APPROVED') && w.isListed !== false)
      .map(w => sanitizeWorker(w));

    // Filter by category / skill with semantic alias matching
    if (category && category !== 'All') {
      list = list.filter(w => workerMatchesCategory(w, category));
    }

    // Filter by search query with intelligent category stemming
    if (search && search.trim()) {
      list = list.filter(w => workerMatchesQuery(w, search));
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

    // Real earnings derived strictly from completed bookings (after 10% cooperative commission)
    const totalEarnings = completedJobs.reduce((acc, curr) => {
      const earning = curr.workerEarning !== undefined ? curr.workerEarning : Math.round((curr.amount * 0.90) * 100) / 100;
      return acc + earning;
    }, 0);

    res.json({
      worker: sanitizeWorker(worker),
      stats: {
        totalEarnings,
        rating: worker.rating,
        reviewCount: worker.reviewCount,
        completedCount: completedJobs.length,
        pendingCount: pendingRequests.length,
        activeCount: activeJobs.length,
        isAvailable: worker.isAvailable
      },
      activeJob: activeJobs.length > 0 ? activeJobs[0] : null,
      activeBookings: activeJobs,
      recentCompleted: completedJobs,
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

    const workerBookings = store.bookings.filter(b => b.workerId === worker._id);
    const completedJobs = workerBookings.filter(b => b.status === 'COMPLETED');
    const totalEarnings = completedJobs.reduce((acc, curr) => {
      const earning = curr.workerEarning !== undefined ? curr.workerEarning : Math.round((curr.amount * 0.90) * 100) / 100;
      return acc + earning;
    }, 0);

    res.json({
      workerName: worker.name,
      cooperativeName: worker.cooperativeName,
      cooperativeMemberId: worker.cooperativeMemberId,
      verificationStatus: worker.verificationStatus,
      certificationStatus: worker.certificationStatus,
      welfareStatus: {
        insuranceActive: worker.welfareStatus?.insuranceActive ?? true,
        insurancePolicy: worker.welfareStatus?.insurancePolicy || `PM-SYM / Shramik Suraksha #${Math.floor(1000 + Math.random() * 9000)}`,
        welfareFundContribution: Math.round((totalEarnings * 0.05) * 100) / 100, // 5% welfare savings
        totalEarnings
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

// Admin: Get Worker Verification Queue (Prioritizes PENDING submissions first)
const getAdminVerificationQueue = async (req, res) => {
  try {
    const { status } = req.query;
    let list = store.workers;

    if (status && status !== 'ALL') {
      list = list.filter(w => w.verificationStatus === status);
    }

    // Sort: PENDING applications first (sorted newest first), then other statuses (newest first)
    list = [...list].sort((a, b) => {
      const isAPending = a.verificationStatus === 'PENDING';
      const isBPending = b.verificationStatus === 'PENDING';
      if (isAPending && !isBPending) return -1;
      if (!isAPending && isBPending) return 1;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    // Return workers with verification details (mask government ID partially for admin inspection)
    const queue = list.map(w => ({
      _id: w._id,
      userId: w.userId,
      name: w.name,
      phone: w.phone,
      email: w.email,
      primarySkill: w.primarySkill,
      skills: w.skills,
      experience: w.experience,
      hourlyRate: w.hourlyRate,
      location: w.location,
      serviceArea: w.serviceArea,
      cooperativeName: w.cooperativeName,
      cooperativeMemberId: w.cooperativeMemberId,
      verificationStatus: w.verificationStatus || 'PENDING',
      isListed: Boolean(w.isListed),
      rejectionReason: w.rejectionReason || null,
      governmentIdMasked: w.governmentIdRef ? `${w.governmentIdRef.substring(0, 6)}****${w.governmentIdRef.slice(-4)}` : 'AADHAAR-VERIFIED-AUTH',
      certifications: w.certifications || [w.primarySkill],
      createdAt: w.createdAt || new Date().toISOString()
    }));

    res.json(queue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verification queue.' });
  }
};

// Admin: Update Worker Verification (Approve / Reject)
const verifyWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body; // status: 'APPROVED', 'VERIFIED', 'REJECTED'

    if (!['APPROVED', 'VERIFIED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ message: 'Invalid verification status. Must be APPROVED, VERIFIED, REJECTED, or PENDING.' });
    }

    const worker = store.workers.find(w => w._id === id || w.userId === id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found.' });
    }

    worker.verificationStatus = status;
    worker.isListed = (status === 'APPROVED' || status === 'VERIFIED');
    worker.certificationStatus = (status === 'APPROVED' || status === 'VERIFIED');
    if (status === 'REJECTED') {
      worker.rejectionReason = rejectionReason || 'Documentation or profile details could not be verified.';
      worker.isAvailable = false;
    } else if (status === 'APPROVED' || status === 'VERIFIED') {
      worker.rejectionReason = null;
      worker.isAvailable = true;
    }

    res.json({
      message: `Worker verification status updated to ${status}.`,
      worker: sanitizeWorker(worker)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating worker verification.' });
  }
};

module.exports = {
  getWorkers,
  getWorkerById,
  updateWorkerProfile,
  toggleAvailability,
  getWorkerDashboard,
  getWelfareDetails,
  getAdminVerificationQueue,
  verifyWorker
};
