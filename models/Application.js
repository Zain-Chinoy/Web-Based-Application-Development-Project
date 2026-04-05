const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    status: { type: String, enum: ['Applied', 'Shortlisted', 'Rejected'], default: 'Applied' }
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
