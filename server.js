const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- ROUTE PLACEHOLDERS ---
// Areeba will uncomment this in her branch:
// app.use('/api/resumes', require('./routes/resumeRoutes'));

// Zain will uncomment this in his branch:
// app.use('/api/jobs', require('./routes/jobRoutes'));
// app.use('/api/applications', require('./routes/applicationRoutes'));

// Aafia will uncomment this in her branch:
// app.use('/api/interviews', require('./routes/interviewRoutes'));

// Basic health check route
app.get('/', (req, res) => {
    res.send('CareerConnect API is running...');
});

const PORT = process.env.PORT || 5000;

const { initExpirationCronJob } = require('./controllers/interviewController');
initExpirationCronJob();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
