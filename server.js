const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Route Files
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const noteRoutes = require('./routes/noteRoutes');

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api', protectedRoutes);

// Add a simple GET route for the browser
app.get('/', (req, res) => {
  res.send('API is running... Try using Postman or curl to test the POST routes!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
