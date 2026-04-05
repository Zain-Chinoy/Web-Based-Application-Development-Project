const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    personalInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    education: {
        degree: { type: String, required: true },
        university: { type: String, required: true },
        gpa: { type: String, required: true },
        startDate: { type: String },
        endDate: { type: String }
    },
    skills: { type: [String], default: [] },
    projects: [{
        title: { type: String },
        description: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
