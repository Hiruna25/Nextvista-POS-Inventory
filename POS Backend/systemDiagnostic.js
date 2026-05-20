const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
let token = null;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}🧪 ${msg}${colors.reset}`)
};

// Test 1: Health Check
async function testHealth() {
  log.test('Testing Health Endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.data.success) {
      log.success('Health Check Passed');
      return true;
    }
  } catch (error) {
    log.error('Health Check Failed: ' + error.message);
    return false;
  }
}

// Test 2: Login
async function testLogin() {
  log.test('Testing Login Endpoint');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'Admin',
      password: 'Admin123'
    });
    
    if (response.data.success && response.data.token) {
      token = response.data.token;
      log.success('Login Successful - Token received');
      log.info(`User: ${response.data.user.username}`);
      log.info(`Email: ${response.data.user.email}`);
      log.info(`Roles: ${response.data.user.roles.join(', ')}`);
      return true;
    }
  } catch (error) {
    log.error('Login Failed: ' + error.response?.data?.message || error.message);
    return false;
  }
}

// Test 3: Get Categories
async function testCategories() {
  log.test('Testing Categories Endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/categories?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      log.success(`Categories Retrieved - Total: ${response.data.pagination?.total || 0}`);
      if (response.data.data?.length > 0) {
        log.info(`First Category: ${response.data.data[0].name}`);
      }
      return true;
    }
  } catch (error) {
    log.error('Categories Failed: ' + error.response?.data?.message || error.message);
    return false;
  }
}

// Test 4: Get Suppliers
async function testSuppliers() {
  log.test('Testing Suppliers Endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/suppliers?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      log.success(`Suppliers Retrieved - Total: ${response.data.pagination?.total || 0}`);
      if (response.data.data?.length > 0) {
        log.info(`First Supplier: ${response.data.data[0].name}`);
      }
      return true;
    }
  } catch (error) {
    log.error('Suppliers Failed: ' + error.response?.data?.message || error.message);
    return false;
  }
}

// Test 5: Get Products
async function testProducts() {
  log.test('Testing Products Endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/products?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      log.success(`Products Retrieved - Total: ${response.data.pagination?.total || 0}`);
      if (response.data.data?.length > 0) {
        log.info(`First Product: ${response.data.data[0].name}`);
        log.info(`Price: $${response.data.data[0].price}`);
        log.info(`Stock: ${response.data.data[0].stockQuantity}`);
      } else {
        log.warning('No products found in database');
      }
      return true;
    }
  } catch (error) {
    log.error('Products Failed: ' + error.response?.data?.message || error.message);
    return false;
  }
}

// Test 6: Get Branches
async function testBranches() {
  log.test('Testing Branches Endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/branches?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      log.success(`Branches Retrieved - Total: ${response.data.pagination?.total || 0}`);
      if (response.data.data?.length > 0) {
        log.info(`First Branch: ${response.data.data[0].name}`);
      }
      return true;
    }
  } catch (error) {
    log.error('Branches Failed: ' + error.response?.data?.message || error.message);
    return false;
  }
}

// Test 7: Get Users
async function testUsers() {
  log.test('Testing Users Endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/users?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      log.success(`Users Retrieved - Total: ${response.data.pagination?.total || 0}`);
      if (response.data.data?.length > 0) {
        log.info(`First User: ${response.data.data[0].username}`);
      }
      return true;
    }
  } catch (error) {
    log.error('Users Failed: ' + error.response?.data?.message || error.message);
    return false;
  }
}

// Test 8: Get POS Transactions
async function testTransactions() {
  log.test('Testing POS Transactions Endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/pos-transactions?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      log.success(`Transactions Retrieved - Total: ${response.data.pagination?.total || 0}`);
      if (response.data.data?.length > 0) {
        log.info(`First Transaction ID: ${response.data.data[0]._id}`);
      } else {
        log.warning('No transactions found');
      }
      return true;
    }
  } catch (error) {
    log.error('Transactions Failed: ' + error.response?.data?.message || error.message);
    return false;
  }
}

// Test 9: Get Inventory History
async function testInventoryHistory() {
  log.test('Testing Inventory History Endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/inventory-history?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      log.success(`Inventory History Retrieved - Total: ${response.data.pagination?.total || 0}`);
      return true;
    }
  } catch (error) {
    log.error('Inventory History Failed: ' + error.response?.data?.message || error.message);
    return false;
  }
}

// Test 10: Get Supplier Orders
async function testSupplierOrders() {
  log.test('Testing Supplier Orders Endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/supplier-orders?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      log.success(`Supplier Orders Retrieved - Total: ${response.data.pagination?.total || 0}`);
      return true;
    }
  } catch (error) {
    log.error('Supplier Orders Failed: ' + error.response?.data?.message || error.message);
    return false;
  }
}

// Test 11: Database Connection Check
async function testDatabaseConnection() {
  log.test('Testing Database Connection');
  try {
    // Try to get a simple endpoint that requires DB connection
    const response = await axios.get(`${BASE_URL}/categories?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.status === 200) {
      log.success('Database Connection Working');
      return true;
    }
  } catch (error) {
    log.error('Database Connection Failed: ' + error.message);
    return false;
  }
}

// Test 12: Error Handling
async function testErrorHandling() {
  log.test('Testing Error Handling');
  try {
    // Try invalid endpoint
    await axios.get(`${BASE_URL}/invalid-endpoint`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    if (error.response?.status === 404) {
      log.success('Error Handling Working - 404 returned correctly');
      return true;
    }
  }
  log.error('Error Handling Not Working');
  return false;
}

// Test 13: Authentication
async function testAuthentication() {
  log.test('Testing Authentication');
  try {
    // Try without token
    await axios.get(`${BASE_URL}/products`);
  } catch (error) {
    if (error.response?.status === 401) {
      log.success('Authentication Working - 401 returned without token');
      return true;
    }
  }
  log.error('Authentication Not Working');
  return false;
}

// Test 14: Validation
async function testValidation() {
  log.test('Testing Input Validation');
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      username: 'Admin'
      // Missing password
    });
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Validation Working - 400 returned for invalid input');
      log.info(`Error: ${error.response.data.message}`);
      return true;
    }
  }
  log.error('Validation Not Working');
  return false;
}

// Main test runner
async function runAllTests() {
  console.log('\n' + colors.cyan + '═══════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.cyan + '         🧪 COMPREHENSIVE SYSTEM DIAGNOSTIC TEST' + colors.reset);
  console.log(colors.cyan + '═══════════════════════════════════════════════════════' + colors.reset + '\n');

  const results = [];

  // Run tests in sequence
  results.push({ name: 'Health Check', passed: await testHealth() });
  results.push({ name: 'Login', passed: await testLogin() });
  
  if (!token) {
    log.error('Cannot proceed - Login failed');
    printSummary(results);
    return;
  }

  results.push({ name: 'Database Connection', passed: await testDatabaseConnection() });
  results.push({ name: 'Categories', passed: await testCategories() });
  results.push({ name: 'Suppliers', passed: await testSuppliers() });
  results.push({ name: 'Products', passed: await testProducts() });
  results.push({ name: 'Branches', passed: await testBranches() });
  results.push({ name: 'Users', passed: await testUsers() });
  results.push({ name: 'POS Transactions', passed: await testTransactions() });
  results.push({ name: 'Inventory History', passed: await testInventoryHistory() });
  results.push({ name: 'Supplier Orders', passed: await testSupplierOrders() });
  results.push({ name: 'Error Handling', passed: await testErrorHandling() });
  results.push({ name: 'Authentication', passed: await testAuthentication() });
  results.push({ name: 'Input Validation', passed: await testValidation() });

  printSummary(results);
}

// Print summary
function printSummary(results) {
  console.log('\n' + colors.cyan + '═══════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.cyan + '                    📊 TEST SUMMARY' + colors.reset);
  console.log(colors.cyan + '═══════════════════════════════════════════════════════' + colors.reset + '\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
  });

  console.log('\n' + colors.cyan + '─────────────────────────────────────────────────────────' + colors.reset);
  console.log(`${colors.green}Passed: ${passed}${colors.reset} | ${colors.red}Failed: ${failed}${colors.reset}`);
  
  const passRate = ((passed / results.length) * 100).toFixed(1);
  const passColor = passRate >= 90 ? colors.green : passRate >= 70 ? colors.yellow : colors.red;
  console.log(`${passColor}Pass Rate: ${passRate}%${colors.reset}\n`);

  if (failed === 0) {
    console.log(colors.green + '🎉 ALL TESTS PASSED - SYSTEM IS HEALTHY!' + colors.reset + '\n');
  } else {
    console.log(colors.red + '⚠️  SOME TESTS FAILED - CHECK ERRORS ABOVE' + colors.reset + '\n');
  }

  console.log(colors.cyan + '═══════════════════════════════════════════════════════' + colors.reset + '\n');
}

// Run tests
runAllTests().catch(error => {
  log.error('Fatal Error: ' + error.message);
  process.exit(1);
});
