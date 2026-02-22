import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { getDashboardRoute } from '../utils/roleUtils';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const userData = await login(email, password);
            const route = getDashboardRoute(userData.role);
            navigate(route);
        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-body">
            {/* Logo */}
            <div className="mb-8 flex flex-col items-center gap-3 animate-fadeUp">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <span className="text-[24px] font-display font-medium text-on-surface tracking-tight">MaintenOps</span>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-[448px] bg-white border border-outline rounded-xl p-8 lg:p-10 shadow-sm animate-fadeUp" style={{ animationDelay: '100ms' }}>
                <div className="text-center mb-8">
                    <h1 className="text-[24px] font-display font-medium text-on-surface mb-2">Sign in</h1>
                    <p className="text-[14px] text-on-surface-variant font-ui">to continue to MaintenOps</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email or phone"
                        type="email"
                        placeholder="nityananda@iskconnvcc.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="font-ui"
                    />

                    <div className="relative group">
                        <Input
                            label="Enter your password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="font-ui"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-[34px] text-on-surface-variant hover:text-on-surface transition-colors p-1"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="text-[13px] text-error bg-error-container/30 px-4 py-3 rounded-md border border-error/10 flex items-center gap-2 font-ui animate-fadeUp">
                            <svg className="w-4 h-4 shrink-0 fill-error" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-4 !mt-10">
                        <div className="flex items-center justify-between text-[14px]">
                            <Link to="/signup" className="text-primary hover:text-primary/80 font-medium font-ui transition-colors">Create account</Link>
                            <Button type="submit" variant="primary" loading={loading} className="px-8 !rounded-md">
                                Next
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="mt-8 flex gap-6 text-[12px] text-on-surface-variant font-ui">
                <a href="#" className="hover:text-on-surface">Privacy</a>
                <a href="#" className="hover:text-on-surface">Terms</a>
                <a href="#" className="hover:text-on-surface">Help</a>
            </div>
        </div>
    );
};

export default LoginPage;
