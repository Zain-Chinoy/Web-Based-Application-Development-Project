const User = require('../models/User');

// Register a new Student or Recruiter
exports.registerUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        // We return the user object so you can easily copy the _id for Postman!
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        // This will catch duplicate emails or missing required fields
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        // In a real app, we would hash/compare passwords. Keeping it simple for the prototype.
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
