import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Building2, MapPin, Clock, DollarSign, Briefcase, Calendar, Send, CheckCircle, X, Tag } from 'lucide-react';

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [job, setJob] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [myResume, setMyResume] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applyMethod, setApplyMethod] = useState('profile');
    const [customFile, setCustomFile] = useState(null);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const jobRes = await axios.get(`http://localhost:5000/api/jobs/${id}`);
                setJob(jobRes.data.data);

                const appRes = await axios.get(`http://localhost:5000/api/applications/student/${user._id}`);
                const applied = appRes.data.data.find(a => a.jobId && a.jobId._id === id);
                if (applied) setHasApplied(true);

                const resRes = await axios.get(`http://localhost:5000/api/resumes/${user._id}`);
                if (resRes.data.data) setMyResume(resRes.data.data);
            } catch (error) {
                toast.error("Failed to load job details.");
                navigate('/jobs');
            }
        };
        if (user) fetchDetails();
    }, [id, user, navigate]);

    const handleApplySubmit = async () => {
        setIsApplying(true);
        try {
            let payload = { jobId: job._id, studentId: user._id };

            if (applyMethod === 'profile') {
                if (!myResume) { toast.error('You need to build your profile first!'); setIsApplying(false); return; }
                payload.resumeId = myResume._id;
            } else {
                if (!customFile) { toast.error('Please select a PDF to upload!'); setIsApplying(false); return; }
                payload.customResumeName = customFile.name;
            }
            
            await axios.post('http://localhost:5000/api/applications', payload);
            toast.success('Application submitted successfully! 🎉');
            setHasApplied(true);
            setShowApplyModal(false);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to apply');
        } finally {
            setIsApplying(false);
        }
    };

    if (!job) return <div className="mt-20 text-center">Loading job details...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-6 mb-20">
            <div className="flex items-center justify-between mb-6">
                <Link to="/jobs" className="flex items-center text-sm font-semibold transition text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
                </Link>
                {hasApplied ? (
                    <span className="flex items-center px-4 py-2 font-bold text-green-700 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 mr-2" /> Applied
                    </span>
                ) : (
                    <button onClick={() => setShowApplyModal(true)} className="px-6 py-2.5 font-bold text-white transition bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
                        Apply For Job
                    </button>
                )}
            </div>

            <div className="p-8 bg-white border shadow-sm rounded-2xl border-slate-200">
                <div className="pb-6 mb-6 border-b border-slate-100">
                    <h1 className="mb-2 text-3xl font-extrabold text-slate-900">{job.title}</h1>
                    <div className="flex items-center text-lg font-medium text-slate-600">
                        <Building2 className="w-5 h-5 mr-2" /> {job.company}
                        <span className="mx-3 text-slate-300">•</span>
                        <MapPin className="w-5 h-5 mr-2" /> {job.location}
                    </div>
                </div>

                {/* Updated Details Grid to include custom salary and deadline */}
                <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
                    <div className="p-4 border rounded-xl bg-slate-50 border-slate-100">
                        <div className="flex items-center mb-1 text-xs font-bold tracking-wider uppercase text-slate-400">
                            <Briefcase className="w-4 h-4 mr-1.5" /> Category
                        </div>
                        <div className="font-semibold text-slate-800">Software / IT</div>
                    </div>
                    <div className="p-4 border rounded-xl bg-slate-50 border-slate-100">
                        <div className="flex items-center mb-1 text-xs font-bold tracking-wider uppercase text-slate-400">
                            <DollarSign className="w-4 h-4 mr-1.5" /> Salary
                        </div>
                        <div className="font-semibold text-slate-800">{job.salary || 'Competitive'}</div>
                    </div>
                    <div className="p-4 border rounded-xl bg-slate-50 border-slate-100">
                        <div className="flex items-center mb-1 text-xs font-bold tracking-wider uppercase text-slate-400">
                            <Clock className="w-4 h-4 mr-1.5" /> Job Type
                        </div>
                        <div className="font-semibold text-slate-800">{job.type}</div>
                    </div>
                    <div className="p-4 border rounded-xl bg-slate-50 border-slate-100">
                        <div className="flex items-center mb-1 text-xs font-bold tracking-wider uppercase text-slate-400">
                            <Calendar className="w-4 h-4 mr-1.5" /> Deadline
                        </div>
                        <div className="font-semibold text-slate-800">{new Date(job.deadline).toLocaleDateString()}</div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="mb-3 text-lg font-bold text-slate-900">Job Description</h3>
                    <div className="p-6 border rounded-lg border-slate-200">
                        <p className="leading-relaxed whitespace-pre-wrap text-slate-600">{job.description}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="mb-3 text-lg font-bold text-slate-900">Responsibilities & Requirements</h3>
                    <div className="p-6 border rounded-lg border-slate-200">
                        <p className="leading-relaxed whitespace-pre-wrap text-slate-600">{job.requirements}</p>
                    </div>
                </div>

                <div className="mb-10">
                    <h3 className="flex items-center mb-3 text-sm font-bold tracking-wider uppercase text-slate-900">
                        <Tag className="w-4 h-4 mr-2 text-slate-400" /> Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {[job.type, job.location, 'Engineering'].map((tag, idx) => (
                            <span key={idx} className="px-4 py-1.5 text-sm font-medium tracking-wide text-slate-600 border rounded-sm bg-white border-slate-300">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                    {!hasApplied && (
                        <button 
                            onClick={() => setShowApplyModal(true)} 
                            className="px-8 py-3 text-sm font-bold text-white transition bg-blue-600 rounded-sm hover:bg-blue-700"
                        >
                            Apply Now
                        </button>
                    )}
                    <Link 
                        to="/jobs" 
                        className="px-8 py-3 text-sm font-bold transition bg-white border border-blue-600 rounded-sm text-blue-600 hover:bg-blue-50"
                    >
                        Back to Jobs
                    </Link>
                </div>
            </div>

            {/* APPLY MODAL */}
            {showApplyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">Submit Application</h2>
                            <button onClick={() => setShowApplyModal(false)} className="p-2 transition rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 bg-white">
                            <h3 className="mb-4 text-sm font-bold text-slate-900">How would you like to apply?</h3>
                            <div className="flex p-1 mb-6 rounded-lg bg-slate-100">
                                <button onClick={() => setApplyMethod('profile')} className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition ${applyMethod === 'profile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>One-Click Apply (Profile)</button>
                                <button onClick={() => setApplyMethod('upload')} className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition ${applyMethod === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Upload Resume PDF</button>
                            </div>
                            <div className="flex items-center justify-center min-h-[100px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 mb-6">
                                {applyMethod === 'profile' ? (
                                    myResume ? (
                                        <div className="font-medium text-green-600 flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> Profile Ready to Submit</div>
                                    ) : (
                                        <div className="text-sm text-center text-slate-500">No profile found. <Link to="/resume" className="font-bold text-blue-600 underline">Build one now</Link></div>
                                    )
                                ) : (
                                    <div className="flex flex-col items-center w-full p-4">
                                        <input type="file" accept=".pdf" onChange={(e) => setCustomFile(e.target.files[0])} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                                    </div>
                                )}
                            </div>
                            <button onClick={handleApplySubmit} disabled={isApplying || (applyMethod === 'profile' && !myResume) || (applyMethod === 'upload' && !customFile)} className="flex items-center justify-center w-full py-3.5 font-bold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50">
                                {isApplying ? 'Submitting...' : 'Confirm Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
