import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Building2, MapPin, Clock, Eye, DollarSign, Calendar } from 'lucide-react';

export default function StudentJobBoard() {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    
    useEffect(() => {
        if (user?._id) {
            fetchJobs();
        }
    }, [user]);

    const fetchJobs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/jobs?status=Open');
            setJobs(res.data.data);
        } catch (error) {
            toast.error('Failed to load available jobs');
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Job Board</h1>
                <p className="text-slate-500">Discover and apply for your next opportunity.</p>
            </div>

            {jobs.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed rounded-2xl border-slate-200 bg-white">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <h3 className="text-lg font-bold text-slate-700">No jobs available right now</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <div key={job._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full relative">
                            
                            <div className="flex-grow">
                                <h3 className="font-bold text-slate-900 text-xl mb-1 pr-16">{job.title}</h3>
                                <div className="flex flex-col gap-1.5 mt-3 mb-4 text-sm text-slate-600 font-medium">
                                    <div className="flex items-center"><Building2 className="w-4 h-4 mr-2 text-slate-400"/> {job.company}</div>
                                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-slate-400"/> {job.location}</div>
                                    <div className="flex items-center"><DollarSign className="w-4 h-4 mr-2 text-slate-400"/> {job.salary || 'Competitive'}</div>
                                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400"/> Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100">
                                <Link 
                                    to={`/job/${job._id}`}
                                    className="w-full py-2.5 flex items-center justify-center bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-100 transition"
                                >
                                    <Eye className="w-4 h-4 mr-2" /> View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
