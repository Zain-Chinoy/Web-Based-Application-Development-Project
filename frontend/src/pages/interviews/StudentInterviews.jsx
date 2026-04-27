import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, Building2, Clock, CheckCircle, XCircle, Video, AlertCircle } from 'lucide-react';

export default function StudentInterviews() {
    const { user } = useContext(AuthContext);
    const [interviews, setInterviews] = useState([]);

    const fetchInterviews = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/interviews/student/${user._id}`);
            setInterviews(res.data.data);
        } catch (error) {
            toast.error('Failed to load interviews');
        }
    };

    useEffect(() => {
        if (user) fetchInterviews();
    }, [user]);

    const handleAction = async (interviewId, action) => {
        try {
            await axios.put(`http://localhost:5000/api/interviews/${interviewId}/${action}`);
            toast.success(`Interview ${action}ed successfully!`);
            fetchInterviews(); // Refresh the list
        } catch (error) {
            toast.error(error.response?.data?.error || `Failed to ${action} interview`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-6 px-4 mb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">My Interviews</h1>
                <p className="text-slate-500">Manage your interview invitations and upcoming meetings.</p>
            </div>

            {interviews.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed rounded-2xl border-slate-200 bg-white">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <h3 className="text-lg font-bold text-slate-700">No interviews scheduled yet</h3>
                    <p className="text-slate-500">Keep applying on the Job Board!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interviews.map(interview => {
                        const job = interview.jobId;
                        if (!job) return null;

                        const isPending = interview.status === 'Pending Confirmation';
                        const isConfirmed = interview.status === 'Confirmed';
                        const isCancelled = interview.status === 'Cancelled';
                        
                        const scheduledDateObj = new Date(interview.scheduledDate);
                        const expiresAtObj = new Date(interview.expiresAt);

                        return (
                            <div key={interview._id} className={`bg-white rounded-2xl border shadow-sm flex flex-col h-full relative overflow-hidden transition-all ${isCancelled ? 'border-slate-200 opacity-75' : 'border-blue-200'}`}>
                                
                                {/* Status Banner */}
                                <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider text-center ${
                                    isPending ? 'bg-yellow-100 text-yellow-800' :
                                    isConfirmed ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {interview.status}
                                </div>

                                <div className="p-6 flex-grow">
                                    <h3 className="font-bold text-slate-900 text-xl mb-1">{job.title}</h3>
                                    <div className="flex items-center mt-2 mb-6 text-sm text-slate-600 font-medium">
                                        <Building2 className="w-4 h-4 mr-2 text-slate-400"/> {job.company}
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                                        <div className="flex items-start text-slate-700 mb-2">
                                            <Calendar className="w-4 h-4 mr-2 mt-0.5 text-blue-600"/> 
                                            <span className="font-semibold text-sm">{scheduledDateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center text-slate-700">
                                            <Clock className="w-4 h-4 mr-2 text-blue-600"/> 
                                            <span className="font-semibold text-sm">{scheduledDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>

                                    {/* TA Requirement: 24 Hour Expiration Warning */}
                                    {isPending && (
                                        <div className="flex items-start text-xs font-medium text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                            <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                                            <p>Action Required! This invitation will expire on <strong>{expiresAtObj.toLocaleString()}</strong>.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
                                    {isPending && (
                                        <div className="flex gap-3">
                                            <button onClick={() => handleAction(interview._id, 'confirm')} className="flex-1 flex items-center justify-center px-3 py-2.5 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
                                                <CheckCircle className="w-4 h-4 mr-1.5" /> Confirm
                                            </button>
                                            <button onClick={() => handleAction(interview._id, 'cancel')} className="flex-1 flex items-center justify-center px-3 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition">
                                                <XCircle className="w-4 h-4 mr-1.5" /> Decline
                                            </button>
                                        </div>
                                    )}

                                    {isConfirmed && (
                                        <button 
                                            onClick={() => window.open(interview.meetingLink, '_blank')}
                                            className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
                                        >
                                            <Video className="w-4 h-4 mr-2" /> Join Video Meeting
                                        </button>
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
    );
}
