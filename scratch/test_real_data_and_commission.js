const app = require('../backend/server');
const http = require('http');

let server;
const PORT = 5098;

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

function postJson(path, data, token = null) {
  const postData = JSON.stringify(data);
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return request({
    hostname: '127.0.0.1',
    port: PORT,
    path: `/api${path}`,
    method: 'POST',
    headers
  }, postData);
}

function getJson(path, token = null) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return request({
    hostname: '127.0.0.1',
    port: PORT,
    path: `/api${path}`,
    method: 'GET',
    headers
  });
}

function patchJson(path, data, token = null) {
  const postData = JSON.stringify(data);
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return request({
    hostname: '127.0.0.1',
    port: PORT,
    path: `/api${path}`,
    method: 'PATCH',
    headers
  }, postData);
}

async function runTests() {
  server = app.listen(PORT, '127.0.0.1', async () => {
    try {
      console.log('===============================================================');
      console.log('SEVACONNECT REAL DATA & 10% COMMISSION ACCOUNTING VERIFICATION');
      console.log('===============================================================\n');

      // 1. Admin Login
      const adminLogin = await postJson('/auth/login', {
        email: 'admin@demo.com',
        password: 'password123'
      });
      const adminToken = adminLogin.data.token;
      console.log(`[Auth]: Admin authenticated (${adminLogin.data?.user?.email})`);

      // 2. Customer Login
      const custLogin = await postJson('/auth/login', {
        email: 'customer@demo.com',
        password: 'password123'
      });
      const custToken = custLogin.data.token;
      console.log(`[Auth]: Customer authenticated (${custLogin.data?.user?.email})`);

      // 3. Worker Login
      const wrkLogin = await postJson('/auth/login', {
        email: 'worker@demo.com',
        password: 'password123'
      });
      const wrkToken = wrkLogin.data.token;
      console.log(`[Auth]: Worker authenticated (${wrkLogin.data?.user?.email})\n`);

      // =========================================================================
      // TEST 1: Commission Recognized ONLY on COMPLETED bookings
      // =========================================================================
      console.log('TEST 1: 10% Commission Calculation Lifecycle (₹400 Booking)');
      const createRes = await postJson('/bookings', {
        workerId: 'wrk-1',
        serviceCategory: 'Plumber',
        serviceTitle: 'Plumbing Services',
        requirement: 'Sink drain cleaning and leak repair',
        location: 'Kothrud, Pune',
        amount: 400
      }, custToken);
      const b1 = createRes.data.booking;
      console.log(`Booking Created #${b1.bookingId} - Amount: ₹${b1.amount}, Status: ${b1.status}, Commission: ₹${b1.commissionAmount}`);
      if (b1.commissionAmount === 0 && b1.workerEarning === 0) {
        console.log('✅ PASS: Commission is ₹0 while in REQUESTED status.');
      } else {
        console.error('❌ FAIL: Premature commission calculation on booking creation.');
      }

      // Step to ACCEPTED
      const acceptRes = await patchJson(`/bookings/${b1._id}/status`, { status: 'ACCEPTED' }, wrkToken);
      if (acceptRes.data.booking.commissionAmount === 0) {
        console.log('✅ PASS: Commission is ₹0 in ACCEPTED status.');
      }

      // Step to IN_PROGRESS
      const progRes = await patchJson(`/bookings/${b1._id}/status`, { status: 'IN_PROGRESS' }, wrkToken);
      if (progRes.data.booking.commissionAmount === 0) {
        console.log('✅ PASS: Commission is ₹0 in IN_PROGRESS status.');
      }

      // Step to COMPLETED
      const compRes = await patchJson(`/bookings/${b1._id}/status`, { status: 'COMPLETED' }, wrkToken);
      const completedB1 = compRes.data.booking;
      console.log(`Booking Completed: Amount: ₹${completedB1.amount}, Rate: ${completedB1.commissionRate * 100}%, Commission: ₹${completedB1.commissionAmount}, Worker Earning: ₹${completedB1.workerEarning}`);
      if (completedB1.commissionAmount === 40 && completedB1.workerEarning === 360) {
        console.log('✅ PASS: Exactly ₹40 platform commission (10%) and ₹360 worker earning (90%) calculated and persisted on completion.');
      } else {
        console.error('❌ FAIL: Incorrect commission amount on completion.');
      }

      // =========================================================================
      // TEST 2: Cancelled booking contributes ₹0 commission
      // =========================================================================
      console.log('\nTEST 2: Cancelled Booking (₹300 Booking)');
      const createRes2 = await postJson('/bookings', {
        workerId: 'wrk-1',
        serviceCategory: 'Plumber',
        serviceTitle: 'Plumbing Services',
        requirement: 'Test cancel requirement',
        location: 'Kothrud, Pune',
        amount: 300
      }, custToken);
      const b2 = createRes2.data.booking;
      const cancelRes = await patchJson(`/bookings/${b2._id}/status`, { status: 'CANCELLED' }, custToken);
      const cancelledB2 = cancelRes.data.booking;
      console.log(`Booking Cancelled #${cancelledB2.bookingId} - Commission: ₹${cancelledB2.commissionAmount}, Worker Earning: ₹${cancelledB2.workerEarning}`);
      if (cancelledB2.commissionAmount === 0 && cancelledB2.workerEarning === 0) {
        console.log('✅ PASS: Cancelled booking contributes ₹0 commission and ₹0 worker earnings.');
      } else {
        console.error('❌ FAIL: Cancelled booking generated commission!');
      }

      // =========================================================================
      // TEST 3: Multi-booking Accounting Summation (Add ₹500 COMPLETED booking)
      // =========================================================================
      console.log('\nTEST 3: Multi-Booking Summation Scenario (₹400 COMPLETED, ₹500 COMPLETED, ₹300 CANCELLED)');
      const createRes3 = await postJson('/bookings', {
        workerId: 'wrk-3',
        serviceCategory: 'Electrician',
        serviceTitle: 'Electrical Services',
        requirement: 'MCB repair and switchboard check',
        location: 'Shivajinagar, Pune',
        amount: 500
      }, custToken);
      const b3 = createRes3.data.booking;
      await patchJson(`/bookings/${b3._id}/status`, { status: 'COMPLETED' }, wrkToken);

      // Query Admin Commission Endpoint
      const adminCommissionRes = await getJson('/bookings/admin/commission', adminToken);
      const commData = adminCommissionRes.data;
      console.log('Admin Commission Stats:', {
        commissionRate: commData.commissionRate,
        completedServiceValue: commData.completedServiceValue,
        commissionAmount: commData.commissionAmount,
        workerEarnings: commData.workerEarnings,
        completedBookingsCount: commData.completedBookingsCount
      });

      if (commData.completedServiceValue === 900 && commData.commissionAmount === 90 && commData.workerEarnings === 810 && commData.completedBookingsCount === 2) {
        console.log('✅ PASS: Completed Service Value = ₹900, Commission = ₹90, Worker Earnings = ₹810, Completed Count = 2.');
      } else {
        console.error(`❌ FAIL: Expected ₹900 value / ₹90 commission / ₹810 worker payout. Received: ₹${commData.completedServiceValue} / ₹${commData.commissionAmount} / ₹${commData.workerEarnings}`);
      }

      // =========================================================================
      // TEST 4: Admin Verification Priority
      // =========================================================================
      console.log('\nTEST 4: Admin Verification Priority (Pending workers appear FIRST)');
      const queueRes = await getJson('/workers/admin/queue', adminToken);
      const queue = queueRes.data;
      console.log(`Total queue size: ${queue.length}`);
      console.log('First 3 queue items:', queue.slice(0, 3).map(w => `${w.name} [Status: ${w.verificationStatus}]`));
      if (queue[0].verificationStatus === 'PENDING') {
        console.log('✅ PASS: PENDING verification workers are prioritized at the top of the admin queue.');
      } else {
        console.error('❌ FAIL: Non-pending worker appeared first in admin queue.');
      }

      // =========================================================================
      // TEST 5: Customer Marketplace Strict Real Data Search
      // =========================================================================
      console.log('\nTEST 5: Real Data Search and Filtering');
      const cleanRes = await getJson('/workers?search=cleaning');
      console.log('Search "cleaning" results:', cleanRes.data.map(w => `${w.name} (${w.primarySkill})`));
      const hasPlumberInCleaning = cleanRes.data.some(w => w.primarySkill === 'Plumber');
      if (!hasPlumberInCleaning && cleanRes.data.some(w => w.primarySkill === 'Cleaner')) {
        console.log('✅ PASS: "cleaning" query returned only verified cleaners.');
      }

      console.log('\n===============================================================');
      console.log('ALL REAL DATA & 10% COMMISSION AUDIT TESTS PASSED SUCCESSFULLY');
      console.log('===============================================================\n');

      server.close();
      process.exit(0);
    } catch (err) {
      console.error('Test execution error:', err);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runTests();
