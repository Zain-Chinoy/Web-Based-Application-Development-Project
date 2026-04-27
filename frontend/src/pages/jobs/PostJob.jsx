import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';

export default function PostJob() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isPosting, setIsPosting] = useState(false);

    // Added salary and deadline to fix the backend validation error
    const [jobForm, setJobForm] = useState({
        title: '', company: user?.companyName || '', location: '', type: 'Full-time', 
        salary: '', deadline: '', description: '', requirements: ''
    });

    const handlePostJob = async (e) => {
        e.preventDefault();
        setIsPosting(true);
        try {
            const payload = { ...jobForm, recruiterId: user._id, status: 'Open' };
            await axios.post('http://localhost:5000/api/jobs', payload);
            toast.success('Job posted successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to post job');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Post a New Job</h1>
                <p className="text-slate-500">Fill out the details to publish a new opportunity.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <form onSubmit={handlePostJob} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                            <input type="text" required value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Frontend Developer" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                            <input type="text" required value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                            <input type="text" required value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Remote, Karachi" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                            <select value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Internship</option>
                                <option>Contract</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Salary / Compensation</label>
                            <input type="text" required value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 150k PKR or Competitive" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline</label>
                            <input type="date" required value={jobForm.deadline} onChange={e => setJobForm({...jobForm, deadline: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
                        <textarea required rows="4" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe the role and responsibilities..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Requirements</label>
                        <textarea required rows="3" value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="List required skills and experience..." />
                    </div>
                    <button type="submit" disabled={isPosting} className="w-full py-3 bg-blue-600 flex items-center justify-center text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                        <PlusCircle className="w-5 h-5 mr-2" /> {isPosting ? 'Posting...' : 'Publish Job'}
                    </button>
                </form>
            </div>
        </div>
    );
}
