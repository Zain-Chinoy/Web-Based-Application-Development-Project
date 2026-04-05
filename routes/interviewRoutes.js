const express = require('express');
const router = express.Router();
const { scheduleInterview, confirmInterview, getStudentInterviews, getRecruiterInterviews } = require('../controllers/interviewController');

router.route('/')
    .post(scheduleInterview);

router.route('/:id/confirm')
    .put(confirmInterview);

router.route('/student/:studentId')
    .get(getStudentInterviews);

router.route('/recruiter/:recruiterId')
    .get(getRecruiterInterviews);

module.exports = router;