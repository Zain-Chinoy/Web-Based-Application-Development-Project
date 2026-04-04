const Application = require('../models/Application');
const Job = require('../models/Job');

// Apply for a job (One-click apply logic)
exports.applyForJob = async (req, res) => {
    try {
        const { jobId, studentId, resumeUrl } = req.body;

        // Check if job exists and is open
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
        if (job.status !== 'Open') return res.status(400).json({ success: false, error: 'Job is no longer open' });

        const application = await Application.create({ jobId, studentId, resumeUrl });
        res.status(201).json({ success: true, data: application });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'You have already applied for this job' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all applications for a specific student (My Applications)
exports.getStudentApplications = async (req, res) => {
    try {
        const applications = await Application.find({ studentId: req.params.studentId }).populate('jobId', 'title company');
        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all applicants for a specific job (Recruiter view)
exports.getJobApplicants = async (req, res) => {
    try {
        const applications = await Application.find({ jobId: req.params.jobId });
        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update application status (Recruiter changes to Shortlisted/Rejected)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true, runValidators: true }
        );

        if (!application) return res.status(404).json({ success: false, error: 'Application not found' });
        res.status(200).json({ success: true, data: application });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};