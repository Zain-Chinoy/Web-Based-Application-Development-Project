import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Building2, Eye } from 'lucide-react';

export default function MyApplications() {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/applications/student/${user._id}`);
                setApplications(res.data.data);
            } catch (error) {
                console.log('Error fetching applications');
            }
        };
        fetchApps();
    }, [user]);

    return (
        <div className="max-w-7xl mx-auto mt-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">My Applications</h1>
                <p className="text-slate-500">Track the status of the jobs you have applied to.</p>
            </div>

            {applications.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed rounded-2xl border-slate-200 bg-white">
                    <h3 className="text-lg font-bold text-slate-700">No applications yet</h3>
                    <p className="text-slate-500">Go to the Job Board to start applying!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map(app => {
                        const job = app.jobId;
                        if (!job) return null;
                        
                        // Translate "Applied" to "Pending" for the student view
                        const displayStatus = app.status === 'Applied' ? 'Pending' : app.status;

                        return (
                            <div key={app._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full relative">
                                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${
                                    displayStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                    displayStatus === 'Shortlisted' ? 'bg-green-100 text-green-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {displayStatus}
                                </div>

                                <div className="flex-grow">
                                    <h3 className="font-bold text-slate-900 text-xl mb-1 pr-16">{job.title}</h3>
                                    <div className="flex items-center mt-3 mb-4 text-sm text-slate-600 font-medium">
                                        <Building2 className="w-4 h-4 mr-2 text-slate-400"/> {job.company}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Applied on: {new Date(app.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <Link 
                                        to={`/job/${job._id}`}
                                        className="w-full py-2.5 flex items-center justify-center bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-100 transition"
                                    >
                                        <Eye className="w-4 h-4 mr-2" /> Review Job Details
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
