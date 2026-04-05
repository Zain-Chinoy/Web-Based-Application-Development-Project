const express = require('express');
const router = express.Router();
const { applyForJob, getStudentApplications, getJobApplicants, updateApplicationStatus } = require('../controllers/applicationController');

router.route('/')
    .post(applyForJob);

router.route('/student/:studentId')
    .get(getStudentApplications);

router.route('/job/:jobId')
    .get(getJobApplicants);

router.route('/:id/status')
    .put(updateApplicationStatus);

module.exports = router;