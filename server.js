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

// --- ALL CAREERCONNECT ROUTES ACTIVE ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));

// Basic health check route
app.get('/', (req, res) => {
    res.send('CareerConnect API is running...');
});

// Initialize automated 24-hour expiration cron job for interviews
const { initExpirationCronJob } = require('./controllers/interviewController');
initExpirationCronJob();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
