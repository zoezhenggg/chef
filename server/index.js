import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Initialize database
const db = new Database(join(__dirname, 'database.sqlite'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    image_url TEXT,
    available INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
  );
`);

// Configure multer for file uploads
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Routes

// Get all items
app.get('/api/items', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items WHERE available = 1 ORDER BY created_at DESC').all();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single item
app.get('/api/items/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create item (admin)
app.post('/api/items', upload.single('image'), (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const id = uuidv4();
    db.prepare(`
      INSERT INTO items (id, name, description, price, category, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, description, parseFloat(price), category, imageUrl);
    
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item (admin)
app.put('/api/items/:id', upload.single('image'), (req, res) => {
  try {
    const { name, description, price, category, available } = req.body;
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : item.image_url;
    
    db.prepare(`
      UPDATE items 
      SET name = ?, description = ?, price = ?, category = ?, image_url = ?, available = ?
      WHERE id = ?
    `).run(
      name || item.name,
      description !== undefined ? description : item.description,
      price !== undefined ? parseFloat(price) : item.price,
      category || item.category,
      imageUrl,
      available !== undefined ? parseInt(available) : item.available,
      req.params.id
    );
    
    const updatedItem = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete item (admin)
app.delete('/api/items/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
app.post('/api/orders', (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, customer_address, items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }
    
    // Calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const orderItem of items) {
      const item = db.prepare('SELECT * FROM items WHERE id = ? AND available = 1').get(orderItem.item_id);
      if (!item) {
        return res.status(400).json({ error: `Item ${orderItem.item_id} not found or unavailable` });
      }
      const itemTotal = item.price * orderItem.quantity;
      totalAmount += itemTotal;
      orderItems.push({ ...orderItem, price: item.price });
    }
    
    // Create order
    const orderId = uuidv4();
    db.prepare(`
      INSERT INTO orders (id, customer_name, customer_email, customer_phone, customer_address, total_amount)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(orderId, customer_name, customer_email, customer_phone, customer_address, totalAmount);
    
    // Create order items
    const insertOrderItem = db.prepare(`
      INSERT INTO order_items (id, order_id, item_id, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    for (const orderItem of orderItems) {
      insertOrderItem.run(uuidv4(), orderId, orderItem.item_id, orderItem.quantity, orderItem.price);
    }
    
    const order = db.prepare(`
      SELECT o.*, 
             json_group_array(json_object('id', oi.id, 'item_id', oi.item_id, 'quantity', oi.quantity, 'price', oi.price)) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
      GROUP BY o.id
    `).get(orderId);
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (admin)
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, 
             json_group_array(json_object('id', oi.id, 'item_id', oi.item_id, 'item_name', i.name, 'quantity', oi.quantity, 'price', oi.price)) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN items i ON oi.item_id = i.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `).all();
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin)
app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

