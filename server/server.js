require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { notFound, errorHandler } = require('./middleware/error');
const seedAdmin = require('./seedAdmin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, project: 'Cafe-007', api: '/api' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/foods', require('./routes/foods'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/admin', require('./routes/admin'));

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => console.log(`Cafe-007 API running on http://localhost:${PORT}/api`));
  } catch (error) {
    console.error('Server could not start:', error.message);
    process.exit(1);
  }
}

start();