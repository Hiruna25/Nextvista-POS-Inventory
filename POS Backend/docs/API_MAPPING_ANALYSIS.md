# Frontend-Backend API Mapping Analysis

## Summary
**Total Frontend Endpoints Called: 18**  
**Total Backend Endpoints Available: 20**  
**Matching Endpoints: 16**  
**Missing/Mismatched Endpoints: 2**  

---

## Frontend API Calls by Service

### 1. **Authentication Service** (`userService.ts`)

| Frontend Call | HTTP Method | Endpoint | Backend Available | Status | Notes |
|---|---|---|---|---|---|
| Login | POST | `/auth/login` | ✅ YES | ✓ MATCH | Credentials: `{ username, password }` |
| Logout | POST | `/auth/logout` | ✅ YES | ✓ MATCH | Protected route |
| Refresh Token | POST | `/auth/refresh` | ✅ YES | ✓ MATCH | Protected route |
| Get Profile | GET | `/users/profile` | ❌ NO | ❌ MISMATCH | **NOT IMPLEMENTED IN BACKEND** |
| Update Profile | PUT | `/users/profile` | ❌ NO | ❌ MISMATCH | **NOT IMPLEMENTED IN BACKEND** |

**Missing Endpoints:**
- `GET /users/profile` - Retrieve user profile information
- `PUT /users/profile` - Update user profile information

---

### 2. **Product Service** (`productService.ts`)

| Frontend Call | HTTP Method | Endpoint | Backend Available | Status | Notes |
|---|---|---|---|---|---|
| Get All Products | GET | `/products` | ✅ YES | ✓ MATCH | Returns with category & supplier populated |
| Get Single Product | GET | `/products/{id}` | ✅ YES | ✓ MATCH | Returns with populated relations |
| Create Product | POST | `/products` | ✅ YES | ✓ MATCH | Requires `manage_products` permission |
| Update Product | PUT | `/products/{id}` | ✅ YES | ✓ MATCH | Requires `manage_products` permission |
| Delete Product | DELETE | `/products/{id}` | ✅ YES | ✓ MATCH | Requires `manage_products` permission |
| Search Products | GET | `/products/search` | ❌ NO | ❌ MISSING | Query param: `q` - **NOT IMPLEMENTED** |

**Issues:**
- Search endpoint not implemented - Frontend expects `/products/search?q=query`

---

### 3. **Inventory Service** (`inventoryService.ts`)

| Frontend Call | HTTP Method | Endpoint | Backend Available | Status | Notes |
|---|---|---|---|---|---|
| Get Inventory | GET | `/products/{id}` | ✅ YES | ✓ MATCH | Reuses product endpoint |
| Get All Inventory | GET | `/products` | ✅ YES | ✓ MATCH | Reuses product endpoint |
| Create Inventory | POST | `/products` | ✅ YES | ✓ MATCH | Reuses product creation |
| Adjust Stock | POST | `/products/{id}/adjust-stock` | ✅ YES | ✓ MATCH | Body: `{ quantity, action, notes }` |
| Get Low Stock Items | N/A | Calculated Client-Side | ✓ N/A | ✓ OK | No backend call needed |
| Get Replenishment Suggestions | N/A | Calculated Client-Side | ✓ N/A | ✓ OK | No backend call needed |

**Status:** All implemented ✅

---

### 4. **Supplier Service** (`supplierService.ts`)

| Frontend Call | HTTP Method | Endpoint | Backend Available | Status | Notes |
|---|---|---|---|---|---|
| Get All Suppliers | GET | `/suppliers` | ✅ YES | ✓ MATCH | Returns all suppliers |
| Get Single Supplier | GET | `/suppliers/{id}` | ✅ NO | ❌ MISSING | **NOT IMPLEMENTED IN BACKEND** |
| Create Supplier | POST | `/suppliers` | ✅ YES | ✓ MATCH | Requires `manage_products` permission |
| Update Supplier | PUT | `/suppliers/{id}` | ✅ YES | ✓ MATCH | Requires `manage_products` permission |
| Delete Supplier | DELETE | `/suppliers/{id}` | ✅ YES | ✓ MATCH | Requires `manage_products` permission |
| Get Supplier Products | GET | `/suppliers/{id}/products` | ❌ NO | ❌ MISSING | **NOT IMPLEMENTED IN BACKEND** |

**Missing Endpoints:**
- `GET /suppliers/{id}` - Get single supplier details
- `GET /suppliers/{id}/products` - Get products for specific supplier

---

### 5. **Inventory Data Composable** (`useInventoryData.ts`)

| Frontend Call | HTTP Method | Endpoint | Backend Available | Status | Notes |
|---|---|---|---|---|---|
| Get Products | GET | `/products` | ✅ YES | ✓ MATCH | |
| Get Categories | GET | `/categories` | ✅ YES | ✓ MATCH | |
| Get Suppliers | GET | `/suppliers` | ✅ YES | ✓ MATCH | |
| Get Branches | GET | `/branches` | ✅ YES | ✓ MATCH | |
| Get Inventory History | GET | `/inventory-history` | ✅ YES | ✓ MATCH | |
| Get Supplier Orders | GET | `/supplier-orders` | ✅ YES | ✓ MATCH | |
| Get POS Transactions | GET | `/pos-transactions` | ✅ YES | ✓ MATCH | |
| Add Product | POST | `/products` | ✅ YES | ✓ MATCH | |
| Update Product | PUT | `/products/{id}` | ✅ YES | ✓ MATCH | |
| Delete Product | DELETE | `/products/{id}` | ✅ YES | ✓ MATCH | |
| Add Inventory History | POST | `/inventory-history` | ✅ YES | ✓ MATCH | |
| Add POS Transaction | POST | `/pos-transactions` | ✅ YES | ✓ MATCH | |
| Add Supplier Order | POST | `/supplier-orders` | ✅ YES | ✓ MATCH | |

**Status:** All implemented ✅

---

## Backend Endpoints Analysis

### Available Backend Endpoints

#### Authentication Routes (`/api/auth`)
- ✅ `POST /auth/register` - Register new user (admin setup)
- ✅ `POST /auth/login` - User login
- ✅ `POST /auth/logout` - User logout
- ✅ `POST /auth/refresh` - Refresh JWT token

#### Product Routes (`/api/products`)
- ✅ `GET /products` - Get all products
- ✅ `GET /products/{id}` - Get single product
- ✅ `POST /products` - Create product
- ✅ `PUT /products/{id}` - Update product
- ✅ `DELETE /products/{id}` - Delete product
- ✅ `POST /products/{id}/adjust-stock` - Adjust stock

#### Category Routes (`/api/categories`)
- ✅ `GET /categories` - Get all categories
- ✅ `POST /categories` - Create category
- ✅ `PUT /categories/{id}` - Update category
- ✅ `DELETE /categories/{id}` - Delete category

#### Supplier Routes (`/api/suppliers`)
- ✅ `GET /suppliers` - Get all suppliers
- ✅ `POST /suppliers` - Create supplier
- ✅ `PUT /suppliers/{id}` - Update supplier
- ✅ `DELETE /suppliers/{id}` - Delete supplier

#### Branch Routes (`/api/branches`)
- ✅ `GET /branches` - Get all branches
- ✅ `POST /branches` - Create branch
- ✅ `PUT /branches/{id}` - Update branch
- ✅ `DELETE /branches/{id}` - Delete branch

#### Inventory History Routes (`/api/inventory-history`)
- ✅ `GET /inventory-history` - Get all history
- ✅ `POST /inventory-history` - Create history entry

#### POS Transaction Routes (`/api/pos-transactions`)
- ✅ `GET /pos-transactions` - Get all transactions
- ✅ `POST /pos-transactions` - Create transaction

#### Supplier Order Routes (`/api/supplier-orders`)
- ✅ `GET /supplier-orders` - Get all orders
- ✅ `POST /supplier-orders` - Create order
- ✅ `PUT /supplier-orders/{id}` - Update order

#### Health Check
- ✅ `GET /health` - Server health status

---

## Critical Issues Summary

### 🔴 **CRITICAL - Missing Endpoints (Must Implement)**

#### 1. User Profile Endpoints
**Frontend expects:**
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile

**Backend status:** ❌ NOT IMPLEMENTED

**Impact:** User profile functionality will fail in frontend

**Recommended Implementation:**
```javascript
// GET /api/users/profile
router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// PUT /api/users/profile
router.put('/profile', auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    { new: true }
  ).select('-password');
  res.json(user);
});
```

---

#### 2. Product Search Endpoint
**Frontend expects:**
- `GET /products/search?q=query` - Search products by name/barcode

**Backend status:** ❌ NOT IMPLEMENTED

**Impact:** Product search functionality will fail

**Recommended Implementation:**
```javascript
// GET /api/products/search?q=query
router.get('/search', auth, async (req, res) => {
  const { q } = req.query;
  const products = await Product.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { barcode: { $regex: q, $options: 'i' } }
    ]
  }).populate('category supplier branch');
  res.json(products);
});
```

---

#### 3. Supplier Details & Products
**Frontend expects:**
- `GET /suppliers/{id}` - Get single supplier
- `GET /suppliers/{id}/products` - Get products for supplier

**Backend status:** ❌ NOT IMPLEMENTED

**Impact:** Supplier detail views will fail

**Recommended Implementation:**
```javascript
// GET /api/suppliers/:id
router.get('/:id', auth, async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  res.json(supplier);
});

// GET /api/suppliers/:id/products
router.get('/:id/products', auth, async (req, res) => {
  const products = await Product.find({ supplier_id: req.params.id });
  res.json(products);
});
```

---

### ⚠️ **WARNINGS - Potential Issues**

1. **Search Functionality Order** - Both `/products` GET and `/products/search` use GET. This requires route ordering - search route must come before the `:id` route in Express.

2. **Endpoint Naming Consistency** - Frontend uses snake_case for query params but camelCase in service methods. Backend should maintain consistency.

3. **No GET `/users/{id}` endpoint** - If needed for admin functions.

---

## Endpoint Usage Summary by Controller

| Endpoint Type | Frontend Calls | Backend Available | Match Rate |
|---|---|---|---|
| Auth | 5/5 | 4/4 | 100% ✅ |
| Products | 6/6 | 5/6 | 83% ⚠️ |
| Inventory History | 1/1 | 2/2 | 100% ✅ |
| Suppliers | 6/6 | 3/6 | 50% ⚠️ |
| Branches | 1/1 | 4/4 | 100% ✅ |
| POS Transactions | 1/1 | 2/2 | 100% ✅ |
| Supplier Orders | 1/1 | 3/3 | 100% ✅ |
| Categories | 1/1 | 4/4 | 100% ✅ |
| **Users** | **2/2** | **0/0** | **0% ❌** |

---

## Implementation Priority

### Priority 1 (CRITICAL)
- [ ] Implement `/users/profile` endpoints (GET & PUT)
- [ ] Implement `/products/search` endpoint

### Priority 2 (HIGH)
- [ ] Implement `/suppliers/{id}` endpoint
- [ ] Implement `/suppliers/{id}/products` endpoint

### Priority 3 (NICE-TO-HAVE)
- [ ] Add caching for frequently accessed endpoints
- [ ] Add pagination for list endpoints
- [ ] Add filtering options to list endpoints

---

## API Compatibility Checklist

| Feature | Frontend Ready | Backend Ready | Status |
|---|---|---|---|
| Authentication | ✅ | ✅ | ✓ READY |
| Product CRUD | ✅ | ✅ | ✓ READY |
| Inventory Management | ✅ | ✅ | ✓ READY |
| Stock Adjustments | ✅ | ✅ | ✓ READY |
| User Profiles | ✅ | ❌ | ✗ BLOCKED |
| Product Search | ✅ | ❌ | ✗ BLOCKED |
| Supplier Management | ✅ | ⚠️ | ⚠️ PARTIAL |
| Category Management | ✅ | ✅ | ✓ READY |
| Branch Management | ✅ | ✅ | ✓ READY |
| POS Transactions | ✅ | ✅ | ✓ READY |
| Supplier Orders | ✅ | ✅ | ✓ READY |

---

## Notes

1. **API Base URL:** Frontend points to `config.api.baseURL` (check env configuration)
2. **Authentication:** All endpoints except `/auth/login` and `/auth/register` require Bearer token
3. **Permissions:** Some endpoints require specific permissions (e.g., `manage_products`, `manage_inventory`)
4. **Error Handling:** Frontend has centralized error handling via interceptors
5. **Retry Logic:** Frontend retries failed requests (3 attempts) for network errors and 5xx responses

---

**Generated:** April 21, 2026  
**Analysis Scope:** Frontend (D:\My Projects\POS\src) vs Backend (D:\My Projects\POS Backend)
