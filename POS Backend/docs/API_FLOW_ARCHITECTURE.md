# API Flow Architecture & Mapping

## Frontend → Backend Request Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER (Vue.js)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Pages                    Components              Stores                     │
│  ├─ Login.vue            ├─ InventoryTable.vue  ├─ auth.ts                  │
│  ├─ Dashboard.vue        ├─ ProductModal.vue    └─ app.ts                   │
│  └─ NotFound.vue         └─ StockAdjustmentModal.vue                        │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │ (imports)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER (TypeScript)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐   │
│  │  userService.ts      │  │  productService.ts   │  │ supplierService  │   │
│  ├──────────────────────┤  ├──────────────────────┤  ├──────────────────┤   │
│  │ • login()            │  │ • getProducts()      │  │ • getSuppliers() │   │
│  │ • logout()           │  │ • getProduct(id)     │  │ • getSupplier()❌│   │
│  │ • refreshToken()     │  │ • createProduct()    │  │ • createSupplier│   │
│  │ • getProfile()❌     │  │ • updateProduct()    │  │ • updateSupplier│   │
│  │ • updateProfile()❌  │  │ • deleteProduct()    │  │ • deleteSupplier│   │
│  │                      │  │ • searchProducts()❌ │  │ • getSupplier   │   │
│  │                      │  │                      │  │   Products()❌  │   │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────┘   │
│                                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐                          │
│  │ inventoryService.ts  │  │ analyticsService.ts  │                          │
│  ├──────────────────────┤  ├──────────────────────┤                          │
│  │ • getInventory()     │  │ • trackEvent()       │                          │
│  │ • getAllInventory()  │  │ • trackPageView()    │                          │
│  │ • createInventory()  │  │ • trackUserLogin()   │                          │
│  │ • adjustStock()      │  │ • flushEvents()      │                          │
│  │ • getLowStockItems() │  │                      │                          │
│  │ • getReplenishment() │  │                      │                          │
│  └──────────────────────┘  └──────────────────────┘                          │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │ (calls)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      API SERVICE LAYER (api.ts)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ ApiService (Singleton)                                             │    │
│  ├────────────────────────────────────────────────────────────────────┤    │
│  │ • Axios instance with interceptors                                 │    │
│  │ • Request: Adds Bearer token from localStorage                    │    │
│  │ • Response: Handles 401 (unauthorized)                            │    │
│  │ • Retry: 3 attempts for network/5xx errors                        │    │
│  │ • Methods: get<T>(), post<T>(), put<T>(), delete<T>()            │    │
│  │ • Error Handling: Returns ApiResponse wrapper                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │ (axios HTTP)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NETWORK LAYER (HTTP)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  POST   /api/auth/login                ✅                                   │
│  POST   /api/auth/logout               ✅                                   │
│  POST   /api/auth/refresh              ✅                                   │
│  GET    /api/auth/register             ✅                                   │
│                                                                               │
│  GET    /api/users/profile             ❌ MISSING                           │
│  PUT    /api/users/profile             ❌ MISSING                           │
│                                                                               │
│  GET    /api/products                  ✅                                   │
│  GET    /api/products/{id}             ✅                                   │
│  POST   /api/products                  ✅                                   │
│  PUT    /api/products/{id}             ✅                                   │
│  DELETE /api/products/{id}             ✅                                   │
│  POST   /api/products/{id}/adjust-stock ✅                                  │
│  GET    /api/products/search           ❌ MISSING                           │
│                                                                               │
│  GET    /api/suppliers                 ✅                                   │
│  GET    /api/suppliers/{id}            ❌ MISSING                           │
│  POST   /api/suppliers                 ✅                                   │
│  PUT    /api/suppliers/{id}            ✅                                   │
│  DELETE /api/suppliers/{id}            ✅                                   │
│  GET    /api/suppliers/{id}/products   ❌ MISSING                           │
│                                                                               │
│  GET    /api/categories                ✅                                   │
│  POST   /api/categories                ✅                                   │
│  PUT    /api/categories/{id}           ✅                                   │
│  DELETE /api/categories/{id}           ✅                                   │
│                                                                               │
│  GET    /api/branches                  ✅                                   │
│  POST   /api/branches                  ✅                                   │
│  PUT    /api/branches/{id}             ✅                                   │
│  DELETE /api/branches/{id}             ✅                                   │
│                                                                               │
│  GET    /api/inventory-history         ✅                                   │
│  POST   /api/inventory-history         ✅                                   │
│                                                                               │
│  GET    /api/pos-transactions          ✅                                   │
│  POST   /api/pos-transactions          ✅                                   │
│                                                                               │
│  GET    /api/supplier-orders           ✅                                   │
│  POST   /api/supplier-orders           ✅                                   │
│  PUT    /api/supplier-orders/{id}      ✅                                   │
│                                                                               │
│  GET    /api/health                    ✅                                   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │ (Express routing)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER (Express.js)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Route Files:                                                                │
│  ├─ auth.js              (4 endpoints)                                      │
│  ├─ users.js             (0 endpoints) ❌ FILE MISSING                       │
│  ├─ products.js          (6 endpoints) - missing search                     │
│  ├─ categories.js        (4 endpoints)                                      │
│  ├─ suppliers.js         (4 endpoints) - missing detail & products          │
│  ├─ branches.js          (4 endpoints)                                      │
│  ├─ inventoryHistory.js  (2 endpoints)                                      │
│  ├─ posTransactions.js   (2 endpoints)                                      │
│  ├─ supplierOrders.js    (3 endpoints)                                      │
│  └─ seed.js              (utility)                                          │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │ (database queries)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER (MongoDB)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Collections:                                                                │
│  ├─ users              (authentication)                                     │
│  ├─ products           (inventory items)                                    │
│  ├─ categories         (product categories)                                 │
│  ├─ suppliers          (vendor information)                                 │
│  ├─ branches           (store locations)                                    │
│  ├─ inventoryhistory   (stock movement log)                                │
│  ├─ postransactions    (POS sales)                                          │
│  └─ supplierorders     (purchase orders)                                    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Missing Endpoints - Impact Analysis

### 1. User Profile Endpoints

```
User clicks "Profile" → Login.vue component
        ↓
calls authStore.getProfile()
        ↓
calls apiService.get('/users/profile')
        ↓
❌ ENDPOINT NOT FOUND: 404 Error
        ↓
User sees error message, profile page fails to load
```

**Fix Location:** Create `routes/users.js`

---

### 2. Product Search Endpoint

```
User types search query → SearchBox emits query
        ↓
calls productService.searchProducts(query)
        ↓
calls apiService.get('/products/search', { params: { q: query }})
        ↓
❌ ENDPOINT NOT FOUND: 404 Error
        ↓
Search results show error, no filtering happens
```

**Fix Location:** Add to `routes/products.js` (BEFORE /:id route)

---

### 3. Supplier Detail Endpoints

```
User clicks on supplier → SupplierModal component
        ↓
calls supplierService.getSupplier(id)
        ↓
calls apiService.get('/suppliers/{id}')
        ↓
❌ ENDPOINT NOT FOUND: 404 Error
        ↓
Supplier details fail to load
```

**AND**

```
Supplier modal loads → Fetches products for supplier
        ↓
calls supplierService.getSupplierProducts(supplierId)
        ↓
calls apiService.get('/suppliers/{id}/products')
        ↓
❌ ENDPOINT NOT FOUND: 404 Error
        ↓
Supplier products section shows error
```

**Fix Location:** Add to `routes/suppliers.js`

---

## Data Flow Example: Product Creation

```
1. User fills ProductModal form
   └─> Form data: { name, barcode, category_id, supplier_id, ... }

2. Clicks "Save Product"
   └─> Modal emits @save event with form data

3. Parent component receives event
   └─> calls useInventoryData().addProduct(formData)

4. Composable function executes
   └─> calls productService.createProduct(formData)

5. Service validates data
   └─> validateSchema(ProductSchema, data)
   └─> If invalid, throws error

6. Service makes API call
   └─> apiService.post<Product>('/products', data)

7. ApiService interceptor adds token
   └─> Reads token from localStorage
   └─> Adds Authorization header: "Bearer {token}"

8. Axios sends HTTP request
   └─> POST /api/products
   └─> Headers: { Authorization, Content-Type }
   └─> Body: { name, barcode, ... }

9. Express backend receives request
   └─> Routes to products.js POST handler
   └─> Middleware checks auth token (jwt.verify)
   └─> Middleware checks permission (requirePermission)

10. Handler creates MongoDB document
    └─> const product = new Product(req.body)
    └─> await product.save()

11. Handler returns response
    └─> res.status(201).json(product)

12. Axios receives response
    └─> Response interceptor logs success
    └─> Returns ApiResponse wrapper

13. Service receives response
    └─> Checks response.success === true
    └─> Returns response.data (the product)

14. Composable receives product
    └─> Adds to inventory.value array
    └─> Returns product to component

15. Component receives product
    └─> Closes modal
    └─> Updates table with new product
    └─> Shows success notification
```

---

## Request/Response Format

### Successful Request Example

**Frontend sends:**
```javascript
POST /api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "Laptop",
  "barcode": "123456789",
  "category_id": "507f1f77bcf86cd799439011",
  "supplier_id": "507f1f77bcf86cd799439012",
  "cost": 500,
  "price": 899,
  "stock_quantity": 10,
  "min_stock_level": 2,
  "max_stock_level": 50,
  "description": "Gaming Laptop"
}
```

**Backend responds:**
```javascript
201 Created
Content-Type: application/json

{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Laptop",
  "barcode": "123456789",
  "category": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Electronics"
  },
  "supplier": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Tech Supplier"
  },
  "cost": 500,
  "price": 899,
  "stock_quantity": 10,
  "min_stock_level": 2,
  "max_stock_level": 50,
  "description": "Gaming Laptop",
  "createdAt": "2026-04-21T10:30:00.000Z",
  "updatedAt": "2026-04-21T10:30:00.000Z"
}
```

**Frontend receives and transforms:**
```javascript
{
  success: true,
  data: {
    _id: "507f1f77bcf86cd799439013",
    name: "Laptop",
    // ... rest of product data
  }
}
```

---

## Error Handling Flow

```
User makes API call
        ↓
Axios sends request
        ↓
❌ Error occurs (network, server, validation)
        ↓
Response interceptor catches error
        ↓
Is it 401 Unauthorized?
  ├─ YES: Clear token, dispatch auth:unauthorized event
  └─ NO: Continue to error handler
        ↓
handleError() utility processes error
        ↓
Return Promise.reject with custom error
        ↓
Service catches error
        ↓
Service checks skipErrorHandling flag
  ├─ YES: Re-throw error to component
  └─ NO: Return ApiResponse with success: false
        ↓
Component receives error response
        ↓
Display error notification to user
```

---

## Authentication & Token Management

```
Login Page
    ↓
User enters credentials
    ↓
POST /api/auth/login { username, password }
    ↓ (no auth needed - skipAuth: true)
Backend verifies password with bcrypt
    ↓
Returns: { token, user }
    ↓
Frontend stores token in localStorage
    ↓
Set in auth store
    ↓
Redirect to dashboard
    ↓
All subsequent requests include token:
  Authorization: Bearer {token}
    ↓
Backend middleware (auth.js) verifies token
    ↓
If valid: Extract user info, continue
If invalid: Return 401, frontend clears token
```

---

## Component Integration Points

### useInventoryData Composable

```
Dashboard.vue
    ├─ mounted() → loadInitialData()
    │  └─ Makes 7 parallel GET requests
    │     ├─ /products
    │     ├─ /categories
    │     ├─ /suppliers
    │     ├─ /branches
    │     ├─ /inventory-history
    │     ├─ /supplier-orders
    │     └─ /pos-transactions
    │
    ├─ Watch inventory.value
    │  └─ Updates dashboard charts
    │
    ├─ InventoryTable component
    │  ├─ emits @edit → ProductModal
    │  ├─ emits @adjust-stock → StockAdjustmentModal
    │  └─ emits @delete → Confirm & delete
    │
    ├─ ProductModal component
    │  ├─ emits @save → addProduct() or updateProduct()
    │  └─ Makes POST or PUT /products
    │
    ├─ StockAdjustmentModal component
    │  ├─ emits @save → adjustStock()
    │  └─ Makes POST /products/{id}/adjust-stock
    │
    └─ Other modals...
```

---

**Generated:** April 21, 2026
