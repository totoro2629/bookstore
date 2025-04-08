const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

const { errorHandler } = require('./middleware/errorHandler');

const app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Bookstore API' });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;