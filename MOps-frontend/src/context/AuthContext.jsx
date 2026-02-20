import { createContext, useContext, useState, useEffect } from 'react';
import { setTokenGetter } from '../services/api';

const AuthContext = createContext(null);
const API_BASE_URL = 'http://localhost:8083';

export const AuthProvider = ({ children }) => {
    // Lazy initialization for user state to avoid useEffect and direct storage access
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            // Handle both old format (roles array) and new format (role string)
            if (userData.roles && !userData.role) {
                const role = userData.roles.length > 0 ? userData.roles[0] : 'REQUESTER';
                userData.role = role;
                userData.name = userData.username || userData.name;
            }
            return userData;
        }
        return null;
    });
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(false);

    // Notify api.js of token getter and setter
    useEffect(() => {
        setTokenGetter(() => accessToken, (newToken) => setAccessToken(newToken));
    }, [accessToken]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies (for refresh token)
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            const { accessToken: token, tokenType, expiresIn, user: userData } = data;

            // Extract role from roles array and normalize
            const role = userData.roles && userData.roles.length > 0 ? userData.roles[0] : 'REQUESTER';
            const normalizedUser = {
                ...userData,
                role: role,
                name: userData.username || userData.name // Handle both username and name fields
            };

            // Store token and user info (token in memory, user in localStorage)
            localStorage.setItem('tokenType', tokenType);
            localStorage.setItem('expiresIn', expiresIn);
            localStorage.setItem('user', JSON.stringify(normalizedUser));

            setAccessToken(token);
            setUser(normalizedUser);

            return normalizedUser;
        } catch (error) {
            throw new Error(error.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const signup = async (name, email, password, department) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    username: name,
                    email, 
                    password,
                    orgDeptName: department,
                    roles: ['REQUESTER']
                }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Signup failed');
            }

            // Signup successful - return success without auto-login
            // User must go to login page to authenticate
            return { success: true };
        } catch (error) {
            throw new Error(error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            console.log('[AuthContext] Calling logout endpoint');
            
            // Backend logout endpoint reads refresh token from HttpOnly cookie
            // Does not require Authorization header
            const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Send refresh token from HttpOnly cookie
            });
            
            console.log('[AuthContext] Logout response:', response.status);
        } catch (error) {
            console.error('[AuthContext] Logout error:', error);
        } finally {
            // Always clear local state
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('tokenType');
            localStorage.removeItem('expiresIn');
            console.log('[AuthContext] Local tokens cleared');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, accessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
