import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Auth & General
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResumeBuilder from './pages/resume/ResumeBuilder';

// Student Routes
import StudentJobBoard from './pages/jobs/StudentJobBoard';
import JobDetails from './pages/jobs/JobDetails';
import MyApplications from './pages/jobs/MyApplications';

// Recruiter Routes
import RecruiterDashboard from './pages/jobs/RecruiterDashboard';
import PostJob from './pages/jobs/PostJob';
import ReviewApplicants from './pages/jobs/ReviewApplicants'; // NEW IMPORT

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <Toaster position="top-right" />
      
      {user && (
        <nav className="fixed top-0 left-0 z-50 flex items-center justify-between w-full p-4 text-white bg-slate-900 border-b border-white/10">
          
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Career<span className="text-cyan-400">Connect</span></h1>
          </div>

          <div className="absolute hidden transform -translate-x-1/2 md:flex left-1/2 gap-8">
              {user.role === 'Student' ? (
                  <>
                    <Link to="/" className="text-sm font-medium text-slate-300 transition hover:text-white">Job Board</Link>
                    <Link to="/resume" className="text-sm font-medium text-slate-300 transition hover:text-white">Resume Builder</Link>
                    <Link to="/my-applications" className="text-sm font-medium text-slate-300 transition hover:text-white">My Applications</Link>
                  </>
              ) : (
                  <>
                    <Link to="/" className="text-sm font-medium text-slate-300 transition hover:text-white">Dashboard</Link>
                    <Link to="/post-job" className="text-sm font-medium text-slate-300 transition hover:text-white">Post a Job</Link>
                    <Link to="/applicants" className="text-sm font-medium text-slate-300 transition hover:text-white">Review Applicants</Link>
                  </>
              )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-300">
              {user.name} <span className="px-2 py-1 ml-2 text-xs rounded-full bg-slate-800 text-cyan-400">{user.role}</span>
            </span>
            <button onClick={logout} className="px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-500/80 rounded hover:bg-red-500">
              Logout
            </button>
          </div>
        </nav>
      )}

      <div className={user ? "pt-20 p-4" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              {user?.role === 'Recruiter' ? <RecruiterDashboard /> : <StudentJobBoard />}
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/jobs" element={<ProtectedRoute><StudentJobBoard /></ProtectedRoute>} />
          <Route path="/job/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
          <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />

          {/* Recruiter Routes */}
          <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
          <Route path="/applicants" element={<ProtectedRoute><ReviewApplicants /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
