import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Check if user is already logged in (saved in localStorage)
    useEffect(() => {
        const storedUser = localStorage.getItem('careerConnectUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
        setUser(res.data.data);
        localStorage.setItem('careerConnectUser', JSON.stringify(res.data.data));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('careerConnectUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};