import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, Download, Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'; // Added Download icon

export default function ResumeBuilder() {
    const { user } = useContext(AuthContext);
    const [isSaving, setIsSaving] = useState(false);
    
    // Initial State mapped to the new Backend Schema
    const [resumeData, setResumeData] = useState({
        studentId: user?._id,
        settings: {
            sectionOrder: ['experience', 'education', 'projects', 'skills', 'certifications', 'extracurricular'],
            visibility: { experience: true, education: true, projects: true, skills: true, certifications: true, extracurricular: true }
        },
        personalInfo: { fullName: '', email: '', phone: '', city: '', linkedin: '', github: '', portfolio: '' },
        education: [{ degree: '', university: '', gpa: '', startDate: '', endDate: '', coursework: '', honors: '' }],
        experience: [],
        projects: [],
        skills: [],
        certifications: [],
        extracurricular: []
    });

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/resumes/${user._id}`);
                if (res.data.data) {
                    setResumeData(res.data.data);
                }
            } catch (error) {
                console.log("Starting fresh resume.");
            }
        };
        if (user?._id) fetchResume();
    }, [user]);

    // --- GENERIC HANDLERS ---
    const handlePersonal = (field, value) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
    
    const handleArrayItem = (section, index, field, value) => {
        const newArray = [...resumeData[section]];
        newArray[index][field] = value;
        setResumeData(prev => ({ ...prev, [section]: newArray }));
    };

    const addArrayItem = (section, template) => {
        setResumeData(prev => ({ ...prev, [section]: [...prev[section], template] }));
    };

    const removeArrayItem = (section, index) => {
        const newArray = [...resumeData[section]];
        newArray.splice(index, 1);
        setResumeData(prev => ({ ...prev, [section]: newArray }));
    };

    // --- SPECIFIC HANDLERS ---
    const handleSkillItem = (catIndex, itemsStr) => {
        const newSkills = [...resumeData.skills];
        newSkills[catIndex].items = itemsStr.split(',').map(s => s.trim());
        setResumeData(prev => ({ ...prev, skills: newSkills }));
    };

    const handleResponsibility = (expIndex, respIndex, value) => {
        const newExp = [...resumeData.experience];
        newExp[expIndex].responsibilities[respIndex] = value;
        setResumeData(prev => ({ ...prev, experience: newExp }));
    };

    const toggleVisibility = (section) => {
        setResumeData(prev => ({
            ...prev, settings: { ...prev.settings, visibility: { ...prev.settings.visibility, [section]: !prev.settings.visibility[section] } }
        }));
    };

    const moveSection = (index, direction) => {
        const newOrder = [...resumeData.settings.sectionOrder];
        if (direction === 'up' && index > 0) {
            [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        } else if (direction === 'down' && index < newOrder.length - 1) {
            [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
        }
        setResumeData(prev => ({ ...prev, settings: { ...prev.settings, sectionOrder: newOrder } }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await axios.post('http://localhost:5000/api/resumes', resumeData);
            toast.success('Profile saved successfully!');
        } catch (error) {
            toast.error('Failed to save profile. Did you update the backend schema?');
        } finally {
            setIsSaving(false);
        }
    };

    // --- NEW DOWNLOAD HANDLER ---
    const handleDownload = () => {
        // Trigger the backend PDF generation route
        window.open(`http://localhost:5000/api/resumes/${user._id}/pdf`, '_blank');
        toast.success('Generating your PDF...', { icon: '📄' });
    };

    // --- PREVIEW RENDER HELPERS ---
    const renderPreviewSection = (sectionKey) => {
        if (!resumeData.settings.visibility[sectionKey]) return null;

        switch (sectionKey) {
            case 'experience':
                if (resumeData.experience.length === 0) return null;
                return (
                    <div key="exp" className="mb-4">
                        <h2 className="pb-1 mb-2 text-sm font-bold tracking-widest uppercase border-b-2 text-slate-800 border-slate-800">Experience</h2>
                        {resumeData.experience.map((exp, i) => (
                            <div key={i} className="mb-3">
                                {exp.role && exp.company && (
                                    <div className="flex justify-between text-sm font-bold text-slate-900">
                                        <span>{exp.role} | {exp.company}</span>
                                        <span className="font-normal italic text-slate-600">{exp.duration}</span>
                                    </div>
                                )}
                                {exp.responsibilities.length > 0 && exp.responsibilities[0] !== '' && (
                                    <ul className="mt-1 ml-4 text-sm list-disc list-outside text-slate-700">
                                        {exp.responsibilities.map((req, j) => req && <li key={j}>{req}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                );
            case 'education':
                if (resumeData.education.length === 0) return null;
                return (
                    <div key="edu" className="mb-4">
                        <h2 className="pb-1 mb-2 text-sm font-bold tracking-widest uppercase border-b-2 text-slate-800 border-slate-800">Education</h2>
                        {resumeData.education.map((edu, i) => (
                            <div key={i} className="mb-2">
                                <div className="flex justify-between text-sm font-bold text-slate-900">
                                    <span>{edu.university}</span>
                                    <span className="font-normal italic text-slate-600">{edu.startDate} {edu.startDate && edu.endDate && '-'} {edu.endDate}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-700">
                                    <span>{edu.degree}</span>
                                    <span>{edu.gpa && `GPA: ${edu.gpa}`}</span>
                                </div>
                                {edu.coursework && <div className="mt-1 text-xs text-slate-600"><strong>Coursework:</strong> {edu.coursework}</div>}
                                {edu.honors && <div className="text-xs text-slate-600"><strong>Honors:</strong> {edu.honors}</div>}
                            </div>
                        ))}
                    </div>
                );
            case 'projects':
                if (resumeData.projects.length === 0) return null;
                return (
                    <div key="proj" className="mb-4">
                        <h2 className="pb-1 mb-2 text-sm font-bold tracking-widest uppercase border-b-2 text-slate-800 border-slate-800">Projects</h2>
                        {resumeData.projects.map((proj, i) => (
                            <div key={i} className="mb-2">
                                {proj.title && <div className="text-sm font-bold text-slate-900">{proj.title}</div>}
                                {proj.description && <div className="text-sm leading-snug text-slate-700">{proj.description}</div>}
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                if (resumeData.skills.length === 0) return null;
                return (
                    <div key="skills" className="mb-4">
                        <h2 className="pb-1 mb-2 text-sm font-bold tracking-widest uppercase border-b-2 text-slate-800 border-slate-800">Skills</h2>
                        <div className="text-sm text-slate-700">
                            {resumeData.skills.map((skill, i) => (
                                skill.category && skill.items.length > 0 && (
                                    <div key={i} className="mb-1">
                                        <strong>{skill.category}: </strong> {skill.items.join(', ')}
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                );
            case 'certifications':
                if (resumeData.certifications.length === 0) return null;
                return (
                    <div key="certs" className="mb-4">
                        <h2 className="pb-1 mb-2 text-sm font-bold tracking-widest uppercase border-b-2 text-slate-800 border-slate-800">Certifications</h2>
                        <div className="text-sm text-slate-700">
                            {resumeData.certifications.map((cert, i) => cert.name && (
                                <div key={i}><strong>{cert.name}</strong> {cert.issuer && `— ${cert.issuer}`}</div>
                            ))}
                        </div>
                    </div>
                );
            case 'extracurricular':
                if (resumeData.extracurricular.length === 0) return null;
                return (
                    <div key="extra" className="mb-4">
                        <h2 className="pb-1 mb-2 text-sm font-bold tracking-widest uppercase border-b-2 text-slate-800 border-slate-800">Extracurricular</h2>
                        <div className="text-sm text-slate-700">
                            {resumeData.extracurricular.map((ex, i) => ex.society && (
                                <div key={i}><strong>{ex.position || 'Member'}</strong>, {ex.society}</div>
                            ))}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto mt-6">
            
            {/* --- UPDATED HEADER WITH BOTH BUTTONS --- */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Advanced Resume Builder</h1>
                    <p className="text-slate-500">Dynamic sections, ordering, and live preview.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleSave} disabled={isSaving} className="flex items-center px-6 py-2.5 bg-slate-800 text-white rounded-xl shadow-lg hover:bg-slate-700 transition font-semibold">
                        <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button onClick={handleDownload} className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition font-semibold">
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                
                {/* LEFT SIDE: BUILDER FORM */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
                    
                    {/* Basic Info */}
                    <div className="p-5 mb-8 border bg-slate-50 rounded-xl border-slate-100">
                        <h3 className="mb-4 text-lg font-bold text-slate-800">Basic Info</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Name" value={resumeData.personalInfo.fullName} onChange={e => handlePersonal('fullName', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="text" placeholder="City (e.g. Karachi)" value={resumeData.personalInfo.city} onChange={e => handlePersonal('city', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="email" placeholder="Email" value={resumeData.personalInfo.email} onChange={e => handlePersonal('email', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="tel" placeholder="Phone" value={resumeData.personalInfo.phone} onChange={e => handlePersonal('phone', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="text" placeholder="LinkedIn URL" value={resumeData.personalInfo.linkedin} onChange={e => handlePersonal('linkedin', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="text" placeholder="GitHub URL" value={resumeData.personalInfo.github} onChange={e => handlePersonal('github', e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="text" placeholder="Portfolio Website" value={resumeData.personalInfo.portfolio} onChange={e => handlePersonal('portfolio', e.target.value)} className="col-span-2 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* DYNAMIC SECTIONS LOOP */}
                    {resumeData.settings.sectionOrder.map((section, index) => (
                        <div key={section} className={`mb-6 p-5 rounded-xl border transition-all ${resumeData.settings.visibility[section] ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                            
                            {/* Section Header & Controls */}
                            <div className="flex items-center justify-between pb-3 mb-4 border-b">
                                <h3 className="text-lg font-bold capitalize text-slate-800">{section}</h3>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleVisibility(section)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded bg-slate-100 hover:bg-blue-50 transition" title="Toggle Visibility">
                                        {resumeData.settings.visibility[section] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <div className="flex rounded bg-slate-100">
                                        <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                                        <button onClick={() => moveSection(index, 'down')} disabled={index === resumeData.settings.sectionOrder.length - 1} className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Section Content */}
                            {resumeData.settings.visibility[section] && (
                                <div className="space-y-4">
                                    
                                    {/* EXPERIENCE */}
                                    {section === 'experience' && resumeData.experience.map((item, i) => (
                                        <div key={i} className="relative p-4 border rounded-lg bg-slate-50 border-slate-200">
                                            <button onClick={() => removeArrayItem('experience', i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                            <div className="grid grid-cols-2 gap-3 mb-2">
                                                <input type="text" placeholder="Job/Intern Role" value={item.role} onChange={e => handleArrayItem('experience', i, 'role', e.target.value)} className="w-full p-2 text-sm border rounded" />
                                                <input type="text" placeholder="Company" value={item.company} onChange={e => handleArrayItem('experience', i, 'company', e.target.value)} className="w-full p-2 text-sm border rounded" />
                                            </div>
                                            <input type="text" placeholder="Duration (e.g. Jun 2024 - Present)" value={item.duration} onChange={e => handleArrayItem('experience', i, 'duration', e.target.value)} className="w-full p-2 mb-2 text-sm border rounded" />
                                            {item.responsibilities.map((resp, j) => (
                                                <input key={j} type="text" placeholder="• Responsibility or achievement..." value={resp} onChange={e => handleResponsibility(i, j, e.target.value)} className="w-full p-2 mb-2 text-sm border rounded" />
                                            ))}
                                            <button onClick={() => { const newExp = [...resumeData.experience]; newExp[i].responsibilities.push(''); setResumeData({...resumeData, experience: newExp}); }} className="text-xs font-semibold text-blue-600 hover:text-blue-800">+ Add Bullet</button>
                                        </div>
                                    ))}

                                    {/* EDUCATION */}
                                    {section === 'education' && resumeData.education.map((item, i) => (
                                        <div key={i} className="relative p-4 border rounded-lg bg-slate-50 border-slate-200">
                                            <button onClick={() => removeArrayItem('education', i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                            <div className="grid grid-cols-2 gap-3 mb-2">
                                                <input type="text" placeholder="University" value={item.university} onChange={e => handleArrayItem('education', i, 'university', e.target.value)} className="w-full p-2 text-sm border rounded" />
                                                <input type="text" placeholder="Degree" value={item.degree} onChange={e => handleArrayItem('education', i, 'degree', e.target.value)} className="w-full p-2 text-sm border rounded" />
                                                <input type="text" placeholder="GPA" value={item.gpa} onChange={e => handleArrayItem('education', i, 'gpa', e.target.value)} className="w-full p-2 text-sm border rounded" />
                                                <input type="text" placeholder="Start - End Date" value={`${item.startDate} ${item.endDate}`} onChange={e => handleArrayItem('education', i, 'startDate', e.target.value)} className="w-full p-2 text-sm border rounded" />
                                            </div>
                                            <input type="text" placeholder="Relevant Coursework" value={item.coursework} onChange={e => handleArrayItem('education', i, 'coursework', e.target.value)} className="w-full p-2 mb-2 text-sm border rounded" />
                                            <input type="text" placeholder="Honors / Achievements" value={item.honors} onChange={e => handleArrayItem('education', i, 'honors', e.target.value)} className="w-full p-2 text-sm border rounded" />
                                        </div>
                                    ))}

                                    {/* PROJECTS */}
                                    {section === 'projects' && resumeData.projects.map((item, i) => (
                                        <div key={i} className="relative p-4 border rounded-lg bg-slate-50 border-slate-200">
                                            <button onClick={() => removeArrayItem('projects', i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                            <input type="text" placeholder="Project Title" value={item.title} onChange={e => handleArrayItem('projects', i, 'title', e.target.value)} className="w-full p-2 mb-2 text-sm border rounded" />
                                            <textarea placeholder="Description / Technologies used" value={item.description} onChange={e => handleArrayItem('projects', i, 'description', e.target.value)} rows="2" className="w-full p-2 text-sm border rounded" />
                                        </div>
                                    ))}

                                    {/* SKILLS */}
                                    {section === 'skills' && resumeData.skills.map((item, i) => (
                                        <div key={i} className="relative flex gap-2">
                                            <input type="text" placeholder="Category (e.g. Languages)" value={item.category} onChange={e => handleArrayItem('skills', i, 'category', e.target.value)} className="w-1/3 p-2 text-sm border rounded" />
                                            <input type="text" placeholder="Skills (comma separated)" value={item.items.join(', ')} onChange={e => handleSkillItem(i, e.target.value)} className="w-2/3 p-2 pr-8 text-sm border rounded" />
                                            <button onClick={() => removeArrayItem('skills', i)} className="absolute right-2 top-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}

                                    {/* CERTIFICATIONS */}
                                    {section === 'certifications' && resumeData.certifications.map((item, i) => (
                                        <div key={i} className="relative flex gap-2">
                                            <input type="text" placeholder="Course / Hackathon Name" value={item.name} onChange={e => handleArrayItem('certifications', i, 'name', e.target.value)} className="w-1/2 p-2 text-sm border rounded" />
                                            <input type="text" placeholder="Issuer (e.g. Coursera)" value={item.issuer} onChange={e => handleArrayItem('certifications', i, 'issuer', e.target.value)} className="w-1/2 p-2 pr-8 text-sm border rounded" />
                                            <button onClick={() => removeArrayItem('certifications', i)} className="absolute right-2 top-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}

                                    {/* EXTRACURRICULAR */}
                                    {section === 'extracurricular' && resumeData.extracurricular.map((item, i) => (
                                        <div key={i} className="relative flex gap-2">
                                            <input type="text" placeholder="Society / Club" value={item.society} onChange={e => handleArrayItem('extracurricular', i, 'society', e.target.value)} className="w-1/2 p-2 text-sm border rounded" />
                                            <input type="text" placeholder="Position (e.g. VP)" value={item.position} onChange={e => handleArrayItem('extracurricular', i, 'position', e.target.value)} className="w-1/2 p-2 pr-8 text-sm border rounded" />
                                            <button onClick={() => removeArrayItem('extracurricular', i)} className="absolute right-2 top-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}

                                    {/* ADD BUTTONS */}
                                    <button onClick={() => {
                                        if (section === 'experience') addArrayItem('experience', { role: '', company: '', duration: '', responsibilities: [''] });
                                        if (section === 'education') addArrayItem('education', { degree: '', university: '', gpa: '', startDate: '', endDate: '', coursework: '', honors: '' });
                                        if (section === 'projects') addArrayItem('projects', { title: '', description: '' });
                                        if (section === 'skills') addArrayItem('skills', { category: '', items: [] });
                                        if (section === 'certifications') addArrayItem('certifications', { name: '', issuer: '' });
                                        if (section === 'extracurricular') addArrayItem('extracurricular', { society: '', position: '' });
                                    }} className="flex items-center justify-center w-full py-2 text-sm font-semibold text-blue-600 transition border border-blue-200 border-dashed rounded-lg bg-blue-50 hover:bg-blue-100">
                                        <Plus className="w-4 h-4 mr-1" /> Add {section.replace('extracurricular', 'Activity')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* RIGHT SIDE: LIVE PREVIEW (A4 Ratio) */}
                <div className="flex items-start justify-center p-4 overflow-y-auto bg-slate-200 rounded-2xl lg:col-span-5 h-[80vh] custom-scrollbar">
                    <div className="bg-white w-full max-w-[800px] shadow-xl p-8 text-slate-900 min-h-[1056px] text-[13px] leading-relaxed">
                        
                        {/* Header */}
                        <div className="mb-6 text-center">
                            <h1 className="mb-1 font-serif text-2xl tracking-wider uppercase">{resumeData.personalInfo.fullName || 'Your Name'}</h1>
                            <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-600">
                                {resumeData.personalInfo.city && <span>{resumeData.personalInfo.city}</span>}
                                {resumeData.personalInfo.phone && <><span className="text-slate-300">|</span><span>{resumeData.personalInfo.phone}</span></>}
                                {resumeData.personalInfo.email && <><span className="text-slate-300">|</span><span>{resumeData.personalInfo.email}</span></>}
                            </div>
                            <div className="flex flex-wrap justify-center gap-2 mt-1 text-xs text-slate-600">
                                {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
                                {resumeData.personalInfo.github && <><span className="text-slate-300">|</span><span>{resumeData.personalInfo.github}</span></>}
                                {resumeData.personalInfo.portfolio && <><span className="text-slate-300">|</span><span>{resumeData.personalInfo.portfolio}</span></>}
                            </div>
                        </div>

                        {/* Dynamic Render Loop based on settings.sectionOrder */}
                        {resumeData.settings.sectionOrder.map(section => renderPreviewSection(section))}
                        
                    </div>
                </div>

            </div>
        </div>
    );
}
