const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Internship'], required: true },
    status: { type: String, enum: ['Open', 'Closed', 'Expired'], default: 'Open' },
    deadline: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
