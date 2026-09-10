// In-memory persistent demo store & seeding utility
const bcrypt = require('bcryptjs');

let users = [];
let workers = [];
let services = [
  {
    _id: 'srv-1',
    title: 'Plumbing Services',
    category: 'Plumber',
    description: 'Leak repairs, tap fittings, pipe blocks, flush tank and water tank maintenance.',
    startingPrice: 249,
    icon: 'Wrench',
    popularTasks: ['Tap & Leak Repair', 'Flush Tank Fix', 'Pipe Blockage Removal', 'Water Tank Cleaning']
  },
  {
    _id: 'srv-2',
    title: 'Electrical Repairs',
    category: 'Electrician',
    description: 'Switchboard wiring, fan & light installation, MCB tripping, appliance circuit check.',
    startingPrice: 199,
    icon: 'Zap',
    popularTasks: ['Switchboard Repair', 'Ceiling Fan Installation', 'MCB Tripping Fix', 'Short Circuit Check']
  },
  {
    _id: 'srv-3',
    title: 'Carpentry & Woodwork',
    category: 'Carpenter',
    description: 'Door lock & hinge repair, furniture assembly, cupboard fitting, wooden drill work.',
    startingPrice: 299,
    icon: 'Hammer',
    popularTasks: ['Door Lock / Handle Repair', 'Furniture Assembly', 'Drawer Slider Repair', 'Hinge Adjustment']
  },
  {
    _id: 'srv-4',
    title: 'Home & Deep Cleaning',
    category: 'Cleaner',
    description: 'Bathroom deep cleaning, kitchen degreasing, sofa & carpet shampooing.',
    startingPrice: 399,
    icon: 'Sparkles',
    popularTasks: ['Bathroom Deep Clean', 'Kitchen Degreasing', 'Sofa Shampooing', 'Balcony Cleaning']
  },
  {
    _id: 'srv-5',
    title: 'Painting & Waterproofing',
    category: 'Painter',
    description: 'Single wall texture, room touch-up, dampness sealing, full home painting.',
    startingPrice: 499,
    icon: 'Paintbrush',
    popularTasks: ['Wall Touch-up & Patch', 'Waterproofing / Seepage Fix', 'Single Wall Texture', 'Door Painting']
  },
  {
    _id: 'srv-6',
    title: 'Appliance Repair',
    category: 'Appliance Repair',
    description: 'Washing machine servicing, refrigerator cooling check, microwave repair.',
    startingPrice: 299,
    icon: 'Cpu',
    popularTasks: ['Washing Machine Drain Fix', 'Fridge Cooling Repair', 'Microwave Servicing', 'Geyser Installation']
  }
];

let bookings = [];
let payments = [];
let ratings = [];

const seedInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('password123', salt);

  // Default Customer
  const defaultCustomer = {
    _id: 'usr-cust-1',
    name: 'Rahul Deshmukh',
    phone: '9876543210',
    email: 'customer@demo.com',
    password: passwordHash,
    role: 'CUSTOMER',
    location: 'Kothrud, Pune',
    coordinates: { lat: 18.5074, lng: 73.8077 },
    createdAt: new Date().toISOString()
  };

  // Default Workers
  const defaultWorkerUser1 = {
    _id: 'usr-wrk-1',
    name: 'Santosh Shinde',
    phone: '9822011223',
    email: 'worker@demo.com',
    password: passwordHash,
    role: 'WORKER',
    location: 'Kothrud, Pune',
    coordinates: { lat: 18.5090, lng: 73.8090 },
    createdAt: new Date().toISOString()
  };

  const defaultWorkerUser2 = {
    _id: 'usr-wrk-2',
    name: 'Ganesh More',
    phone: '9822044556',
    email: 'ganesh@demo.com',
    password: passwordHash,
    role: 'WORKER',
    location: 'Karve Nagar, Pune',
    coordinates: { lat: 18.4912, lng: 73.8215 },
    createdAt: new Date().toISOString()
  };

  const defaultWorkerUser3 = {
    _id: 'usr-wrk-3',
    name: 'Anil Kamble',
    phone: '9822077889',
    email: 'anil@demo.com',
    password: passwordHash,
    role: 'WORKER',
    location: 'Shivajinagar, Pune',
    coordinates: { lat: 18.5314, lng: 73.8446 },
    createdAt: new Date().toISOString()
  };

  const defaultWorkerUser4 = {
    _id: 'usr-wrk-4',
    name: 'Suresh Patil',
    phone: '9822099001',
    email: 'suresh@demo.com',
    password: passwordHash,
    role: 'WORKER',
    location: 'Deccan Gymkhana, Pune',
    coordinates: { lat: 18.5167, lng: 73.8415 },
    createdAt: new Date().toISOString()
  };

  users = [defaultCustomer, defaultWorkerUser1, defaultWorkerUser2, defaultWorkerUser3, defaultWorkerUser4];

  // Worker Profiles with Initial AI Ranks & Metrics
  workers = [
    {
      _id: 'wrk-1',
      userId: 'usr-wrk-1',
      name: 'Santosh Shinde',
      phone: '9822011223',
      email: 'worker@demo.com',
      location: 'Kothrud, Pune',
      serviceArea: 'Kothrud, Karve Nagar, Deccan, Paud Road',
      coordinates: { lat: 18.5090, lng: 73.8090 },
      skills: ['Plumber', 'Pipe Fitting', 'Tap Repair', 'Water Tank Cleaning'],
      primarySkill: 'Plumber',
      experience: 8,
      hourlyRate: 299,
      cooperativeName: 'Maharashtra Shramik Swavalamban Cooperative',
      cooperativeMemberId: 'MSSC-4092',
      verificationStatus: 'VERIFIED',
      certificationStatus: true,
      welfareStatus: {
        insuranceActive: true,
        insurancePolicy: 'PM-SYM / Shramik Suraksha #7782',
        welfareFundContribution: 3850,
        totalEarnings: 34200
      },
      isAvailable: true,
      serviceRadius: 12,
      emergencyAvailable: true,
      rating: 4.9,
      reviewCount: 5,
      completedJobs: 58,
      activeWorkload: 1,
      bio: 'Certified Master Plumber with 8+ years experience. Specializes in rapid leak detection, brass fittings, and sanitary installations.',
      governmentIdRef: 'GOV-ID-ENC-9988',
      
      // AI Ranking
      rank: 'Diamond',
      score: 94,
      rankConfidence: 0.96,
      positiveFeedbackPercentage: 100,
      sentimentScore: 0.92,
      rankSummary: 'Diamond — 94/100: Consistently exceptional service quality, outstanding customer sentiment (100% positive), and trusted track record.',
      rankBreakdown: {
        ratingScore: 97.5,
        sentimentScore: 96.0,
        volumeScore: 100.0,
        consistencyScore: 98.0,
        reliabilityScore: 95.0
      },
      topCategories: ['Service Quality', 'Professionalism', 'Timeliness'],
      lastCalculatedAt: new Date().toISOString()
    },
    {
      _id: 'wrk-2',
      userId: 'usr-wrk-2',
      name: 'Ganesh More',
      phone: '9822044556',
      email: 'ganesh@demo.com',
      location: 'Karve Nagar, Pune',
      serviceArea: 'Karve Nagar, Kothrud, Warje, Sinhagad Road',
      coordinates: { lat: 18.4912, lng: 73.8215 },
      skills: ['Plumber', 'Electrician', 'Geyser Repair', 'Appliance Repair'],
      primarySkill: 'Plumber',
      experience: 5,
      hourlyRate: 260,
      cooperativeName: 'Maharashtra Shramik Swavalamban Cooperative',
      cooperativeMemberId: 'MSSC-5120',
      verificationStatus: 'VERIFIED',
      certificationStatus: true,
      welfareStatus: {
        insuranceActive: true,
        insurancePolicy: 'PM-SYM / Shramik Suraksha #8104',
        welfareFundContribution: 2100,
        totalEarnings: 21500
      },
      isAvailable: true,
      serviceRadius: 10,
      emergencyAvailable: true,
      rating: 4.3,
      reviewCount: 3,
      completedJobs: 34,
      activeWorkload: 0,
      bio: 'Skilled in residential plumbing, motor connections, and instant geyser maintenance.',
      governmentIdRef: 'GOV-ID-ENC-5544',
      
      // AI Ranking
      rank: 'Silver',
      score: 58,
      rankConfidence: 0.78,
      positiveFeedbackPercentage: 67,
      sentimentScore: 0.35,
      rankSummary: 'Silver — 58/100: Developing track record with moderate customer feedback and steady delivery.',
      rankBreakdown: {
        ratingScore: 65.0,
        sentimentScore: 60.0,
        volumeScore: 70.0,
        consistencyScore: 60.0,
        reliabilityScore: 50.0
      },
      topCategories: ['Service Quality', 'Pricing & Value'],
      lastCalculatedAt: new Date().toISOString()
    },
    {
      _id: 'wrk-3',
      userId: 'usr-wrk-3',
      name: 'Anil Kamble',
      phone: '9822077889',
      email: 'anil@demo.com',
      location: 'Shivajinagar, Pune',
      serviceArea: 'Shivajinagar, Model Colony, FC Road, Aundh',
      coordinates: { lat: 18.5314, lng: 73.8446 },
      skills: ['Electrician', 'Wiring', 'MCB Installation', 'Inverter Wiring'],
      primarySkill: 'Electrician',
      experience: 7,
      hourlyRate: 280,
      cooperativeName: 'Pune Shramik Kalyan Sahakari Sanstha',
      cooperativeMemberId: 'PSKS-1983',
      verificationStatus: 'VERIFIED',
      certificationStatus: true,
      welfareStatus: {
        insuranceActive: true,
        insurancePolicy: 'PM-SYM / Shramik Suraksha #9011',
        welfareFundContribution: 3100,
        totalEarnings: 28900
      },
      isAvailable: true,
      serviceRadius: 15,
      emergencyAvailable: true,
      rating: 4.7,
      reviewCount: 4,
      completedJobs: 49,
      activeWorkload: 0,
      bio: 'Licensed Wireman certified by State Electricity Board. Fast response for short circuits and home rewiring.',
      governmentIdRef: 'GOV-ID-ENC-3322',
      
      // AI Ranking
      rank: 'Gold',
      score: 72,
      rankConfidence: 0.86,
      positiveFeedbackPercentage: 75,
      sentimentScore: 0.65,
      rankSummary: 'Gold — 72/100: Good customer satisfaction and consistent performance across verified service tasks.',
      rankBreakdown: {
        ratingScore: 78.0,
        sentimentScore: 75.0,
        volumeScore: 85.0,
        consistencyScore: 80.0,
        reliabilityScore: 70.0
      },
      topCategories: ['Professionalism', 'Reliability', 'Service Quality'],
      lastCalculatedAt: new Date().toISOString()
    },
    {
      _id: 'wrk-4',
      userId: 'usr-wrk-4',
      name: 'Suresh Patil',
      phone: '9822099001',
      email: 'suresh@demo.com',
      location: 'Deccan Gymkhana, Pune',
      serviceArea: 'Deccan, Swargate, Sadashiv Peth, Narayan Peth',
      coordinates: { lat: 18.5167, lng: 73.8415 },
      skills: ['Carpenter', 'Furniture Assembly', 'Door Locks', 'Cupboard Repair'],
      primarySkill: 'Carpenter',
      experience: 10,
      hourlyRate: 350,
      cooperativeName: 'Maharashtra Shramik Swavalamban Cooperative',
      cooperativeMemberId: 'MSSC-3201',
      verificationStatus: 'VERIFIED',
      certificationStatus: true,
      welfareStatus: {
        insuranceActive: true,
        insurancePolicy: 'PM-SYM / Shramik Suraksha #6220',
        welfareFundContribution: 4200,
        totalEarnings: 41000
      },
      isAvailable: true,
      serviceRadius: 10,
      emergencyAvailable: false,
      rating: 4.8,
      reviewCount: 4,
      completedJobs: 71,
      activeWorkload: 2,
      bio: 'Expert carpenter specializing in modular kitchen fittings, Godrej locks, and custom woodwork.',
      governmentIdRef: 'GOV-ID-ENC-1100',
      
      // AI Ranking
      rank: 'Platinum',
      score: 84,
      rankConfidence: 0.90,
      positiveFeedbackPercentage: 100,
      sentimentScore: 0.85,
      rankSummary: 'Platinum — 84/100: Highly dependable artisan with strong positive feedback (100% positive) and proven field reliability.',
      rankBreakdown: {
        ratingScore: 88.0,
        sentimentScore: 86.0,
        volumeScore: 100.0,
        consistencyScore: 90.0,
        reliabilityScore: 85.0
      },
      topCategories: ['Service Quality', 'Timeliness', 'Professionalism'],
      lastCalculatedAt: new Date().toISOString()
    }
  ];

  // Seed Ratings with AI Sentiment metadata
  ratings = [
    {
      _id: 'rate-1',
      bookingId: 'bk-100',
      customerId: 'usr-cust-1',
      customerName: 'Rahul Deshmukh',
      workerId: 'wrk-1',
      stars: 5,
      comment: 'Superb work! Arrived right on time and fixed the leaking brass pipe cleanly. Highly skilled and polite.',
      sentiment: 'positive',
      sentimentScore: 0.95,
      confidence: 0.98,
      categories: ['Service Quality', 'Timeliness', 'Professionalism'],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      _id: 'rate-2',
      bookingId: 'bk-99',
      customerId: 'usr-cust-1',
      customerName: 'Priya Joshi',
      workerId: 'wrk-1',
      stars: 5,
      comment: 'Excellent plumbing service for our apartment flush tank. Very honest and reasonable rates.',
      sentiment: 'positive',
      sentimentScore: 0.92,
      confidence: 0.96,
      categories: ['Service Quality', 'Pricing & Value'],
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      _id: 'rate-3',
      bookingId: 'bk-98',
      customerId: 'usr-cust-1',
      customerName: 'Amit Sharma',
      workerId: 'wrk-1',
      stars: 5,
      comment: 'Fast emergency repair for kitchen sink water overflow. Cooperative verified artisan!',
      sentiment: 'positive',
      sentimentScore: 0.90,
      confidence: 0.95,
      categories: ['Timeliness', 'Reliability'],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      _id: 'rate-4',
      bookingId: 'bk-97',
      customerId: 'usr-cust-1',
      customerName: 'Sneha Kulkarni',
      workerId: 'wrk-1',
      stars: 5,
      comment: 'Clean installation of bathroom bib cock and washbasin tap. Perfect finish.',
      sentiment: 'positive',
      sentimentScore: 0.88,
      confidence: 0.92,
      categories: ['Service Quality'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      _id: 'rate-5',
      bookingId: 'bk-96',
      customerId: 'usr-cust-1',
      customerName: 'Sunil Rao',
      workerId: 'wrk-1',
      stars: 4,
      comment: 'Good overall work, explained the problem clearly.',
      sentiment: 'positive',
      sentimentScore: 0.70,
      confidence: 0.88,
      categories: ['Communication'],
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    // Ratings for Suresh Patil (Platinum)
    {
      _id: 'rate-6',
      bookingId: 'bk-95',
      customerId: 'usr-cust-1',
      customerName: 'Rohit Verma',
      workerId: 'wrk-4',
      stars: 5,
      comment: 'Master carpentry work. Fixed our heavy Godrej door lock and drawer slider flawlessly.',
      sentiment: 'positive',
      sentimentScore: 0.92,
      confidence: 0.94,
      categories: ['Service Quality', 'Reliability'],
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    {
      _id: 'rate-7',
      bookingId: 'bk-94',
      customerId: 'usr-cust-1',
      customerName: 'Kavita Mehta',
      workerId: 'wrk-4',
      stars: 5,
      comment: 'Very polite carpenter. Completed wardrobe hinge alignment with great care.',
      sentiment: 'positive',
      sentimentScore: 0.85,
      confidence: 0.90,
      categories: ['Professionalism', 'Service Quality'],
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      _id: 'rate-8',
      bookingId: 'bk-93',
      customerId: 'usr-cust-1',
      customerName: 'Vikas Patil',
      workerId: 'wrk-4',
      stars: 5,
      comment: 'Punctual arrival and fair charges.',
      sentiment: 'positive',
      sentimentScore: 0.80,
      confidence: 0.85,
      categories: ['Timeliness', 'Pricing & Value'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      _id: 'rate-9',
      bookingId: 'bk-92',
      customerId: 'usr-cust-1',
      customerName: 'Ananya Roy',
      workerId: 'wrk-4',
      stars: 4,
      comment: 'Solid woodwork repair, very cooperative.',
      sentiment: 'positive',
      sentimentScore: 0.70,
      confidence: 0.85,
      categories: ['Service Quality'],
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    // Ratings for Anil Kamble (Gold)
    {
      _id: 'rate-10',
      bookingId: 'bk-91',
      customerId: 'usr-cust-1',
      customerName: 'Deepak Naik',
      workerId: 'wrk-3',
      stars: 5,
      comment: 'Quickly fixed the MCB tripping issue in our kitchen circuit.',
      sentiment: 'positive',
      sentimentScore: 0.85,
      confidence: 0.90,
      categories: ['Service Quality', 'Timeliness'],
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      _id: 'rate-11',
      bookingId: 'bk-90',
      customerId: 'usr-cust-1',
      customerName: 'Meera Deshpande',
      workerId: 'wrk-3',
      stars: 5,
      comment: 'Polite electrician, installed ceiling fan properly.',
      sentiment: 'positive',
      sentimentScore: 0.80,
      confidence: 0.85,
      categories: ['Professionalism'],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      _id: 'rate-12',
      bookingId: 'bk-89',
      customerId: 'usr-cust-1',
      customerName: 'Girish Sawant',
      workerId: 'wrk-3',
      stars: 4,
      comment: 'Good work on inverter connection.',
      sentiment: 'positive',
      sentimentScore: 0.60,
      confidence: 0.80,
      categories: ['Service Quality'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      _id: 'rate-13',
      bookingId: 'bk-88',
      customerId: 'usr-cust-1',
      customerName: 'Sanjay Jadhav',
      workerId: 'wrk-3',
      stars: 4,
      comment: 'Satisfied with switchboard replacement.',
      sentiment: 'positive',
      sentimentScore: 0.60,
      confidence: 0.80,
      categories: ['Customer Satisfaction'],
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    // Ratings for Ganesh More (Silver)
    {
      _id: 'rate-14',
      bookingId: 'bk-87',
      customerId: 'usr-cust-1',
      customerName: 'Nitin Gore',
      workerId: 'wrk-2',
      stars: 4,
      comment: 'Repaired geyser thermostat, took some time but solved the issue.',
      sentiment: 'neutral',
      sentimentScore: 0.30,
      confidence: 0.75,
      categories: ['Service Quality'],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      _id: 'rate-15',
      bookingId: 'bk-86',
      customerId: 'usr-cust-1',
      customerName: 'Ravi Pawar',
      workerId: 'wrk-2',
      stars: 4,
      comment: 'Affordable rates, friendly person.',
      sentiment: 'positive',
      sentimentScore: 0.65,
      confidence: 0.80,
      categories: ['Pricing & Value', 'Communication'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      _id: 'rate-16',
      bookingId: 'bk-85',
      customerId: 'usr-cust-1',
      customerName: 'Suresh B.',
      workerId: 'wrk-2',
      stars: 3,
      comment: 'Arrived a bit late due to traffic, but completed tap replacement.',
      sentiment: 'neutral',
      sentimentScore: 0.10,
      confidence: 0.80,
      categories: ['Timeliness'],
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ];

  // Initial Sample Booking
  bookings = [
    {
      _id: 'bk-101',
      bookingId: 'BK-2026-001',
      customerId: 'usr-cust-1',
      customerName: 'Rahul Deshmukh',
      customerPhone: '9876543210',
      workerId: 'wrk-1',
      workerName: 'Santosh Shinde',
      workerPhone: '9822011223',
      serviceCategory: 'Plumber',
      serviceTitle: 'Plumbing Services',
      requirement: 'Kitchen sink tap leaking and low water pressure in washbasin',
      location: 'Flat 402, Anand Park, Kothrud, Pune',
      date: '2026-09-12',
      timeSlot: 'Morning (09:00 AM - 12:00 PM)',
      amount: 349,
      isEmergency: false,
      status: 'ACCEPTED',
      paymentStatus: 'PENDING',
      isRated: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  console.log('[Seed Engine]: Synchronous seed data initialized with demo customers, cooperative workers, rich AI ratings & ranks.');
};

seedInitialData();

module.exports = {
  users,
  workers,
  services,
  bookings,
  payments,
  ratings,
  seedInitialData
};
