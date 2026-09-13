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
  },
  {
    _id: 'srv-7',
    title: 'Domestic Help & Housekeeping',
    category: 'Domestic Helper',
    description: 'Daily household assistance, dishwashing, dusting, floor mopping, kitchen support.',
    startingPrice: 199,
    icon: 'Users',
    popularTasks: ['Daily Kitchen Help', 'Full House Dusting', 'Dishwashing Support', 'Weekly Deep Mopping']
  },
  {
    _id: 'srv-8',
    title: 'Elder & Patient Caregiving',
    category: 'Caregiver',
    description: 'Compassionate assistance for senior citizens, mobility support, medicine reminders.',
    startingPrice: 349,
    icon: 'HeartHandshake',
    popularTasks: ['Elder Companion Care', 'Mobility & Walking Assist', 'Medicine Timetable Support', 'Post-Op Assistance']
  },
  {
    _id: 'srv-9',
    title: 'Gardening & Plant Care',
    category: 'Gardener',
    description: 'Lawn mowing, balcony garden pruning, repotting, organic pest control, soil tilling.',
    startingPrice: 249,
    icon: 'Sparkles',
    popularTasks: ['Balcony Garden Setup', 'Plant Pruning & Trimming', 'Organic Soil Tilling', 'Pest Control Spray']
  },
  {
    _id: 'srv-10',
    title: 'On-Demand & Chauffeur Driving',
    category: 'Driver',
    description: 'Temporary car drivers, outstation journeys, city transit, and emergency driving.',
    startingPrice: 299,
    icon: 'ShieldCheck',
    popularTasks: ['City Intra-Transit', 'Airport Drop & Pickup', 'Outstation Highway Driver', 'Senior Citizen Transit']
  },
  {
    _id: 'srv-11',
    title: 'Other Community Household Services',
    category: 'Other Household Services',
    description: 'Pest control, water purifier servicing, rooftop waterproofing, small masonry repairs.',
    startingPrice: 249,
    icon: 'Wrench',
    popularTasks: ['RO Filter Service', 'Masonry Touchup', 'Pest Extermination', 'Balcony Netting Fix']
  }
];

let bookings = [];
let payments = [];
let ratings = [];

const seedInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('password123', salt);

  // Default Admin
  const defaultAdmin = {
    _id: 'usr-admin-1',
    name: 'Cooperative Admin (Pune Federation)',
    phone: '9822000000',
    email: 'admin@demo.com',
    password: passwordHash,
    role: 'ADMIN',
    location: 'Shivajinagar, Pune',
    coordinates: { lat: 18.5314, lng: 73.8446 },
    createdAt: new Date().toISOString()
  };

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

  const defaultWorkerUser5 = {
    _id: 'usr-wrk-5',
    name: 'Kavita Shinde',
    phone: '9822088776',
    email: 'kavita@demo.com',
    password: passwordHash,
    role: 'WORKER',
    location: 'Karve Nagar, Pune',
    coordinates: { lat: 18.4950, lng: 73.8250 },
    createdAt: new Date().toISOString()
  };

  const defaultWorkerUser6 = {
    _id: 'usr-wrk-6',
    name: 'Vinayak Gaikwad',
    phone: '9822033221',
    email: 'vinayak@demo.com',
    password: passwordHash,
    role: 'WORKER',
    location: 'Kothrud, Pune',
    coordinates: { lat: 18.5020, lng: 73.8050 },
    createdAt: new Date().toISOString()
  };

  users = [defaultAdmin, defaultCustomer, defaultWorkerUser1, defaultWorkerUser2, defaultWorkerUser3, defaultWorkerUser4, defaultWorkerUser5, defaultWorkerUser6];

  // Worker Profiles with Initial AI Ranks & Metric  // Verified Workers initialized with real zero-baseline stats
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
      skills: ['Plumber', 'Pipe Fitting', 'Tap Repair', 'Drainage Clearing'],
      primarySkill: 'Plumber',
      experience: 8,
      hourlyRate: 299,
      cooperativeName: 'Maharashtra Shramik Swavalamban Cooperative',
      cooperativeMemberId: 'MSSC-4092',
      verificationStatus: 'VERIFIED',
      isListed: true,
      certificationStatus: true,
      certifications: [
        { name: 'Govt. Water Supply & Plumbing Certification', issuer: 'Maharashtra Vocational Board', year: '2019', verified: true }
      ],
      welfareStatus: {
        insuranceActive: true,
        insurancePolicy: 'PM-SYM / Shramik Suraksha #7782',
        welfareFundContribution: 0,
        totalEarnings: 0
      },
      isAvailable: true,
      serviceRadius: 12,
      emergencyAvailable: true,
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      activeWorkload: 0,
      bio: 'Certified Master Plumber with 8+ years experience. Specializes in rapid leak detection, brass fittings, and sanitary installations.',
      governmentIdRef: 'GOV-ID-ENC-9988',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
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
      isListed: true,
      certificationStatus: true,
      certifications: [
        { name: 'Appliance Repair & Wiring License', issuer: 'ITI Pune', year: '2020', verified: true }
      ],
      welfareStatus: {
        insuranceActive: true,
        insurancePolicy: 'PM-SYM / Shramik Suraksha #8104',
        welfareFundContribution: 0,
        totalEarnings: 0
      },
      isAvailable: true,
      serviceRadius: 10,
      emergencyAvailable: true,
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      activeWorkload: 0,
      bio: 'Skilled in residential plumbing, motor connections, and instant geyser maintenance.',
      governmentIdRef: 'GOV-ID-ENC-5544',
      createdAt: new Date(Date.now() - 86400000 * 9).toISOString()
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
      skills: ['Electrician', 'Wiring', 'MCB Installation', 'Inverter Wiring', 'Electrical Repair'],
      primarySkill: 'Electrician',
      experience: 7,
      hourlyRate: 280,
      cooperativeName: 'Pune Shramik Kalyan Sahakari Sanstha',
      cooperativeMemberId: 'PSKS-1983',
      verificationStatus: 'VERIFIED',
      isListed: true,
      certificationStatus: true,
      certifications: [
        { name: 'Disaster Safety Wireman License', issuer: 'Maharashtra Energy Board', year: '2021', verified: true }
      ],
      welfareStatus: {
        insuranceActive: true,
        insurancePolicy: 'PM-SYM / Shramik Suraksha #9011',
        welfareFundContribution: 0,
        totalEarnings: 0
      },
      isAvailable: true,
      serviceRadius: 15,
      emergencyAvailable: true,
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      activeWorkload: 0,
      bio: 'Licensed Wireman certified by State Electricity Board. Fast response for short circuits and home rewiring.',
      governmentIdRef: 'GOV-ID-ENC-3322',
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
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
      skills: ['Carpenter', 'Furniture Assembly', 'Door Locks', 'Cupboard Repair', 'Woodwork'],
      primarySkill: 'Carpenter',
      experience: 10,
      hourlyRate: 350,
      cooperativeName: 'Maharashtra Shramik Swavalamban Cooperative',
      cooperativeMemberId: 'MSSC-3201',
      verificationStatus: 'VERIFIED',
      isListed: true,
      certificationStatus: true,
      certifications: [
        { name: 'National Trade Certificate (Carpentry)', issuer: 'NCVT', year: '2018', verified: true }
      ],
      welfareStatus: {
        insuranceActive: true,
        insurancePolicy: 'PM-SYM / Shramik Suraksha #6220',
        welfareFundContribution: 0,
        totalEarnings: 0
      },
      isAvailable: true,
      serviceRadius: 10,
      emergencyAvailable: false,
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      activeWorkload: 0,
      bio: 'Expert carpenter specializing in modular kitchen fittings, Godrej locks, and custom woodwork.',
      governmentIdRef: 'GOV-ID-ENC-1100',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      _id: 'wrk-5',
      userId: 'usr-wrk-5',
      name: 'Kavita Shinde',
      phone: '9822088776',
      email: 'kavita@demo.com',
      location: 'Karve Nagar, Pune',
      serviceArea: 'Karve Nagar, Kothrud, Deccan, Warje',
      coordinates: { lat: 18.4950, lng: 73.8250 },
      skills: ['Cleaner', 'Deep Home Cleaning', 'Kitchen Degreasing', 'Bathroom Cleaning', 'Sofa Shampooing', 'Sanitization'],
      primarySkill: 'Cleaner',
      experience: 6,
      hourlyRate: 249,
      cooperativeName: 'South Pune Federation',
      cooperativeMemberId: 'MSSC-7412',
      verificationStatus: 'VERIFIED',
      isListed: true,
      certificationStatus: true,
      certifications: [
        { name: 'NSDC Skill India Sanitation Certificate', issuer: 'NSDC', year: '2022', verified: true },
        { name: 'Cooperative Self-Help Group Accreditation', issuer: 'MSSC Pune', year: '2023', verified: true }
      ],
      welfareStatus: {
        insuranceActive: true,
        insurancePolicy: 'PM-SYM / Shramik Suraksha #4432',
        welfareFundContribution: 0,
        totalEarnings: 0
      },
      isAvailable: true,
      serviceRadius: 10,
      emergencyAvailable: false,
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      activeWorkload: 0,
      bio: 'NSDC certified sanitization specialist with 6+ years in residential deep cleaning, kitchen degreasing, and upholstery care.',
      governmentIdRef: 'GOV-ID-ENC-7744',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    {
      _id: 'wrk-6',
      userId: 'usr-wrk-6',
      name: 'Vinayak Gaikwad',
      phone: '9822033221',
      email: 'vinayak@demo.com',
      location: 'Kothrud, Pune',
      serviceArea: 'Kothrud, Karve Nagar, Deccan, Aundh',
      coordinates: { lat: 18.5020, lng: 73.8050 },
      skills: ['Painter', 'Wall Painting', 'Waterproofing', 'Single Wall Texture', 'Touch-up & Patch'],
      primarySkill: 'Painter',
      experience: 9,
      hourlyRate: 320,
      cooperativeName: 'Maharashtra Shramik Swavalamban Cooperative',
      cooperativeMemberId: 'MSSC-8819',
      verificationStatus: 'VERIFIED',
      isListed: true,
      certificationStatus: true,
      certifications: [
        { name: 'Master Painter & Surface Coating Certificate', issuer: 'Pune PMC Guild', year: '2019', verified: true }
      ],
      welfareStatus: {
        insuranceActive: true,
        insurancePolicy: 'PM-SYM / Shramik Suraksha #5567',
        welfareFundContribution: 0,
        totalEarnings: 0
      },
      isAvailable: true,
      serviceRadius: 12,
      emergencyAvailable: false,
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      activeWorkload: 0,
      bio: 'Expert wall painter and waterproofing specialist. 9 years experience delivering flawless textures and weather-coat applications.',
      governmentIdRef: 'GOV-ID-ENC-9911',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    // Seed Pending Verification Workers (For Admin Queue Review Workflow)
    {
      _id: 'wrk-pending-1',
      userId: 'usr-wrk-p1',
      name: 'Ramesh Kulkarni',
      phone: '9822055667',
      email: 'ramesh.k@example.com',
      location: 'Shivajinagar, Pune',
      serviceArea: 'Shivajinagar, Central Pune',
      coordinates: { lat: 18.5314, lng: 73.8446 },
      skills: ['Plumber', 'Pipe Fitter', 'Commercial Plumbing'],
      primarySkill: 'Plumber',
      experience: 8,
      hourlyRate: 300,
      cooperativeName: 'Central Federation',
      cooperativeMemberId: 'WRK-6520',
      verificationStatus: 'PENDING',
      isListed: false,
      certificationStatus: false,
      certifications: [
        { name: 'Govt. Water Supply Plumbing License', issuer: 'Pune PMC', year: '2018', verified: false }
      ],
      welfareStatus: {
        insuranceActive: false,
        insurancePolicy: '',
        welfareFundContribution: 0,
        totalEarnings: 0
      },
      isAvailable: true,
      serviceRadius: 10,
      emergencyAvailable: true,
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      activeWorkload: 0,
      bio: 'Experienced municipal and residential pipe fitter awaiting cooperative accreditation verification.',
      governmentIdRef: 'GOV-ID-SUBMITTED-8822',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      _id: 'wrk-pending-2',
      userId: 'usr-wrk-p2',
      name: 'Sunita Jadhav',
      phone: '9822011998',
      email: 'sunita.j@example.com',
      location: 'Warje, Pune',
      serviceArea: 'Warje, Kothrud, Karve Nagar',
      coordinates: { lat: 18.4800, lng: 73.8000 },
      skills: ['Domestic Helper', 'Housekeeping', 'Kitchen Help', 'Floor Cleaning'],
      primarySkill: 'Domestic Helper',
      experience: 4,
      hourlyRate: 199,
      cooperativeName: 'West Pune Federation',
      cooperativeMemberId: 'WRK-3319',
      verificationStatus: 'PENDING',
      isListed: false,
      certificationStatus: false,
      certifications: [
        { name: 'Cooperative Self-Help Group Accreditation', issuer: 'MSSC Pune', year: '2023', verified: false }
      ],
      welfareStatus: {
        insuranceActive: false,
        insurancePolicy: '',
        welfareFundContribution: 0,
        totalEarnings: 0
      },
      isAvailable: true,
      serviceRadius: 8,
      emergencyAvailable: false,
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      activeWorkload: 0,
      bio: 'Dedicated household assistance and kitchen support artisan with verified local references.',
      governmentIdRef: 'GOV-ID-SUBMITTED-4411',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ];

  // No hardcoded bookings, payments or ratings: starts completely clean
  bookings = [];
  payments = [];
  ratings = [];

  console.log('[Seed Engine]: Synchronous seed data initialized with verified artisans and pending verification queue.');
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
