import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Building2, MapPin, Users, CalendarPlus, Calendar, Clock, Video } from 'lucide-react';

export default function RecruiterInterviews() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('schedule'); 
    
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [shortlistedApps, setShortlistedApps] = useState([]);
    const [isLoadingApps, setIsLoadingApps] = useState(false);

    const [scheduledInterviews, setScheduledInterviews] = useState([]);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/jobs/recruiter/${user._id}`);
                setJobs(res.data.data);
            } catch (error) {
                toast.error('Failed to load jobs');
            }
        };

        const fetchScheduled = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/interviews/recruiter/${user._id}`);
                setScheduledInterviews(res.data.data);
            } catch (error) {
                toast.error('Failed to load scheduled interviews');
            }
        };

        if (user) {
            fetchMyJobs();
            fetchScheduled();
        }
    }, [user]);

    const viewShortlisted = async (jobId) => {
        setIsLoadingApps(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`);
            const shortlisted = res.data.data.filter(app => app.status === 'Shortlisted');
            setShortlistedApps(shortlisted);
            setSelectedJob(jobId);
        } catch (error) {
            toast.error('Failed to load candidates');
        } finally {
            setIsLoadingApps(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-6 mb-20 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Interview Management</h1>
                <p className="text-slate-500">Schedule new interviews and manage upcoming ones.</p>
            </div>

            <div className="flex gap-4 mb-6 border-b border-slate-200 pb-px">
                <button 
                    onClick={() => setActiveTab('schedule')}
                    className={`flex items-center pb-3 px-4 font-semibold transition-colors ${activeTab === 'schedule' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <Users className="w-5 h-5 mr-2" /> Schedule Candidates
                </button>
                <button 
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex items-center pb-3 px-4 font-semibold transition-colors ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <Calendar className="w-5 h-5 mr-2" /> Scheduled Interviews
                </button>
            </div>

            {activeTab === 'schedule' && (
                <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
                    <div className="w-full lg:w-1/3 space-y-4 shrink-0">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Your Posted Jobs</h2>
                        {jobs.length === 0 ? (
                            <div className="p-6 text-center border-2 border-dashed rounded-xl border-slate-200 text-slate-500">
                                No jobs posted yet. Use the navbar to post a job.
                            </div>
                        ) : (
                            jobs.map(job => (
                                <div 
                                    key={job._id} 
                                    onClick={() => viewShortlisted(job._id)}
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

                    <div className="w-full lg:w-2/3 flex-grow min-w-0">
                        {selectedJob ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full">
                                <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-center">
                                    <h2 className="font-bold text-slate-800 text-lg">Shortlisted Candidates</h2>
                                    <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">{shortlistedApps.length} Candidates</span>
                                </div>
                                
                                <div className="p-6">
                                    {isLoadingApps ? (
                                        <div className="flex justify-center items-center py-12 text-slate-400">Loading candidates...</div>
                                    ) : shortlistedApps.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                            <p className="text-slate-500 font-medium">No shortlisted candidates for this position yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {shortlistedApps.map(app => {
                                                const applicantName = app.studentId?.name || app.resumeId?.personalInfo?.fullName || 'Applicant Profile';
                                                const applicantEmail = app.studentId?.email || app.resumeId?.personalInfo?.email || 'Email not provided';

                                                return (
                                                    <div key={app._id} className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                                                        <div className="flex-grow min-w-0">
                                                            <h4 className="font-bold text-slate-900 text-lg truncate">{applicantName}</h4>
                                                            <p className="text-sm text-slate-500 font-medium truncate mb-2">{applicantEmail}</p>
                                                        </div>
                                                        
                                                        <div className="w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-slate-200 pt-3 sm:pt-0">
                                                            <button 
                                                                onClick={() => navigate(`/schedule-interview/${selectedJob}/${app.studentId._id}`)}
                                                                className="flex items-center justify-center w-full px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition"
                                                            >
                                                                <CalendarPlus className="w-4 h-4 mr-2" /> Schedule Interview
                                                            </button>
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
                                <p className="text-md text-slate-500 max-w-md">Select a job from the left panel to view the candidates who have been shortlisted and are ready to be interviewed.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'upcoming' && (
                <div>
                    {scheduledInterviews.length === 0 ? (
                        <div className="p-12 text-center border-2 border-dashed rounded-2xl border-slate-200 bg-white">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <h3 className="text-lg font-bold text-slate-700">No interviews scheduled yet</h3>
                            <p className="text-slate-500">Go to the 'Schedule Candidates' tab to invite shortlisted candidates to interview.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {scheduledInterviews.map(interview => {
                                const job = interview.jobId;
                                if (!job) return null;

                                const isPending = interview.status === 'Pending Confirmation';
                                const isConfirmed = interview.status === 'Confirmed';
                                const isCancelled = interview.status === 'Cancelled';
                                
                                const scheduledDateObj = new Date(interview.scheduledDate);
                                
                                // --- NEW: Extracting the candidate's name ---
                                const candidateName = interview.studentId?.name || 'Candidate Profile';

                                return (
                                    <div key={interview._id} className={`bg-white rounded-2xl border shadow-sm flex flex-col h-full relative overflow-hidden transition-all ${isCancelled ? 'border-slate-200 opacity-75' : 'border-blue-200'}`}>
                                        
                                        <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider text-center ${
                                            isPending ? 'bg-yellow-100 text-yellow-800' :
                                            isConfirmed ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {interview.status}
                                        </div>

                                        <div className="p-6 flex-grow">
                                            <h3 className="font-bold text-slate-900 text-xl mb-2">{job.title}</h3>
                                            
                                            {/* --- NEW: Candidate Name Display --- */}
                                            <div className="flex items-center mb-4 text-sm font-bold text-blue-600 bg-blue-50 w-max px-3 py-1 rounded-lg">
                                                <Users className="w-4 h-4 mr-2" /> Candidate: {candidateName}
                                            </div>

                                            <div className="flex items-center mt-2 mb-5 text-sm text-slate-600 font-medium">
                                                <Building2 className="w-4 h-4 mr-2 text-slate-400"/> {job.company}
                                            </div>

                                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-2">
                                                <div className="flex items-start text-slate-700 mb-2">
                                                    <Calendar className="w-4 h-4 mr-2 mt-0.5 text-blue-600"/> 
                                                    <span className="font-semibold text-sm">{scheduledDateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center text-slate-700">
                                                    <Clock className="w-4 h-4 mr-2 text-blue-600"/> 
                                                    <span className="font-semibold text-sm">{scheduledDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
                                            {isConfirmed && (
                                                <button 
                                                    onClick={() => window.open(interview.meetingLink, '_blank')}
                                                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
                                                >
                                                    <Video className="w-4 h-4 mr-2" /> Join Video Meeting
                                                </button>
                                            )}
                                            {isPending && (
                                                <div className="text-center text-sm font-semibold text-yellow-600 py-2">
                                                    Waiting for Candidate Confirmation
                                                </div>
                                            )}
                                            {isCancelled && (
                                                <div className="text-center text-sm font-semibold text-slate-500 py-2">
                                                    Interview Cancelled
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
