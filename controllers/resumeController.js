const Resume = require('../models/Resume');
const PDFDocument = require('pdfkit');

// Create or Update Resume (Upsert logic since a student usually has one live profile)
exports.saveResume = async (req, res) => {
    try {
        const { studentId } = req.body;
        // Find existing resume and update, or create a new one if it doesn't exist
        const resume = await Resume.findOneAndUpdate(
            { studentId }, 
            req.body, 
            { new: true, upsert: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: resume });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get a student's resume data
exports.getResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ studentId: req.params.studentId });
        if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
        res.status(200).json({ success: true, data: resume });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete a resume
exports.deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({ studentId: req.params.studentId });
        if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Dynamically Generate and Download PDF
exports.generatePDF = async (req, res) => {
    try {
        const resume = await Resume.findOne({ studentId: req.params.studentId });
        if (!resume) return res.status(404).json({ success: false, error: 'Resume data missing. Please build your profile first.' });

        // Initialize PDF Document
        const doc = new PDFDocument({ margin: 50 });
        
        // Set response headers to trigger a file download in the browser
        res.setHeader('Content-disposition', `attachment; filename="${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf"`);
        res.setHeader('Content-type', 'application/pdf');

        // Pipe the PDF directly to the HTTP response
        doc.pipe(res);

        // Build the PDF Content (Matching CareerConnect Branding)
        doc.fontSize(24).text(resume.personalInfo.fullName, { align: 'center' });
        doc.fontSize(12).text(`${resume.personalInfo.email} | ${resume.personalInfo.phone}`, { align: 'center' });
        doc.text(resume.personalInfo.address, { align: 'center' });
        doc.moveDown();

        doc.fontSize(16).text('Education', { underline: true });
        doc.fontSize(12).text(`${resume.education.degree} - ${resume.education.university}`);
        doc.text(`GPA: ${resume.education.gpa} | ${resume.education.startDate} - ${resume.education.endDate}`);
        doc.moveDown();

        doc.fontSize(16).text('Skills', { underline: true });
        doc.fontSize(12).text(resume.skills.join(', '));
        doc.moveDown();

        doc.fontSize(16).text('Projects', { underline: true });
        resume.projects.forEach(proj => {
            doc.fontSize(14).text(proj.title);
            doc.fontSize(12).text(proj.description);
            doc.moveDown(0.5);
        });

        // Finalize the PDF
        doc.end();

    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to generate PDF' });
    }
};