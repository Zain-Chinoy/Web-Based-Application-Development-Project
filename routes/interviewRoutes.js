const express = require('express');
const router = express.Router();
const { scheduleInterview, confirmInterview, cancelInterview, getStudentInterviews, getRecruiterInterviews } = require('../controllers/interviewController'); // Added cancelInterview

router.route('/').post(scheduleInterview);
router.route('/:id/confirm').put(confirmInterview);
router.route('/:id/cancel').put(cancelInterview); // NEW ROUTE
router.route('/student/:studentId').get(getStudentInterviews);
router.route('/recruiter/:recruiterId').get(getRecruiterInterviews);

module.exports = router;
