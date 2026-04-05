const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Would be hashed in a real app
    role: { 
        type: String, 
        enum: ['Student', 'Recruiter', 'Admin'], 
        required: true 
    },
    companyName: { type: String } // Only relevant if the role is 'Recruiter'
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
