const Job = require('../models/Job');

// Create a new job
exports.createJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all jobs (with optional filters for students)
exports.getJobs = async (req, res) => {
    try {
        const { type, location, status } = req.query;
        let query = {};
        if (type) query.type = type;
        if (location) query.location = location;
        if (status) query.status = status; // Usually students only see 'Open'

        const jobs = await Job.find(query);
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get jobs posted by a specific recruiter
exports.getRecruiterJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiterId: req.params.recruiterId });
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a job
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete a job
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
