const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: String, required: true }, // Will link to User model later
    resumeUrl: { type: String, required: true }, // Mock URL for now, linked to WF1 later
    status: { type: String, enum: ['Applied', 'Shortlisted', 'Rejected'], default: 'Applied' }
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);