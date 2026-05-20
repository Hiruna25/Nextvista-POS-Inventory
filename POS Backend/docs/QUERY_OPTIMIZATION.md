# Query Optimization & Indexing Strategy

## Overview
This document outlines the indexing strategy and query optimization practices used in the POS Backend system.

## Database Indexes

### Product Collection
- **name** (single): Optimize product name searches
- **barcode** (single): Fast barcode lookups
- **category** (single): Filter products by category
- **supplier** (single): Filter products by supplier
- **branch** (single): Branch-level queries
- **createdAt** (descending): Sort by creation date
- **stockQuantity** (single): Inventory level checks

### User Collection
- **username** (single): Unique user lookups
- **email** (single): Email-based queries
- **createdAt** (descending): Sort by creation date

### Category Collection
- **name** (single): Category name lookups

### Supplier Collection
- **name** (single): Supplier name lookups
- **email** (single): Email-based queries

### Branch Collection
- **name** (single): Branch name lookups

### POSTransaction Collection
- **branch** (single): Branch transaction filtering
- **createdAt** (descending): Date range queries
- **status** (single): Transaction status filtering

### SupplierOrder Collection
- **supplier** (single): Supplier order filtering
- **status** (single): Status filtering
- **createdAt** (descending): Date sorting

## Query Best Practices

### 1. Use Pagination
Always use pagination for list endpoints to reduce memory usage and response time:
```javascript
const query = Model.find(filter)
  .skip(req.pagination.skip)
  .limit(req.pagination.limit)
  .sort({ createdAt: -1 });
```

### 2. Select Specific Fields
Only retrieve necessary fields:
```javascript
const user = await User.findById(userId).select('username email roles');
```

### 3. Use Projections
Limit the fields returned from queries:
```javascript
const products = await Product.find(filter)
  .select('name price barcode stockQuantity')
  .lean();
```

### 4. Lean Queries
Use `.lean()` for read-only queries to improve performance:
```javascript
const products = await Product.find().lean();
```

### 5. Populate Strategy
Use select option with populate to limit related data:
```javascript
const product = await Product.findById(id)
  .populate('category', 'name description')
  .populate('supplier', 'name email');
```

### 6. Aggregation Pipeline
Use aggregation for complex queries:
```javascript
const results = await Product.aggregate([
  { $match: { status: 'active' } },
  { $group: { _id: '$category', total: { $sum: '$stockQuantity' } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
]);
```

## Performance Monitoring

### MongoDB Atlas Monitoring
- Monitor slow queries in MongoDB Atlas dashboard
- Review query execution times
- Check index effectiveness

### Application Metrics
- Track endpoint response times
- Monitor database connection pool
- Measure query execution times using Winston logs

## Index Maintenance

### Regular Reviews
- Monitor index usage in MongoDB Atlas
- Remove unused indexes (can slow writes)
- Update indexes if query patterns change

### Index Creation
Indexes are automatically created when models load. To rebuild indexes:
```javascript
db.collection('products').reIndex();
```

## Caching Strategy

### Redis (Recommended for Production)
Consider Redis for:
- Session caching
- Frequent query results
- Rate limiter data

Current implementation uses node-cache for simple caching (suitable for development).

## Monitoring Commands

### Check Index Usage
```javascript
db.products.aggregate([{ $indexStats: {} }])
```

### Check Query Performance
```javascript
db.products.explain("executionStats").find({ barcode: "123" })
```

## Recommendations

1. **Add Redis** for distributed caching in production
2. **Monitor slow queries** regularly using MongoDB logs
3. **Review query patterns** quarterly
4. **Update indexes** based on actual usage patterns
5. **Use connection pooling** for high-traffic scenarios
