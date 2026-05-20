# POS Backend

A Node.js backend API for an advanced inventory management system using MongoDB with enterprise-grade features.

## Features

### Core Features
- User authentication with JWT
- Role-based access control (RBAC)
- Product management
- Inventory tracking
- Supplier management
- Branch management
- POS transactions
- Supplier orders
- Inventory history

### Enterprise Features
- ✅ Input validation (Joi)
- ✅ Structured logging (Winston)
- ✅ Rate limiting
- ✅ Pagination
- ✅ API documentation (Swagger/OpenAPI)
- ✅ Global error handling
- ✅ Database indexing & query optimization
- ✅ Unit tests
- ✅ Graceful shutdown

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start MongoDB
5. Run the server: `npm start` or `npm run dev` for development

## Environment Variables

```env
PORT=3001
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/pos_inventory
JWT_SECRET=your_jwt_secret_key_here
BILLING_API_KEY=your_external_billing_api_key_here
LOG_LEVEL=info
NODE_ENV=development
```

## Quick Start

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Run Tests
```bash
npm test
```

## API Documentation

Access interactive API documentation at:
```
http://localhost:3001/api-docs
```

The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests

## Default Seed Data

When the backend starts, it automatically seeds initial data if it does not already exist:

- Default admin user: `admin@example.com` / `Admin123`
- Default category: `General`
- Default supplier: `Default Supplier`
- Default branch: `Main Branch`

## API Features

### Pagination
All list endpoints support pagination:
```
GET /api/products?page=1&limit=10
```

Response includes pagination metadata:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication: 5 login attempts per 15 minutes
- Create operations: 30 requests per minute

### Error Handling
All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Logging
- Logs stored in `logs/` directory
- Separate error and combined logs
- Automatic log rotation (5 files max, 5MB each)
- View logs: `tail -f logs/combined.log`

## Database Optimization

### Indexes Created
- Products: name, barcode, category, supplier, branch, createdAt
- Users: username, email, createdAt
- Categories: name
- Suppliers: name, email
- And more...

See [docs/QUERY_OPTIMIZATION.md](docs/QUERY_OPTIMIZATION.md) for detailed optimization guide.

## Documentation

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Branches
- `GET /api/branches` - Get all branches
- `POST /api/branches` - Create branch
- `PUT /api/branches/:id` - Update branch
- `DELETE /api/branches/:id` - Delete branch

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/adjust-stock` - Adjust product stock

### Inventory History
- `GET /api/inventory-history` - Get all history
- `POST /api/inventory-history` - Create history entry

### Supplier Orders
- `GET /api/supplier-orders` - Get all orders
- `POST /api/supplier-orders` - Create order
- `PUT /api/supplier-orders/:id` - Update order

### POS Transactions
- `GET /api/pos-transactions` - Get all transactions
- `POST /api/pos-transactions` - Create transaction

### External Billing Integration
- `GET /api/external/products` - Get products with API key
- `POST /api/external/pos-transactions` - Create POS transaction with API key

To use external integration, set `BILLING_API_KEY` and send it in the `x-api-key` header.

## Usage

Start the server and use tools like Postman to test the API endpoints. Ensure to include the JWT token in the Authorization header for protected routes.