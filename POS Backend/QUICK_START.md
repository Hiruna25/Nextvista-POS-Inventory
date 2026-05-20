# Quick Start Guide - POS Backend

## Start the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Server will start at:
```
http://localhost:3001
```

## Access API Documentation

### Interactive Swagger UI
```
http://localhost:3001/api-docs
```

### Health Check
```
http://localhost:3001/api/health
```

### Server Status
```
http://localhost:3001/api/status
```

---

## Using the API

### 1. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Admin",
    "password": "Admin123"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "Admin",
    "email": "admin@example.com",
    "roles": ["admin"]
  }
}
```

### 2. Get Products (with pagination)
```bash
curl -X GET "http://localhost:3001/api/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Product Name",
      "price": 99.99,
      "stockQuantity": 50
    }
  ],
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

### 3. Create a Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "New Product",
    "price": 49.99,
    "cost": 25,
    "stockQuantity": 100
  }'
```

### 4. Update a Product
```bash
curl -X PUT http://localhost:3001/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "price": 59.99,
    "stockQuantity": 80
  }'
```

### 5. Delete a Product
```bash
curl -X DELETE http://localhost:3001/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Key Features

### Input Validation
All endpoints validate input automatically. Invalid data returns clear error messages:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "price",
      "message": "price must be a positive number"
    }
  ]
}
```

### Pagination
Add `?page=X&limit=Y` to any list endpoint:
- Default page: 1
- Default limit: 10
- Maximum limit: 100

### Rate Limiting
- Regular endpoints: 100 requests per 15 minutes
- Login endpoints: 5 attempts per 15 minutes
- If limit exceeded: HTTP 429 Too Many Requests

### Error Handling
All errors return consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Logging
- All requests logged to `logs/combined.log`
- Errors logged to `logs/error.log`
- View logs: `tail -f logs/combined.log`

---

## Testing

### Run Unit Tests
```bash
npm test
```

### Test Files
- `tests/validation.test.js` - Input validation tests
- `tests/errorHandler.test.js` - Error handling tests
- `tests/pagination.test.js` - Pagination tests

---

## Database

### Connection String
- Development: `mongodb://localhost:27017/pos_inventory`
- Production: Use MongoDB Atlas connection string

### Seed Data
The server automatically creates:
- Admin user (admin@example.com / Admin123)
- Default category
- Default supplier
- Default branch

### Database Indexes
Automatic indexes for:
- Product: name, barcode, category, supplier, branch, createdAt
- User: username, email, createdAt
- And more...

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Check MongoDB is running
- Verify connection string in `.env`
- Check network/firewall settings

### Rate Limit Exceeded
- Wait 15 minutes for limit to reset
- Or implement exponential backoff in client

### Validation Errors
- Check API docs for required fields
- Ensure correct data types
- Review error messages for details

### Log Issues
- Check `logs/error.log` for errors
- Verify `logs/` directory exists and is writable
- Check Winston configuration in `config/logger.js`

---

## Development Tips

### Watch Mode
```bash
npm run dev
```
Server auto-reloads on file changes

### Debug Mode
```bash
node --inspect-brk server.js
```
Then open `chrome://inspect` in Chrome

### View All Logs
```bash
tail -f logs/combined.log | grep -i "error\|warn"
```

### Test Specific Endpoint
Use Swagger UI at `/api-docs` for interactive testing

---

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Update `MONGODB_URI` for production database
- [ ] Generate strong `JWT_SECRET`
- [ ] Check `.env` is in `.gitignore`
- [ ] Run tests: `npm test`
- [ ] Check logs in `logs/` directory
- [ ] Verify all endpoints working
- [ ] Set up monitoring/alerts
- [ ] Enable rate limiting
- [ ] Configure CORS for frontend domain

---

## Next Steps

1. **Review API Documentation**: http://localhost:3001/api-docs
2. **Check Test Coverage**: `npm test`
3. **Read Implementation Guide**: [docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md)
4. **Query Optimization**: [docs/QUERY_OPTIMIZATION.md](docs/QUERY_OPTIMIZATION.md)
5. **Review Logs**: `logs/combined.log`

---

## Support

- API Docs: `/api-docs`
- Health Check: `/api/health`
- Status: `/api/status`
- Logs: `logs/` directory
- Implementation Details: [docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md)
