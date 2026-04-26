import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Logged in successfully!', {
                style: { borderRadius: '10px', background: '#1e293b', color: '#fff' },
            });
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center w-full h-full overflow-hidden bg-slate-950">
            
            {/* Animated Glowing Blue Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30"></div>

            {/* Frosted Glass Card */}
            <div className="relative z-10 w-full max-w-md p-10 transition-all duration-300 border shadow-2xl backdrop-blur-2xl bg-white/10 border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
                
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="flex items-center justify-center w-14 h-14 mb-4 border shadow-inner bg-white/5 border-white/20 backdrop-blur-md rounded-2xl">
                        <GraduationCap className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                        Career<span className="text-cyan-400">Connect</span>
                    </h1>
                    <p className="mt-2 text-sm font-medium tracking-wide text-slate-300">University Recruitment Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-200 drop-shadow-sm">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Mail className="w-5 h-5 text-cyan-200" />
                            </div>
                            <input 
                                type="email" 
                                required
                                className="w-full py-3.5 pl-11 pr-4 text-white transition-all border shadow-inner rounded-xl backdrop-blur-md bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 focus:bg-white/10 placeholder-slate-400"
                                placeholder="student@khi.iba.edu.pk"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-200 drop-shadow-sm">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Lock className="w-5 h-5 text-cyan-200" />
                            </div>
                            <input 
                                type="password" 
                                required
                                className="w-full py-3.5 pl-11 pr-4 text-white transition-all border shadow-inner rounded-xl backdrop-blur-md bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 focus:bg-white/10 placeholder-slate-400"
                                placeholder="••••••••"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="flex items-center justify-center w-full py-3.5 mt-2 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:from-blue-500 hover:to-cyan-400 hover:shadow-cyan-500/25 active:scale-[0.98]"
                    >
                        <span className="font-bold tracking-wide text-md">Access Portal</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </form>

                {/* SIGN UP LINK ADDED HERE */}
                <div className="mt-6 text-sm text-center text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold transition-colors text-cyan-400 hover:text-cyan-300">
                        Sign up here
                    </Link>
                </div>

            </div>
        </div>
    );
}