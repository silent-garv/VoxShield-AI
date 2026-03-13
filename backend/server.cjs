// Entry point for VoxShield AI backend (CommonJS)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const detectRoute = require('./routes/detectRoute.cjs');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', detectRoute);

// Health check
app.get('/', (req, res) => res.send('VoxShield AI backend running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
