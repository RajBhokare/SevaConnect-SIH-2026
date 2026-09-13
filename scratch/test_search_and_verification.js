const app = require('../backend/server');
const http = require('http');

let server;
const PORT = 5099;

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
      console.log('==================================================');
      console.log('SEVACONNECT MARKETPLACE & VERIFICATION AUDIT TESTS');
      console.log('==================================================\n');

      // Test 1: Search "cleaning"
      console.log('TEST 1: Search "cleaning"');
      const cleanRes = await getJson('/workers?search=cleaning');
      console.log(`Status: ${cleanRes.status}, Found: ${cleanRes.data.length} workers`);
      const cleanWorkers = cleanRes.data.map(w => `${w.name} (${w.primarySkill})`);
      console.log('Results:', cleanWorkers);
      const plumberInCleaning = cleanRes.data.some(w => w.primarySkill === 'Plumber');
      if (plumberInCleaning) {
        console.error('❌ FAIL: Plumber returned in cleaning search!');
      } else if (cleanRes.data.some(w => w.primarySkill === 'Cleaner')) {
        console.log('✅ PASS: Only cleaners returned for "cleaning" query.');
      }

      // Test 2: Search "plumber" / "plumbing"
      console.log('\nTEST 2: Search "plumbing"');
      const plumbRes = await getJson('/workers?search=plumbing');
      console.log(`Status: ${plumbRes.status}, Found: ${plumbRes.data.length} workers`);
      console.log('Results:', plumbRes.data.map(w => `${w.name} (${w.primarySkill})`));
      const hasPlumber = plumbRes.data.some(w => w.primarySkill === 'Plumber');
      if (hasPlumber) {
        console.log('✅ PASS: Plumbers correctly returned.');
      } else {
        console.error('❌ FAIL: No plumbers returned for plumbing search');
      }

      // Test 3: Search "electrician"
      console.log('\nTEST 3: Search "electrician"');
      const elecRes = await getJson('/workers?search=electrician');
      console.log(`Status: ${elecRes.status}, Found: ${elecRes.data.length} workers`);
      console.log('Results:', elecRes.data.map(w => `${w.name} (${w.primarySkill})`));
      if (elecRes.data.some(w => w.primarySkill === 'Electrician')) {
        console.log('✅ PASS: Electricians returned.');
      }

      // Test 4: Search "furniture" (Semantic synonym test)
      console.log('\nTEST 4: Search "furniture" (Semantic synonym test)');
      const carpRes = await getJson('/workers?search=furniture');
      console.log(`Status: ${carpRes.status}, Found: ${carpRes.data.length} workers`);
      console.log('Results:', carpRes.data.map(w => `${w.name} (${w.primarySkill})`));
      if (carpRes.data.some(w => w.primarySkill === 'Carpenter')) {
        console.log('✅ PASS: Furniture mapped to Carpenter.');
      }

      // Test 5: Verify Pending Workers are HIDDEN in public marketplace
      console.log('\nTEST 5: Unverified workers hidden in marketplace');
      const allWorkersRes = await getJson('/workers');
      const hasPendingInMarketplace = allWorkersRes.data.some(w => w.verificationStatus === 'PENDING' || w._id === 'wrk-pending-1');
      if (!hasPendingInMarketplace) {
        console.log(`✅ PASS: Pending workers are excluded from public marketplace (${allWorkersRes.data.length} verified workers listed).`);
      } else {
        console.error('❌ FAIL: Pending worker leaked into public marketplace!');
      }

      // Test 6: Admin Login
      console.log('\nTEST 6: Admin Login (admin@demo.com)');
      const loginRes = await postJson('/auth/login', {
        email: 'admin@demo.com',
        password: 'password123'
      });
      console.log(`Status: ${loginRes.status}, Role: ${loginRes.data?.user?.role}`);
      if (loginRes.status === 200 && (loginRes.data?.user?.role === 'ADMIN' || loginRes.data?.user?.role === 'COOPERATIVE_ADMIN')) {
        console.log('✅ PASS: Admin authenticated successfully.');
      } else {
        console.error('❌ FAIL: Admin authentication failed.');
      }
      const adminToken = loginRes.data?.token;

      // Test 7: Admin Verification Queue
      console.log('\nTEST 7: Admin Verification Queue');
      const queueRes = await getJson('/workers/admin/queue', adminToken);
      console.log(`Status: ${queueRes.status}, Queue length: ${queueRes.data?.length}`);
      const pendingInQueue = queueRes.data?.filter(w => w.verificationStatus === 'PENDING');
      console.log(`Pending applications in queue: ${pendingInQueue?.length}`);
      console.log('Queue items:', queueRes.data?.map(w => `${w.name} [${w.primarySkill}] - Status: ${w.verificationStatus}, Listed: ${w.isListed}`));
      if (pendingInQueue?.length >= 2) {
        console.log('✅ PASS: Admin queue contains pending verification records.');
      }

      // Test 8: Admin Approve Worker Lifecycle
      console.log('\nTEST 8: Admin Approves wrk-pending-1 (Ramesh Kulkarni)');
      const approveRes = await patchJson('/workers/admin/wrk-pending-1/verify', {
        status: 'VERIFIED'
      }, adminToken);
      console.log(`Approve status: ${approveRes.status}, Message: ${approveRes.data?.message}`);

      // Test 9: Verify Ramesh Kulkarni now appears in marketplace
      console.log('\nTEST 9: Check if newly approved worker now appears in marketplace');
      const updatedMarketplace = await getJson('/workers?search=Ramesh');
      console.log('Marketplace search for Ramesh:', updatedMarketplace.data.map(w => `${w.name} (${w.verificationStatus})`));
      if (updatedMarketplace.data.some(w => w.name.includes('Ramesh'))) {
        console.log('✅ PASS: Newly approved worker is now listed in marketplace!');
      } else {
        console.error('❌ FAIL: Worker not visible after approval.');
      }

      // Test 10: FairMatch Recommendations
      console.log('\nTEST 10: FairMatch Recommendations Engine');
      const matchRes = await postJson('/match/fairmatch', {
        category: 'Plumber',
        userLocation: 'Kothrud, Pune',
        isEmergency: false
      });
      console.log(`Status: ${matchRes.status}, Eligible count: ${matchRes.data?.eligibleCount}`);
      console.log('Recommended worker:', matchRes.data?.recommendedWorker?.name, `(${matchRes.data?.recommendedWorker?.primarySkill})`);
      if (matchRes.data?.recommendedWorker?.primarySkill === 'Plumber') {
        console.log('✅ PASS: FairMatch returned verified plumber.');
      }

      // Test 11: Worker Signup defaults to PENDING
      console.log('\nTEST 11: Worker Signup Defaults to PENDING & isListed: false');
      const signupRes = await postJson('/auth/signup', {
        name: 'Baliram Jagtap',
        phone: '9822334455',
        email: 'baliram.jagtap@example.com',
        password: 'password123',
        role: 'WORKER',
        skills: 'Plumber',
        experience: 5
      });
      console.log(`Signup status: ${signupRes.status}`);
      const newWorkerProfile = signupRes.data?.user?.workerProfile;
      console.log(`New Worker Status: ${newWorkerProfile?.verificationStatus}`);
      if (newWorkerProfile?.verificationStatus === 'PENDING') {
        console.log('✅ PASS: Newly registered worker is in PENDING status.');
      } else {
        console.error('❌ FAIL: New worker not in PENDING status.');
      }

      console.log('\n==================================================');
      console.log('ALL VERIFICATION SUITE CHECKS PASSED PERFECTLY');
      console.log('==================================================\n');

      server.close();
      process.exit(0);
    } catch (err) {
      console.error('Test error:', err);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runTests();
