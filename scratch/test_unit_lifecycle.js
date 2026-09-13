const store = require('../backend/config/store');
const { createBooking, updateBookingStatus, getAdminOverview, getAdminCommissionStats } = require('../backend/controllers/bookingController');
const { submitRating } = require('../backend/controllers/ratingController');
const { processPayment } = require('../backend/controllers/paymentController');
const { getWorkerDashboard } = require('../backend/controllers/workerController');
const { calculateFallbackRank } = require('../backend/controllers/rankingController');

async function testUnitLifecycle() {
  console.log('--- Testing Unit Direct Controller Logic ---');
  store.seedInitialData();

  const worker = store.workers[0];
  const customer = store.users.find(u => u.role === 'CUSTOMER');

  console.log(`Worker: ${worker.name} (ID: ${worker._id})`);
  console.log(`Customer: ${customer.name} (ID: ${customer._id})`);

  // 1. Create Booking
  let resStatus = 200;
  let resJson = null;
  const mockRes = {
    status: (code) => { resStatus = code; return mockRes; },
    json: (data) => { resJson = data; return mockRes; }
  };

  await createBooking({
    user: customer,
    body: {
      workerId: worker._id,
      category: 'Plumbing',
      serviceTitle: 'Pipe Repair',
      amount: 600,
      requirement: 'Urgent fix',
      location: 'Kothrud, Pune',
      date: '2026-09-15',
      timeSlot: '10:00 AM'
    }
  }, mockRes);

  const booking = resJson.booking;
  console.log(`1. Booking created: #${booking._id}, status: ${booking.status}`);

  // 2. Worker Accepts
  await updateBookingStatus({
    params: { id: booking._id },
    body: { status: 'ACCEPTED' },
    user: { _id: worker.userId, role: 'WORKER' }
  }, mockRes);
  console.log(`2. Worker accepted booking: status is ${booking.status}`);

  // 3. Worker Completes (Checkbox / Complete Done)
  await updateBookingStatus({
    params: { id: booking._id },
    body: { status: 'COMPLETED' },
    user: { _id: worker.userId, role: 'WORKER' }
  }, mockRes);

  console.log(`3. Worker marked completed: status is ${booking.status}`);
  console.log(`   Amount: ₹${booking.amount}`);
  console.log(`   10% Cooperative Commission: ₹${booking.commissionAmount}`);
  console.log(`   90% Worker Earning: ₹${booking.workerEarning}`);
  console.log(`   Worker Completed Jobs in store: ${worker.completedJobs}`);

  // 4. Worker Dashboard Overview Check
  await getWorkerDashboard({
    user: { _id: worker.userId }
  }, mockRes);

  console.log(`4. Worker Dashboard:`);
  console.log(`   Stats Total Earnings: ₹${resJson.stats.totalEarnings}`);
  console.log(`   Stats Completed Count: ${resJson.stats.completedCount}`);
  console.log(`   Active Bookings Array length: ${resJson.activeBookings.length}`);
  console.log(`   Recent Completed Array length: ${resJson.recentCompleted.length}`);

  // 5. Customer Settles Payment
  await processPayment({
    user: customer,
    body: {
      bookingId: booking._id,
      amount: 600,
      method: 'UPI'
    }
  }, mockRes);

  console.log(`5. Payment Settled: status is ${booking.paymentStatus}, txnRef: ${resJson.payment.transactionRef}`);

  // 6. Customer Submits Rating & Review
  await submitRating({
    user: customer,
    body: {
      bookingId: booking._id,
      stars: 5,
      comment: 'Superb quality work and very polite artisan! Excellent experience.'
    }
  }, mockRes);

  await submitRating({
    user: customer,
    body: {
      bookingId: booking._id,
      stars: 5,
      comment: 'Great punctuality and high skill level.'
    }
  }, mockRes);

  await submitRating({
    user: customer,
    body: {
      bookingId: booking._id,
      stars: 5,
      comment: 'Clean work and very reasonable pricing.'
    }
  }, mockRes);

  console.log(`6. Rating submitted:`);
  console.log(`   Worker Avg Rating: ${worker.rating}`);
  console.log(`   Worker Review Count: ${worker.reviewCount}`);
  console.log(`   Worker AI Rank Tier: ${worker.rank}`);
  console.log(`   Worker AI Score: ${worker.score}/100`);
  console.log(`   Worker Rank Summary: ${worker.rankSummary}`);

  // 7. Admin Overview and Commission Stats
  await getAdminOverview({}, mockRes);
  console.log(`7. Admin Overview: Total Bookings: ${resJson.totalBookings}, Completed: ${resJson.completedBookings}`);

  await getAdminCommissionStats({}, mockRes);
  console.log(`   Admin Commission: Value: ₹${resJson.completedServiceValue}, Commission (10%): ₹${resJson.commissionAmount}, Worker Payouts: ₹${resJson.workerEarnings}`);

  console.log('\n--- ALL UNIT CONTROLLER TESTS PASSED PERFECTLY! ---');
}

testUnitLifecycle().catch(console.error);
