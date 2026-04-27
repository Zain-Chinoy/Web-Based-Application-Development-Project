import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Building2, MapPin, Users, Calendar, DollarSign, Clock, Trash2 } from 'lucide-react';

export default function RecruiterDashboard() {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/jobs/recruiter/${user._id}`);
                setJobs(res.data.data);
            } catch (error) {
                toast.error('Failed to load jobs');
            }
        };
        fetchMyJobs();
    }, [user]);

    // Handle Job Deletion safely
    const handleDeleteJob = async (e, jobId) => {
        e.preventDefault(); 
        if (window.confirm("Are you sure you want to delete this job listing? This action cannot be undone.")) {
            try {
                await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);
                toast.success('Job deleted successfully!');
                // Remove the deleted job from the screen immediately without refreshing
                setJobs(jobs.filter(job => job._id !== jobId));
            } catch (error) {
                toast.error('Failed to delete job.');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Recruiter Dashboard</h1>
                <p className="text-slate-500">Overview of your active job listings.</p>
            </div>

            {jobs.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed rounded-xl border-slate-200 text-slate-500 bg-white">
                    No jobs posted yet. Use "Post a Job" in the navigation bar to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <div key={job._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col relative group">
                            
                            {/* Delete Button (Shows on hover) */}
                            <button 
                                onClick={(e) => handleDeleteJob(e, job._id)}
                                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                title="Delete Job"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>

                            <h3 className="font-bold text-slate-900 text-xl mb-1 pr-10">{job.title}</h3>
                            <div className="flex flex-col gap-1.5 mt-3 mb-4 text-sm text-slate-600 font-medium">
                                <div className="flex items-center"><Building2 className="w-4 h-4 mr-2 text-slate-400"/> {job.company}</div>
                                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-slate-400"/> {job.location}</div>
                                <div className="flex items-center"><DollarSign className="w-4 h-4 mr-2 text-slate-400"/> {job.salary || 'Competitive'}</div>
                                <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-slate-400"/> {job.type}</div>
                                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400"/> Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
                            </div>
                            <div className="mt-auto pt-4 border-t border-slate-100">
                                <Link 
                                    to="/applicants"
                                    className="w-full py-2.5 flex items-center justify-center bg-blue-50 text-blue-700 font-semibold rounded-xl border border-blue-200 hover:bg-blue-100 transition"
                                >
                                    <Users className="w-4 h-4 mr-2" /> View Applicants
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
