import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data);
                    localStorage.setItem('user', JSON.stringify(data));
                } catch (error) {
                    console.error('Core Backend offline or memory-db wiped. Restoring from cache...');
                    // Prevent forced logout. Rehydrate from local cache instead.
                    const cachedUser = localStorage.getItem('user');
                    if (cachedUser) setUser(JSON.parse(cachedUser));
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        const res = await authService.login(credentials);
        setUser(res.user);
        return res;
    };

    const signup = async (data) => {
        const res = await authService.signup(data);
        setUser(res.user);
        return res;
    };

    const googleLogin = async (token) => {
        const res = await authService.googleLogin(token);
        setUser(res.user);
        return res;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateProfilePic = (url) => {
        const updatedUser = { ...user, profilePic: url };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, loading, updateProfilePic }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
