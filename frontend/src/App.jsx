// export default App;
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register'; // <-- ADD THIS IMPORT

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
      
      {/* Temporary basic Navbar just to see who is logged in */}
      {user && (
        <nav className="fixed top-0 left-0 z-50 flex items-center justify-between w-full p-4 text-white bg-slate-900 border-b border-white/10">
          <h1 className="text-xl font-bold">Career<span className="text-cyan-400">Connect</span></h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-300">
              Hello, {user.name} <span className="px-2 py-1 ml-2 text-xs rounded-full bg-slate-800 text-cyan-400">{user.role}</span>
            </span>
            <button onClick={logout} className="px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-500/80 rounded hover:bg-red-500">
              Logout
            </button>
          </div>
        </nav>
      )}

      {/* Main Routing Container */}
      <div className={user ? "pt-20 p-4" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* <-- ADD THIS ROUTE */}
          
          <Route path="/" element={
            <ProtectedRoute>
              <h2 className="mt-10 text-2xl font-bold text-center text-slate-800">Welcome to the Dashboard!</h2>
              <p className="text-center text-slate-500">Milestone 4 workflows loading...</p>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  );
}

export default App;