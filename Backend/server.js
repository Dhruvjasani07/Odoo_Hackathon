const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import models (this triggers association setup)
const { sequelize } = require('./models');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/fuel-logs', require('./routes/fuelLogs'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/reports', require('./routes/reports'));

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'TransitOps API is running' }));

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ── Connect to MySQL & Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ MySQL connected');
    // Sync all models (creates tables if they don't exist, alter adds missing columns/enum values)
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Database tables synced');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MySQL connection error:', err.message);
    process.exit(1);
  });
