const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['Pending Confirmation', 'Confirmed', 'Cancelled'], 
        default: 'Pending Confirmation' 
    },
    meetingLink: { type: String }, // Populated only after confirmation
    expiresAt: { type: Date, required: true } // 24 hours from creation
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
