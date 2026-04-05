const express = require('express');
const router = express.Router();
const { saveResume, getResume, deleteResume, generatePDF } = require('../controllers/resumeController');

router.route('/')
    .post(saveResume); // We use POST for both create and update (upsert)

router.route('/:studentId')
    .get(getResume)
    .delete(deleteResume);

router.route('/:studentId/pdf')
    .get(generatePDF);

module.exports = router;