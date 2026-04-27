import { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CalendarClock, ArrowLeft } from 'lucide-react';

export default function ScheduleForm() {
    const { jobId, studentId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [scheduledDate, setScheduledDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                jobId,
                studentId,
                recruiterId: user._id,
                scheduledDate
            };
            
            await axios.post('http://localhost:5000/api/interviews', payload);
            toast.success('Interview scheduled successfully! Candidate has 24 hours to confirm.');
            navigate('/interviews'); // Send back to the interview dashboard
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to schedule interview');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <Link to="/interviews" className="flex items-center text-sm font-semibold transition text-slate-500 hover:text-slate-800 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Candidates
            </Link>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-center w-12 h-12 mb-6 bg-blue-100 rounded-full text-blue-600">
                    <CalendarClock className="w-6 h-6" />
                </div>
                
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Schedule Interview</h1>
                <p className="text-slate-500 mb-8">
                    Select a date and time for this interview. The candidate will be notified and must confirm within 24 hours, or the invitation will automatically expire.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Select Date & Time</label>
                        <input 
                            type="datetime-local" 
                            required 
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700" 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting || !scheduledDate}
                        className="w-full py-3.5 flex items-center justify-center bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Sending Invitation...' : 'Send Interview Invitation'}
                    </button>
                </form>
            </div>
        </div>
    );
}
