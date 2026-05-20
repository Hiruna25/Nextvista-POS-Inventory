# Frontend-Backend API Mismatch Summary

## Quick Reference: Missing Endpoints

### 🔴 CRITICAL ISSUES

#### 1. User Profile Management (0/2 implemented)
```
Frontend Calls:
- GET  /users/profile      ❌ NOT IN BACKEND
- PUT  /users/profile      ❌ NOT IN BACKEND

Impact: User profile page will fail
Fix: Add user routes file with profile endpoints
```

#### 2. Product Search (0/1 implemented)
```
Frontend Calls:
- GET  /products/search?q=query    ❌ NOT IN BACKEND

Impact: Search functionality broken
Fix: Add search route to products.js
```

#### 3. Supplier Details (0/2 implemented)
```
Frontend Calls:
- GET  /suppliers/{id}             ❌ NOT IN BACKEND
- GET  /suppliers/{id}/products    ❌ NOT IN BACKEND

Impact: Supplier detail views will fail
Fix: Add get single supplier endpoint to suppliers.js
```

---

## API Call Distribution

### By Service Layer
```
✅ Authentication (5/5)   - COMPLETE
✅ Products (5/6)         - 1 MISSING (search)
✅ Inventory (6/6)        - COMPLETE
❌ Users (0/2)            - 2 MISSING
⚠️  Suppliers (4/6)       - 2 MISSING
✅ Categories (1/1)       - COMPLETE
✅ Branches (1/1)         - COMPLETE
✅ POS Transactions (1/1) - COMPLETE
✅ Supplier Orders (1/1)  - COMPLETE
```

---

## Backend Route Files Status

| Route File | Total Endpoints | Frontend Uses | Missing |
|---|---|---|---|
| `auth.js` | 4 | 5 | 0 (but includes register) |
| `products.js` | 6 | 6 | 1 (search) |
| `categories.js` | 4 | 1 | - |
| `suppliers.js` | 4 | 6 | 2 (detail, products) |
| `branches.js` | 4 | 1 | - |
| `inventoryHistory.js` | 2 | 1 | - |
| `posTransactions.js` | 2 | 1 | - |
| `supplierOrders.js` | 3 | 1 | - |
| **users.js** | **NOT CREATED** | **2** | **2** |

---

## All Frontend API Endpoints Called

### From Services

**userService.ts:**
1. ✅ POST /auth/login
2. ✅ POST /auth/logout
3. ✅ POST /auth/refresh
4. ❌ GET /users/profile
5. ❌ PUT /users/profile

**productService.ts:**
6. ✅ GET /products
7. ✅ GET /products/{id}
8. ✅ POST /products
9. ✅ PUT /products/{id}
10. ✅ DELETE /products/{id}
11. ❌ GET /products/search

**inventoryService.ts:**
12. ✅ GET /products/{id} (reused)
13. ✅ GET /products (reused)
14. ✅ POST /products (reused)
15. ✅ POST /products/{id}/adjust-stock

**supplierService.ts:**
16. ✅ GET /suppliers
17. ❌ GET /suppliers/{id}
18. ✅ POST /suppliers
19. ✅ PUT /suppliers/{id}
20. ✅ DELETE /suppliers/{id}
21. ❌ GET /suppliers/{id}/products

**useInventoryData composable:**
22-34. ✅ All 7 GET endpoints and 6 POST/PUT endpoints

**Total: 21 unique frontend API calls**  
**Matching: 18 ✅**  
**Missing: 3 ❌**  

---

## How to Fix

### Step 1: Create `routes/users.js`
```javascript
const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

### Step 2: Add to `server.js`
```javascript
app.use('/api/users', require('./routes/users'));
```

### Step 3: Add product search to `routes/products.js`
```javascript
// Must come BEFORE router.get('/:id', ...)
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { barcode: { $regex: q, $options: 'i' } }
      ]
    }).populate('category supplier branch');
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Step 4: Add supplier detail endpoints to `routes/suppliers.js`
```javascript
// Get single supplier
router.get('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get supplier's products
router.get('/:id/products', auth, async (req, res) => {
  try {
    const products = await Product.find({ supplier_id: req.params.id })
      .populate('category', 'name')
      .populate('branch', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Testing the Endpoints

```bash
# Test user profile endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/users/profile

# Test product search
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/products/search?q=test

# Test supplier details
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/suppliers/SUPPLIER_ID

# Test supplier products
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/suppliers/SUPPLIER_ID/products
```

---

**Last Updated:** April 21, 2026
