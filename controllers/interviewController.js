const Interview = require('../models/Interview');
const Job = require('../models/Job');
const cron = require('node-cron');

// Recruiter schedules an interview
exports.scheduleInterview = async (req, res) => {
    try {
        const { jobId, studentId, recruiterId, scheduledDate } = req.body;

        // Calculate expiration time (24 hours from right now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const interview = await Interview.create({
            jobId,
            studentId,
            recruiterId,
            scheduledDate,
            expiresAt
        });

        res.status(201).json({ success: true, data: interview });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Student confirms the interview
exports.confirmInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ success: false, error: 'Interview not found' });
        }

        if (interview.status !== 'Pending Confirmation') {
            return res.status(400).json({ success: false, error: `Cannot confirm. Status is already ${interview.status}` });
        }

        // Check if 24 hours have already passed (fallback in case cron hasn't run yet)
        if (new Date() > interview.expiresAt) {
            interview.status = 'Cancelled';
            await interview.save();
            return res.status(400).json({ success: false, error: 'The 24-hour window to confirm has expired.' });
        }

        // Update status and generate a mock meeting link
        interview.status = 'Confirmed';
        interview.meetingLink = `https://meet.careerconnect.edu/${interview._id}`;
        await interview.save();

        res.status(200).json({ success: true, data: interview });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Student cancels the interview
exports.cancelInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) return res.status(404).json({ success: false, error: 'Interview not found' });
        
        if (interview.status !== 'Pending Confirmation') {
            return res.status(400).json({ success: false, error: `Cannot cancel. Status is already ${interview.status}` });
        }

        interview.status = 'Cancelled';
        await interview.save();
        res.status(200).json({ success: true, data: interview });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all interviews for a student
exports.getStudentInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ studentId: req.params.studentId }).populate('jobId', 'title company');
        res.status(200).json({ success: true, count: interviews.length, data: interviews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all interviews for a recruiter
exports.getRecruiterInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ recruiterId: req.params.recruiterId })
            .populate('jobId', 'title company')
            .populate('studentId', 'name email'); // <-- ADDED THIS LINE
            
        res.status(200).json({ success: true, count: interviews.length, data: interviews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- THE CRON JOB (Automated Expiration Logic) ---
// This function will be called in server.js to start the background timer
exports.initExpirationCronJob = () => {
    // Run every minute: '* * * * *'
    // For production, you might run it every hour: '0 * * * *'
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            console.log(`[Cron Tick] Checking database at ${now.toLocaleTimeString()}`);
            // Find all pending interviews where the current time has passed the expiration time
            const expiredInterviews = await Interview.updateMany(
                { 
                    status: 'Pending Confirmation',
                    expiresAt: { $lt: now } 
                },
                { 
                    $set: { status: 'Cancelled' } 
                }
            );

            if (expiredInterviews.modifiedCount > 0) {
                console.log(`[Cron] Auto-cancelled ${expiredInterviews.modifiedCount} expired interview(s).`);
            }
        } catch (error) {
            console.error('[Cron Error] Failed to process expired interviews:', error);
        }
    });
    console.log('Background cron job initialized: Checking for expired interviews...');
};
