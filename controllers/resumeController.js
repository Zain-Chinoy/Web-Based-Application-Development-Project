const Resume = require('../models/Resume');
const PDFDocument = require('pdfkit');

// Create or Update Resume (Upsert logic)
exports.saveResume = async (req, res) => {
    try {
        const { studentId } = req.body;
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

// Dynamically Generate and Download PDF (Upgraded for Dynamic Arrays)
exports.generatePDF = async (req, res) => {
    try {
        const resume = await Resume.findOne({ studentId: req.params.studentId });
        if (!resume) return res.status(404).json({ success: false, error: 'Resume data missing. Please build your profile first.' });

        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        
        res.setHeader('Content-disposition', `attachment; filename="${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf"`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        // --- HEADER ---
        doc.font('Helvetica-Bold').fontSize(22).text(resume.personalInfo.fullName.toUpperCase(), { align: 'center' }).moveDown(0.2);
        
        doc.font('Helvetica').fontSize(10);
        const contactLinks = [resume.personalInfo.city, resume.personalInfo.phone, resume.personalInfo.email].filter(Boolean).join(' | ');
        doc.text(contactLinks, { align: 'center' });
        
        const webLinks = [resume.personalInfo.linkedin, resume.personalInfo.github, resume.personalInfo.portfolio].filter(Boolean).join('  |  ');
        if (webLinks) doc.text(webLinks, { align: 'center' });
        doc.moveDown(1.5);

        // --- DYNAMIC SECTIONS ---
        const { sectionOrder, visibility } = resume.settings;

        sectionOrder.forEach(section => {
            if (!visibility[section]) return;

            // EXPERIENCE
            if (section === 'experience' && resume.experience.length > 0) {
                doc.font('Helvetica-Bold').fontSize(12).text('EXPERIENCE');
                doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(0.5);
                
                resume.experience.forEach(exp => {
                    if (exp.role && exp.company) {
                        doc.font('Helvetica-Bold').fontSize(11).text(`${exp.role} | ${exp.company}`, { continued: true });
                        doc.font('Helvetica-Oblique').text(exp.duration, { align: 'right' });
                        doc.font('Helvetica').fontSize(10);
                        exp.responsibilities.forEach(resp => {
                            if (resp) doc.text(`•  ${resp}`, { indent: 15, lineGap: 2 });
                        });
                        doc.moveDown(0.5);
                    }
                });
            }

            // EDUCATION
            if (section === 'education' && resume.education.length > 0) {
                doc.font('Helvetica-Bold').fontSize(12).text('EDUCATION');
                doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(0.5);

                resume.education.forEach(edu => {
                    if (edu.university) {
                        doc.font('Helvetica-Bold').fontSize(11).text(edu.university, { continued: true });
                        doc.font('Helvetica-Oblique').text(`${edu.startDate} - ${edu.endDate}`, { align: 'right' });
                        doc.font('Helvetica').fontSize(10).text(`${edu.degree} ${edu.gpa ? `(GPA: ${edu.gpa})` : ''}`);
                        if (edu.coursework) doc.text(`Coursework: ${edu.coursework}`);
                        if (edu.honors) doc.text(`Honors: ${edu.honors}`);
                        doc.moveDown(0.5);
                    }
                });
            }

            // PROJECTS
            if (section === 'projects' && resume.projects.length > 0) {
                doc.font('Helvetica-Bold').fontSize(12).text('PROJECTS');
                doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(0.5);

                resume.projects.forEach(proj => {
                    if (proj.title) {
                        doc.font('Helvetica-Bold').fontSize(11).text(proj.title);
                        doc.font('Helvetica').fontSize(10).text(proj.description, { lineGap: 2 });
                        doc.moveDown(0.5);
                    }
                });
            }

            // SKILLS
            if (section === 'skills' && resume.skills.length > 0) {
                doc.font('Helvetica-Bold').fontSize(12).text('SKILLS');
                doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(0.5);

                resume.skills.forEach(skill => {
                    if (skill.category && skill.items.length > 0) {
                        doc.font('Helvetica-Bold').fontSize(10).text(`${skill.category}: `, { continued: true });
                        doc.font('Helvetica').text(skill.items.join(', '));
                        doc.moveDown(0.2);
                    }
                });
                doc.moveDown(0.5);
            }

            // CERTIFICATIONS & EXTRACURRICULAR (Grouped logically)
            if (section === 'certifications' && resume.certifications.length > 0) {
                doc.font('Helvetica-Bold').fontSize(12).text('CERTIFICATIONS');
                doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(0.5);
                resume.certifications.forEach(cert => {
                    if (cert.name) {
                        doc.font('Helvetica-Bold').fontSize(10).text(cert.name, { continued: true });
                        doc.font('Helvetica').text(cert.issuer ? ` — ${cert.issuer}` : '');
                    }
                });
                doc.moveDown(0.5);
            }

            if (section === 'extracurricular' && resume.extracurricular.length > 0) {
                doc.font('Helvetica-Bold').fontSize(12).text('EXTRACURRICULAR');
                doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(0.5);
                resume.extracurricular.forEach(ex => {
                    if (ex.society) {
                        doc.font('Helvetica-Bold').fontSize(10).text(`${ex.position || 'Member'}, `, { continued: true });
                        doc.font('Helvetica').text(ex.society);
                    }
                });
                doc.moveDown(0.5);
            }
        });

        doc.end();

    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to generate PDF' });
    }
};
