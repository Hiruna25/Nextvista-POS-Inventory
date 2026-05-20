const http = require('http');

const BASE_URL = 'http://localhost:3001/api';
let authToken = '';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(type, message) {
  const timestamp = new Date().toISOString();
  if (type === 'pass') {
    console.log(`${colors.green}✓ PASS${colors.reset} [${timestamp}] ${message}`);
  } else if (type === 'fail') {
    console.log(`${colors.red}✗ FAIL${colors.reset} [${timestamp}] ${message}`);
  } else if (type === 'info') {
    console.log(`${colors.cyan}ℹ INFO${colors.reset} [${timestamp}] ${message}`);
  } else if (type === 'test') {
    console.log(`\n${colors.yellow}━━━ TEST: ${message} ━━━${colors.reset}`);
  }
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve) => {
    // Build the full URL properly
    const fullPath = `/api/${path}`;
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: fullPath,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken ? `Bearer ${authToken}` : ''
      },
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers,
            error: 'Invalid JSON'
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 0,
        error: 'Request timeout'
      });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testHealthCheck() {
  log('test', 'Health Check');
  const res = await makeRequest('GET', 'health');
  if (res.status === 200) {
    log('pass', 'Health check endpoint working');
    return true;
  } else {
    log('fail', `Health check failed: ${res.error || res.status}`);
    return false;
  }
}

async function testLogin() {
  log('test', 'User Login');
  const res = await makeRequest('POST', 'auth/login', {
    username: 'Admin',
    password: 'Admin123'
  });
  if (res.status === 200 && res.data.success && res.data.data && res.data.data.token) {
    authToken = res.data.data.token;
    log('pass', 'Login successful - token obtained');
    return true;
  } else if (res.status === 200 && res.data.token) {
    // Handle if token is at root level
    authToken = res.data.token;
    log('pass', 'Login successful - token obtained');
    return true;
  } else {
    log('fail', `Login failed: ${res.status} - ${JSON.stringify(res.data?.message || res.error || res.data)}`);
    return false;
  }
}

async function testGetCategories() {
  log('test', 'Get Categories');
  const res = await makeRequest('GET', 'categories');
  if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
    log('pass', `Retrieved ${res.data.data.length} categories with pagination`);
    return true;
  } else {
    log('fail', `Categories endpoint failed: ${res.status} - ${res.data?.message || res.error}`);
    return false;
  }
}

async function testGetSuppliers() {
  log('test', 'Get Suppliers');
  const res = await makeRequest('GET', 'suppliers');
  if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
    log('pass', `Retrieved ${res.data.data.length} suppliers with pagination`);
    return true;
  } else {
    log('fail', `Suppliers endpoint failed: ${res.status} - ${res.data?.message || res.error}`);
    return false;
  }
}

async function testGetBranches() {
  log('test', 'Get Branches');
  const res = await makeRequest('GET', 'branches');
  if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
    log('pass', `Retrieved ${res.data.data.length} branches with pagination`);
    return true;
  } else {
    log('fail', `Branches endpoint failed: ${res.status} - ${res.data?.message || res.error}`);
    return false;
  }
}

async function testGetProducts() {
  log('test', 'Get Products');
  const res = await makeRequest('GET', 'products');
  if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
    log('pass', `Retrieved ${res.data.data.length} products with pagination`);
    return true;
  } else {
    log('fail', `Products endpoint failed: ${res.status} - ${res.data?.message || res.error}`);
    return false;
  }
}

async function testGetUsers() {
  log('test', 'Get Users');
  const res = await makeRequest('GET', 'users');
  if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
    log('pass', `Retrieved ${res.data.data.length} users with pagination`);
    return true;
  } else if (res.status === 403) {
    log('fail', 'Users endpoint: Permission denied (expected for non-admin)');
    return false;
  } else {
    log('fail', `Users endpoint failed: ${res.status} - ${res.data?.message || res.error}`);
    return false;
  }
}

async function testGetPOSTransactions() {
  log('test', 'Get POS Transactions');
  const res = await makeRequest('GET', 'pos-transactions');
  if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
    log('pass', `Retrieved ${res.data.data.length} POS transactions with pagination`);
    return true;
  } else {
    log('fail', `POS Transactions endpoint failed: ${res.status} - ${res.data?.message || res.error}`);
    return false;
  }
}

async function testGetInventoryHistory() {
  log('test', 'Get Inventory History');
  const res = await makeRequest('GET', 'inventory-history');
  if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
    log('pass', `Retrieved ${res.data.data.length} inventory history records with pagination`);
    return true;
  } else {
    log('fail', `Inventory History endpoint failed: ${res.status} - ${res.data?.message || res.error}`);
    return false;
  }
}

async function testGetSupplierOrders() {
  log('test', 'Get Supplier Orders');
  const res = await makeRequest('GET', 'supplier-orders');
  if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
    log('pass', `Retrieved ${res.data.data.length} supplier orders with pagination`);
    return true;
  } else {
    log('fail', `Supplier Orders endpoint failed: ${res.status} - ${res.data?.message || res.error}`);
    return false;
  }
}

async function testGetProfile() {
  log('test', 'Get User Profile');
  const res = await makeRequest('GET', 'users/profile');
  if (res.status === 200 && res.data.success && res.data.data) {
    log('pass', 'User profile endpoint working');
    return true;
  } else {
    log('fail', `User profile endpoint failed: ${res.status} - ${res.data?.message || res.error}`);
    return false;
  }
}

async function testErrorHandling() {
  log('test', 'Error Handling');
  const res = await makeRequest('GET', 'products/invalid-id');
  if (res.status === 500 || res.status === 404) {
    log('pass', 'Error handling middleware working');
    return true;
  } else {
    log('fail', `Error handling test failed: ${res.status}`);
    return false;
  }
}

async function testPagination() {
  log('test', 'Pagination');
  const res = await makeRequest('GET', 'products?page=1&limit=5');
  if (res.status === 200 && res.data.pagination && res.data.pagination.page === 1) {
    log('pass', `Pagination working: page ${res.data.pagination.page}, limit ${res.data.pagination.limit}, total ${res.data.pagination.total}`);
    return true;
  } else {
    log('fail', `Pagination test failed: ${res.status}`);
    return false;
  }
}

async function runAllTests() {
  console.log(`\n${colors.yellow}════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  POS BACKEND - COMPREHENSIVE DIAGNOSTICS  ${colors.reset}`);
  console.log(`${colors.yellow}════════════════════════════════════════${colors.reset}\n`);

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Login', fn: testLogin },
    { name: 'Get Categories', fn: testGetCategories },
    { name: 'Get Suppliers', fn: testGetSuppliers },
    { name: 'Get Branches', fn: testGetBranches },
    { name: 'Get Products', fn: testGetProducts },
    { name: 'Get Users', fn: testGetUsers },
    { name: 'Get POS Transactions', fn: testGetPOSTransactions },
    { name: 'Get Inventory History', fn: testGetInventoryHistory },
    { name: 'Get Supplier Orders', fn: testGetSupplierOrders },
    { name: 'Get User Profile', fn: testGetProfile },
    { name: 'Error Handling', fn: testErrorHandling },
    { name: 'Pagination', fn: testPagination }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n${colors.yellow}════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}SUMMARY: ${colors.green}${passed} PASSED${colors.reset} | ${colors.red}${failed} FAILED${colors.reset}`);
  console.log(`${colors.yellow}════════════════════════════════════════${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}🎉 ALL TESTS PASSED! System is functioning correctly.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}⚠️  ${failed} test(s) failed. Please review the errors above.${colors.reset}\n`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
