const express = require('express');
const router = express.Router();
const { createJob, getJobs, getRecruiterJobs, updateJob, deleteJob } = require('../controllers/jobController');

router.route('/')
    .get(getJobs)
    .post(createJob);

router.route('/:id')
    .put(updateJob)
    .delete(deleteJob);

router.route('/recruiter/:recruiterId')
    .get(getRecruiterJobs);

module.exports = router;