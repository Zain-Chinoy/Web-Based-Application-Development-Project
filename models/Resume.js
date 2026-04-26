const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    // Formatting & Ordering
    settings: {
        sectionOrder: { 
            type: [String], 
            default: ['experience', 'education', 'projects', 'skills', 'certifications', 'extracurricular'] 
        },
        visibility: {
            experience: { type: Boolean, default: true },
            education: { type: Boolean, default: true },
            projects: { type: Boolean, default: true },
            skills: { type: Boolean, default: true },
            certifications: { type: Boolean, default: true },
            extracurricular: { type: Boolean, default: true }
        }
    },

    personalInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        city: { type: String, required: true }, // Changed from address
        linkedin: { type: String },
        github: { type: String },
        portfolio: { type: String }
    },
    
    education: [{
        degree: { type: String },
        university: { type: String },
        gpa: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        coursework: { type: String },
        honors: { type: String }
    }],

    experience: [{
        role: { type: String },
        company: { type: String },
        duration: { type: String },
        responsibilities: { type: [String], default: [''] }
    }],

    projects: [{
        title: { type: String },
        description: { type: String }
    }],

    skills: [{
        category: { type: String }, // e.g., "Languages", "Frameworks"
        items: { type: [String], default: [] }
    }],

    certifications: [{
        name: { type: String },
        issuer: { type: String }
    }],

    extracurricular: [{
        society: { type: String },
        position: { type: String }
    }]

}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
