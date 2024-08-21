const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const mkdirp = require('mkdirp');
const profileRoutes = require('./routes/profileRoutes');
const projectRoutes = require('./routes/projectRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Ensure 'uploads' directory exists
mkdirp.sync('uploads');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Rijuraj:Riju4929!@aikya.htvianz.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

// Use routes
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/posts', postRoutes);

// Serve static files
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
