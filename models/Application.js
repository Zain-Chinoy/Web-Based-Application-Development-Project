const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    
    // CHANGED: Made resumeId optional, added customResumeName for manual uploads
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    customResumeName: { type: String }, 
    
    status: { type: String, enum: ['Applied', 'Shortlisted', 'Rejected'], default: 'Applied' }
}, { timestamps: true });

applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
