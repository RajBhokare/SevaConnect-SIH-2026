const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../config/store');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Customer / Worker Signup
const signup = async (req, res) => {
  try {
    const { name, phone, email, password, role = 'CUSTOMER', location, skills, experience, governmentIdRef } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (name, phone, email, password).' });
    }

    const existingUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.phone === phone);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserId = `usr-${Date.now()}`;
    const newUser = {
      _id: newUserId,
      name,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role.toUpperCase(),
      location: location || 'Kothrud, Pune',
      coordinates: { lat: 18.5074, lng: 73.8077 },
      createdAt: new Date().toISOString()
    };

    store.users.push(newUser);

    let workerProfile = null;
    if (newUser.role === 'WORKER') {
      const parsedSkills = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['General Services']);
      const primarySkill = parsedSkills[0] || 'Plumber';

      const newWorkerId = `wrk-${Date.now()}`;
      workerProfile = {
        _id: newWorkerId,
        userId: newUserId,
        name,
        phone,
        email: email.toLowerCase(),
        location: location || 'Pune',
        serviceArea: location ? `${location}, Surrounding Localities` : 'City Center',
        coordinates: { lat: 18.5074, lng: 73.8077 },
        skills: parsedSkills,
        primarySkill,
        experience: Number(experience) || 3,
        hourlyRate: 280,
        cooperativeName: 'Maharashtra Shramik Swavalamban Cooperative',
        cooperativeMemberId: `MSSC-${Math.floor(1000 + Math.random() * 9000)}`,
        verificationStatus: 'VERIFIED',
        certificationStatus: true,
        welfareStatus: {
          insuranceActive: true,
          insurancePolicy: `PM-SYM / Shramik Suraksha #${Math.floor(1000 + Math.random() * 9000)}`,
          welfareFundContribution: 1500,
          totalEarnings: 0
        },
        isAvailable: true,
        serviceRadius: 10,
        emergencyAvailable: true,
        rating: 5.0,
        reviewCount: 1,
        completedJobs: 0,
        activeWorkload: 0,
        bio: `Verified cooperative professional with ${experience || 3} years of expertise in ${primarySkill}.`,
        // Government ID is hashed/tokenized and private
        governmentIdRef: governmentIdRef ? `GOV-ID-${Math.random().toString(36).substring(7).toUpperCase()}` : 'GOV-ID-VERIFIED'
      };

      store.workers.push(workerProfile);
    }

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
        location: newUser.location,
        workerProfile: workerProfile ? {
          _id: workerProfile._id,
          primarySkill: workerProfile.primarySkill,
          skills: workerProfile.skills,
          isAvailable: workerProfile.isAvailable,
          verificationStatus: workerProfile.verificationStatus,
          cooperativeName: workerProfile.cooperativeName
        } : null
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    let workerProfile = null;
    if (user.role === 'WORKER') {
      const found = store.workers.find(w => w.userId === user._id || w.email.toLowerCase() === user.email.toLowerCase());
      if (found) {
        // Strip sensitive government ID reference before sending
        const { governmentIdRef, ...safeWorker } = found;
        workerProfile = safeWorker;
      }
    }

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        location: user.location,
        workerProfile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// Get current logged-in user profile
const getMe = async (req, res) => {
  try {
    const user = store.users.find(u => u._id === req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let workerProfile = null;
    if (user.role === 'WORKER') {
      const found = store.workers.find(w => w.userId === user._id || w.email.toLowerCase() === user.email.toLowerCase());
      if (found) {
        const { governmentIdRef, ...safeWorker } = found;
        workerProfile = safeWorker;
      }
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        location: user.location,
        workerProfile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user.' });
  }
};

module.exports = { signup, login, getMe };
