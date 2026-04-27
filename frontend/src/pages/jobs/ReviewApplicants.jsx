import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Building2, MapPin, Users, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';

export default function ReviewApplicants() {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/jobs/recruiter/${user._id}`);
                setJobs(res.data.data);
            } catch (error) {
                toast.error('Failed to load jobs');
            }
        };
        if (user) fetchMyJobs();
    }, [user]);

    const viewApplicants = async (jobId) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`);
            setApplicants(res.data.data);
            setSelectedJob(jobId);
        } catch (error) {
            toast.error('Failed to load applicants');
        } finally {
            setIsLoading(false);
        }
    };

    const updateApplicationStatus = async (appId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/${appId}/status`, { status: newStatus });
            toast.success(`Applicant marked as ${newStatus}`);
            viewApplicants(selectedJob);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-6 mb-20 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Review Applicants</h1>
                <p className="text-slate-500">Select a job to view and manage its candidates.</p>
            </div>

            {/* ROCK-SOLID FLEX LAYOUT INSTEAD OF GRID */}
            <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
                
                {/* Left: Job List (Strictly 1/3 width, never shrinks) */}
                <div className="w-full lg:w-1/3 space-y-4 shrink-0">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Active Listings</h2>
                    {jobs.length === 0 ? (
                        <div className="p-6 text-center border-2 border-dashed rounded-xl border-slate-200 text-slate-500">
                            No jobs posted yet.
                        </div>
                    ) : (
                        jobs.map(job => (
                            <div 
                                key={job._id} 
                                onClick={() => viewApplicants(job._id)}
                                className={`p-5 rounded-xl border cursor-pointer transition-all w-full ${selectedJob === job._id ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                            >
                                <h3 className="font-bold text-slate-900 text-lg leading-tight break-words">{job.title}</h3>
                                <div className="flex flex-col gap-1.5 mt-3 text-sm text-slate-500">
                                    <span className="flex items-center"><Building2 className="w-4 h-4 mr-2 shrink-0"/> <span className="truncate">{job.company}</span></span>
                                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 shrink-0"/> <span className="truncate">{job.location}</span></span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Right: Applicant Review Panel (Takes up remaining space, min-w-0 prevents overflow squishing) */}
                <div className="w-full lg:w-2/3 flex-grow min-w-0">
                    {selectedJob ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full">
                            <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-center">
                                <h2 className="font-bold text-slate-800 text-lg">Candidate Profiles</h2>
                                <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{applicants.length} Total</span>
                            </div>
                            
                            <div className="p-6">
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-12 text-slate-400">Loading applicants...</div>
                                ) : applicants.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        <p className="text-slate-500 font-medium">No applications received yet for this position.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {applicants.map(app => {
                                            const displayStatus = app.status === 'Applied' ? 'Pending' : app.status;
                                            
                                            // ROBUST FALLBACK FOR APPLICANT NAME
                                            const applicantName = app.studentId?.name || app.resumeId?.personalInfo?.fullName || 'Applicant Profile';
                                            const applicantEmail = app.studentId?.email || app.resumeId?.personalInfo?.email || 'Email not provided';

                                            return (
                                                <div key={app._id} className="p-5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:shadow-sm transition-all flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 w-full">
                                                    
                                                    {/* Applicant Info */}
                                                    <div className="flex-grow min-w-0">
                                                        <h4 className="font-bold text-slate-900 text-lg truncate">{applicantName}</h4>
                                                        <p className="text-sm text-slate-500 font-medium truncate mb-3">{applicantEmail}</p>
                                                        <span className={`text-xs px-3 py-1.5 rounded-md font-bold uppercase tracking-wider ${
                                                            displayStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            displayStatus === 'Shortlisted' ? 'bg-green-100 text-green-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                            {displayStatus}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Actions */}
                                                    <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto shrink-0 pt-3 xl:pt-0 border-t xl:border-t-0 border-slate-200">
                                                        
                                                        {app.resumeId ? (
                                                            <button 
                                                                onClick={() => window.open(`http://localhost:5000/api/resumes/${app.studentId?._id}/pdf`, '_blank')}
                                                                className="flex items-center justify-center px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 shadow-sm"
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" /> View Resume
                                                            </button>
                                                        ) : (
                                                            <div className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg">
                                                                <FileText className="w-4 h-4 mr-2 text-slate-400" /> 
                                                                <span className="truncate max-w-[120px]">{app.customResumeName || 'Custom PDF'}</span>
                                                            </div>
                                                        )}
                                                        
                                                        {app.status === 'Applied' && (
                                                            <div className="flex gap-2 w-full sm:w-auto">
                                                                <button onClick={() => updateApplicationStatus(app._id, 'Shortlisted')} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm transition">
                                                                    <CheckCircle className="w-4 h-4 mr-1.5" /> Shortlist
                                                                </button>
                                                                <button onClick={() => updateApplicationStatus(app._id, 'Rejected')} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition">
                                                                    <XCircle className="w-4 h-4 mr-1.5" /> Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full min-h-[400px] bg-slate-50 rounded-2xl border-2 border-slate-200 border-dashed text-slate-400 p-8 text-center">
                            <Users className="w-16 h-16 mb-4 text-slate-300" />
                            <h3 className="text-xl font-bold text-slate-700 mb-2">No Job Selected</h3>
                            <p className="text-md text-slate-500 max-w-md">Select a job posting from the left panel to review its applicants, view their resumes, and update their statuses.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
