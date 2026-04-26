import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResumeBuilder from './pages/resume/ResumeBuilder';

// A simple protected route wrapper
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
          
          {/* Left Side: Brand Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Career<span className="text-cyan-400">Connect</span></h1>
          </div>

          {/* Center: Navigation Links (Absolutely positioned for perfect centering) */}
          <div className="absolute hidden transform -translate-x-1/2 md:flex left-1/2 gap-8">
              <Link to="/" className="text-sm font-medium text-slate-300 transition hover:text-white">Dashboard</Link>
              {user.role === 'Student' && (
                  <Link to="/resume" className="text-sm font-medium text-slate-300 transition hover:text-white">Resume Builder</Link>
              )}
          </div>

          {/* Right Side: User Info & Logout */}
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
              <h2 className="mt-10 text-2xl font-bold text-center text-slate-800">Welcome to the Dashboard!</h2>
              <p className="text-center text-slate-500">Milestone 4 workflows loading...</p>
            </ProtectedRoute>
          } />

          <Route path="/resume" element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  );
}

export default App;
