const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Categories table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  )`);

  // Suppliers table
  db.run(`CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    email TEXT,
    address TEXT
  )`);

  // Branches table
  db.run(`CREATE TABLE IF NOT EXISTS branches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER,
    supplier_id INTEGER,
    barcode TEXT UNIQUE,
    price REAL NOT NULL,
    cost REAL NOT NULL,
    stock_quantity INTEGER NOT NULL,
    min_stock_level INTEGER DEFAULT 10,
    max_stock_level INTEGER DEFAULT 100,
    expiry_date TEXT,
    description TEXT,
    branch_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers (id),
    FOREIGN KEY (branch_id) REFERENCES branches (id)
  )`);

  // Inventory history table
  db.run(`CREATE TABLE IF NOT EXISTS inventory_history (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    action TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    previous_stock INTEGER,
    new_stock INTEGER,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  // Supplier orders table
  db.run(`CREATE TABLE IF NOT EXISTS supplier_orders (
    id TEXT PRIMARY KEY,
    supplier_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    order_date TEXT DEFAULT CURRENT_TIMESTAMP,
    expected_date TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (supplier_id) REFERENCES suppliers (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  // POS transactions table
  db.run(`CREATE TABLE IF NOT EXISTS pos_transactions (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    transaction_date TEXT DEFAULT CURRENT_TIMESTAMP,
    branch_id INTEGER,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (branch_id) REFERENCES branches (id)
  )`);

  // Insert sample data if tables are empty
  insertSampleData();
}

// Insert sample data
function insertSampleData() {
  // Check if data exists
  db.get("SELECT COUNT(*) as count FROM categories", (err, row) => {
    if (err) console.error(err);
    else if (row.count === 0) {
      // Insert sample categories
      const categories = [
        { name: 'Fruits & Vegetables', description: 'Fresh produce' },
        { name: 'Bakery', description: 'Baked goods' },
        { name: 'Dairy', description: 'Milk and dairy products' },
        { name: 'Meat & Poultry', description: 'Meat products' },
        { name: 'Frozen Foods', description: 'Frozen meals and products' },
        { name: 'Beverages', description: 'Drinks and beverages' },
        { name: 'Snacks', description: 'Chips and snacks' },
        { name: 'Household', description: 'Cleaning and household items' }
      ];

      categories.forEach(cat => {
        db.run("INSERT INTO categories (name, description) VALUES (?, ?)", [cat.name, cat.description]);
      });

      // Insert sample suppliers
      const suppliers = [
        { name: 'Fresh Farms Inc.', contact: 'John Doe', email: 'john@freshfarms.com', address: '123 Farm Rd' },
        { name: 'Bakery Masters', contact: 'Jane Smith', email: 'jane@bakerymasters.com', address: '456 Bakery St' },
        { name: 'Dairy Corp', contact: 'Bob Johnson', email: 'bob@dairycorp.com', address: '789 Dairy Ave' }
      ];

      suppliers.forEach(sup => {
        db.run("INSERT INTO suppliers (name, contact, email, address) VALUES (?, ?, ?, ?)",
          [sup.name, sup.contact, sup.email, sup.address]);
      });

      // Insert sample branches
      const branches = [
        { name: 'Main Branch', location: 'Downtown' },
        { name: 'North Branch', location: 'North District' },
        { name: 'South Branch', location: 'South District' }
      ];

      branches.forEach(branch => {
        db.run("INSERT INTO branches (name, location) VALUES (?, ?)", [branch.name, branch.location]);
      });

      console.log('Sample data inserted.');
    }
  });
}

// API Routes

// Categories
app.get('/api/categories', (req, res) => {
  db.all("SELECT * FROM categories", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  db.run("INSERT INTO categories (name, description) VALUES (?, ?)", [name, description], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, description });
  });
});

// Suppliers
app.get('/api/suppliers', (req, res) => {
  db.all("SELECT * FROM suppliers", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/suppliers', (req, res) => {
  const { name, contact, email, address } = req.body;
  db.run("INSERT INTO suppliers (name, contact, email, address) VALUES (?, ?, ?, ?)",
    [name, contact, email, address], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, contact, email, address });
  });
});

// Branches
app.get('/api/branches', (req, res) => {
  db.all("SELECT * FROM branches", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Products
app.get('/api/products', (req, res) => {
  const query = `
    SELECT p.*, c.name as category_name, s.name as supplier_name, b.name as branch_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    LEFT JOIN branches b ON p.branch_id = b.id
  `;
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/products', (req, res) => {
  const { name, category_id, supplier_id, barcode, price, cost, stock_quantity,
          min_stock_level, max_stock_level, expiry_date, description, branch_id } = req.body;
  const id = uuidv4();
  db.run(`INSERT INTO products (id, name, category_id, supplier_id, barcode, price, cost,
           stock_quantity, min_stock_level, max_stock_level, expiry_date, description, branch_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, category_id, supplier_id, barcode, price, cost, stock_quantity,
     min_stock_level, max_stock_level, expiry_date, description, branch_id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, category_id, supplier_id, barcode, price, cost, stock_quantity,
          min_stock_level, max_stock_level, expiry_date, description, branch_id } = req.body;
  db.run(`UPDATE products SET name=?, category_id=?, supplier_id=?, barcode=?, price=?,
           cost=?, stock_quantity=?, min_stock_level=?, max_stock_level=?,
           expiry_date=?, description=?, branch_id=? WHERE id=?`,
    [name, category_id, supplier_id, barcode, price, cost, stock_quantity,
     min_stock_level, max_stock_level, expiry_date, description, branch_id, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM products WHERE id=?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted' });
  });
});

// Inventory History
app.get('/api/inventory-history', (req, res) => {
  const query = `
    SELECT h.*, p.name as product_name
    FROM inventory_history h
    LEFT JOIN products p ON h.product_id = p.id
    ORDER BY h.timestamp DESC
  `;
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/inventory-history', (req, res) => {
  const { product_id, action, quantity, previous_stock, new_stock, notes } = req.body;
  const id = uuidv4();
  db.run("INSERT INTO inventory_history (id, product_id, action, quantity, previous_stock, new_stock, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, product_id, action, quantity, previous_stock, new_stock, notes], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

// POS Transactions
app.get('/api/pos-transactions', (req, res) => {
  const query = `
    SELECT t.*, p.name as product_name, b.name as branch_name
    FROM pos_transactions t
    LEFT JOIN products p ON t.product_id = p.id
    LEFT JOIN branches b ON t.branch_id = b.id
    ORDER BY t.transaction_date DESC
  `;
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/pos-transactions', (req, res) => {
  const { product_id, quantity, total_amount, branch_id } = req.body;
  const id = uuidv4();
  db.run("INSERT INTO pos_transactions (id, product_id, quantity, total_amount, branch_id) VALUES (?, ?, ?, ?, ?)",
    [id, product_id, quantity, total_amount, branch_id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

// Supplier Orders
app.get('/api/supplier-orders', (req, res) => {
  const query = `
    SELECT o.*, p.name as product_name, s.name as supplier_name
    FROM supplier_orders o
    LEFT JOIN products p ON o.product_id = p.id
    LEFT JOIN suppliers s ON o.supplier_id = s.id
    ORDER BY o.order_date DESC
  `;
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/supplier-orders', (req, res) => {
  const { supplier_id, product_id, quantity, expected_date } = req.body;
  const id = uuidv4();
  db.run("INSERT INTO supplier_orders (id, supplier_id, product_id, quantity, expected_date) VALUES (?, ?, ?, ?, ?)",
    [id, supplier_id, product_id, quantity, expected_date], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});