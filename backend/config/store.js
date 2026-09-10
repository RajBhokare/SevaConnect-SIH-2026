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

  // Worker Profiles with Cooperative, Verification and Welfare data
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
      reviewCount: 46,
      completedJobs: 58,
      activeWorkload: 1,
      bio: 'Certified Master Plumber with 8+ years experience. Specializes in rapid leak detection, brass fittings, and sanitary installations.',
      governmentIdRef: 'GOV-ID-ENC-9988'
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
      rating: 4.7,
      reviewCount: 29,
      completedJobs: 34,
      activeWorkload: 0,
      bio: 'Skilled in residential plumbing, motor connections, and instant geyser maintenance.',
      governmentIdRef: 'GOV-ID-ENC-5544'
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
      rating: 4.8,
      reviewCount: 38,
      completedJobs: 49,
      activeWorkload: 0,
      bio: 'Licensed Wireman certified by State Electricity Board. Fast response for short circuits and home rewiring.',
      governmentIdRef: 'GOV-ID-ENC-3322'
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
      rating: 4.9,
      reviewCount: 52,
      completedJobs: 71,
      activeWorkload: 2,
      bio: 'Expert carpenter specializing in modular kitchen fittings, Godrej locks, and custom woodwork.',
      governmentIdRef: 'GOV-ID-ENC-1100'
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

  console.log('[Seed Engine]: Synchronous seed data initialized with demo customers, workers, services, and bookings.');
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
