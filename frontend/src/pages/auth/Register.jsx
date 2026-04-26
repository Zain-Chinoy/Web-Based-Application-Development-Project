import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Building2, UserPlus, GraduationCap, ChevronDown } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student', // Default role
        companyName: '' // Only used if role is Recruiter
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Clean up payload before sending (remove companyName if Student)
            const payload = { ...formData };
            if (payload.role === 'Student') delete payload.companyName;

            await axios.post('http://localhost:5000/api/users/register', payload);
            
            toast.success('Account created! Please log in.', {
                style: { borderRadius: '10px', background: '#1e293b', color: '#fff' },
            });
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center w-full h-full overflow-hidden bg-slate-950">
            
            {/* Animated Glowing Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            {/* Frosted Glass Card (Slightly wider for the register form) */}
            <div className="relative z-10 w-full max-w-lg p-10 transition-all duration-300 border shadow-2xl backdrop-blur-2xl bg-white/10 border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
                
                <div className="flex flex-col items-center mb-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 mb-3 border shadow-inner bg-white/5 border-white/20 backdrop-blur-md rounded-2xl">
                        <GraduationCap className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">
                        Create an <span className="text-cyan-400">Account</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Role Selection Dropdown */}
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-slate-200">I am a...</label>
                        <div className="relative">
                            <select 
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full py-3 pl-4 pr-10 text-white transition-all border appearance-none shadow-inner rounded-xl backdrop-blur-md bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 [&>option]:bg-slate-800"
                            >
                                <option value="Student">Student Applicant</option>
                                <option value="Recruiter">Corporate Recruiter</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <ChevronDown className="w-5 h-5 text-cyan-200" />
                            </div>
                        </div>
                    </div>

                    {/* Name Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <User className="w-5 h-5 text-cyan-200" />
                        </div>
                        <input 
                            type="text" name="name" required placeholder="Full Name"
                            value={formData.name} onChange={handleChange}
                            className="w-full py-3 pl-11 pr-4 text-white transition-all border shadow-inner rounded-xl backdrop-blur-md bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 placeholder-slate-400"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <Mail className="w-5 h-5 text-cyan-200" />
                        </div>
                        <input 
                            type="email" name="email" required placeholder="Email Address"
                            value={formData.email} onChange={handleChange}
                            className="w-full py-3 pl-11 pr-4 text-white transition-all border shadow-inner rounded-xl backdrop-blur-md bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 placeholder-slate-400"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <Lock className="w-5 h-5 text-cyan-200" />
                        </div>
                        <input 
                            type="password" name="password" required placeholder="Password"
                            value={formData.password} onChange={handleChange}
                            className="w-full py-3 pl-11 pr-4 text-white transition-all border shadow-inner rounded-xl backdrop-blur-md bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 placeholder-slate-400"
                        />
                    </div>

                    {/* Conditional Company Name (Only shows if Recruiter is selected) */}
                    {formData.role === 'Recruiter' && (
                        <div className="relative animate-in fade-in slide-in-from-top-2">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Building2 className="w-5 h-5 text-cyan-200" />
                            </div>
                            <input 
                                type="text" name="companyName" required placeholder="Company Name"
                                value={formData.companyName} onChange={handleChange}
                                className="w-full py-3 pl-11 pr-4 text-white transition-all border shadow-inner rounded-xl backdrop-blur-md bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 placeholder-slate-400"
                            />
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="flex items-center justify-center w-full py-3 mt-4 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:from-blue-500 hover:to-cyan-400 hover:shadow-cyan-500/25 active:scale-[0.98]"
                    >
                        <span className="font-bold tracking-wide text-md">Register Now</span>
                        <UserPlus className="w-5 h-5 ml-2" />
                    </button>
                </form>

                <div className="mt-6 text-sm text-center text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold transition-colors text-cyan-400 hover:text-cyan-300">
                        Sign in
                    </Link>
                </div>

            </div>
        </div>
    );
}