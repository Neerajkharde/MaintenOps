import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Lazy initialization for user state to avoid useEffect and direct storage access
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(false);

    const login = (email, password) => {
        setLoading(true);
        // Mock login logic with specific roles
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simplified mock check - accept any password for now to ease testing
                // In a real app, we would validate password hash
                if (password) {
                    let role = 'User';
                    let name = 'Requester';

                    if (email === 'admin@example.com') {
                        role = 'Admin';
                        name = 'Facility Manager';
                    } else if (email === 'super@example.com') {
                        role = 'SuperAdmin';
                        name = 'Overseer';
                    } else if (email === 'user@example.com') {
                        role = 'User';
                        name = 'Requester';
                    } else if (email.startsWith('admin')) {
                        role = 'Admin';
                        name = 'Admin User';
                    }

                    const userData = {
                        name,
                        email,
                        role
                    };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    setLoading(false);
                    resolve(userData);
                } else {
                    setLoading(false);
                    reject(new Error('Invalid email or password'));
                }
            }, 800);
        });
    };

    const signup = (name, email, password) => {
        setLoading(true);
        // Mock signup logic (password unused in mock but kept for API signature)
        return new Promise((resolve) => {
            setTimeout(() => {
                const userData = { name, email, role: 'Employee', _debug_password_exists: !!password };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                setLoading(false);
                resolve(userData);
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
