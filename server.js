const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const mkdirp = require('mkdirp');
const path = require('path'); // Add path import

const profileRoutes = require('./routes/profileRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Define Project schema and model
const projectSchema = new mongoose.Schema({
  name: String,
  website: String,
  type: String,
  industry: String,
  details: String,
  startedIn: String,
  yearlyRevenue: Number,
  monthlySales: Number,
  grossMargin: Number,
  netMargin: Number,
  ebitda: Number,
  skus: Number,
  originalAsk: Number,
  equityOffered: Number,
  debtAmount: Number,
  images: String
});
const Project = mongoose.model('Project', projectSchema);

// Define Funding schema and model
const fundingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  roadmap: [String],
  investor_name: [String],
  funds: [Number]
});
const Funding = mongoose.model('Funding', fundingSchema);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
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
app.use('/api/posts', postRoutes);

// Funding routes
app.post('/api/funding', upload.single('image'), async (req, res) => {
  try {
    const { title, description, roadmap, investor_name, funds } = req.body;
    const image = req.file ? req.file.path.replace('uploads/', '') : '';

    // Parse arrays only if they are defined
    const parsedRoadmap = roadmap ? JSON.parse(roadmap) : [];
    const parsedInvestorName = investor_name ? JSON.parse(investor_name) : [];
    const parsedFunds = funds ? JSON.parse(funds) : [];

    // Create new funding document
    const funding = new Funding({
      title,
      description,
      image,
      roadmap: Array.isArray(parsedRoadmap) ? parsedRoadmap : [],
      investor_name: Array.isArray(parsedInvestorName) ? parsedInvestorName : [],
      funds: Array.isArray(parsedFunds) ? parsedFunds : [],
    });

    await funding.save();
    res.status(201).send(funding);
  } catch (error) {
    console.error('Error creating funding:', error);
    res.status(400).send({ error: 'Failed to create funding' });
  }
});


app.get('/api/funding', async (req, res) => {
  try {
    const funding = await Funding.find();
    res.send(funding);
  } catch (error) {
    console.error('Error fetching funding:', error);
    res.status(500).send(error);
  }
});

// Project routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find({});
    res.send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/api/project/:id', upload.single('images'), async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, website, type, industry, details, startedIn, yearlyRevenue, monthlySales, grossMargin, netMargin, ebitda, skus, originalAsk, equityOffered, debtAmount } = req.body;
    const images = req.file ? req.file.path : req.body.images;

    const updatedProject = await Project.findByIdAndUpdate(projectId, {
      name, website, type, industry, details, startedIn, yearlyRevenue, monthlySales, grossMargin, netMargin, ebitda, skus, originalAsk, equityOffered, debtAmount, images
    }, { new: true });

    if (!updatedProject) {
      return res.status(404).send('Project not found');
    }

    res.send(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).send('Server error');
  }
});
app.post('/api/project', upload.single('images'), async (req, res) => {
  try {
    const {
      name,
      website,
      type,
      industry,
      details,
      startedIn,
      yearlyRevenue,
      monthlySales,
      grossMargin,
      netMargin,
      ebitda,
      skus,
      originalAsk,
      equityOffered,
      debtAmount
    } = req.body;

    // If an image is uploaded, save its path; otherwise, use the path provided in the request body
    const images = req.file ? req.file.path : req.body.images;

    // Create a new project with the provided data
    const newProject = new Project({
      name,
      website,
      type,
      industry,
      details,
      startedIn,
      yearlyRevenue,
      monthlySales,
      grossMargin,
      netMargin,
      ebitda,
      skus,
      originalAsk,
      equityOffered,
      debtAmount,
      images
    });

    // Save the new project to the database
    await newProject.save();

    // Respond with the newly created project
    res.status(201).send(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).send('Server error');
  }
});


app.delete('/api/project/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

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
