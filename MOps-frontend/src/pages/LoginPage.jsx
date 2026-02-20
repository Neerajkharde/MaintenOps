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

            // Redirect based on role
            const route = getDashboardRoute(userData.role);
            navigate(route);
        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans">

            {/* Left: Brand/Marketing (Hidden on Mobile) */}
            <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 bg-[#F8FAFC] border-r border-[#E2E8F0] relative overflow-hidden">
                <div className="z-10">
                    <Link to="/" className="flex items-center gap-2.5 mb-12">
                        <div className="w-8 h-8 bg-[#2563EB] rounded-[6px] flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-[16px] font-bold text-[#0F172A] tracking-tight">MaintenancePortal</span>
                    </Link>

                    <h2 className="text-[32px] font-bold text-[#0F172A] leading-tight mb-4">
                        Manage your facility with <br /> confidence.
                    </h2>
                    <p className="text-[#64748B] text-[16px] max-w-[320px]">
                        Streamlined workflows for modern teams. Track requests, approve jobs, and monitor progress.
                    </p>
                </div>

                {/* Abstract shape decoration */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="z-10 text-[13px] text-[#94A3B8]">
                    &copy; {new Date().getFullYear()} Maintenance Portal Inc.
                </div>
            </div>

            {/* Right: Auth Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
                <div className="w-full max-w-[400px] animate-fade-in">
                    <div className="mb-8">
                        <h1 className="text-[24px] font-bold text-[#0F172A] mb-2">Welcome back</h1>
                        <p className="text-[#64748B]">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={error && !email ? 'Email is required' : ''}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={error && !password ? 'Password is required' : ''}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[36px] text-[#94A3B8] hover:text-[#64748B] transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="text-[13px] text-red-500 bg-red-50 p-3 rounded-[6px] border border-red-100 flex items-center gap-2">
                                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                {error}
                            </div>
                        )}

                        <Button type="submit" variant="primary" fullWidth loading={loading} className="!mt-6">
                            Log in
                        </Button>

                        <div className="text-center mt-4">
                            <a href="#" className="text-[14px] text-[#64748B] hover:text-[#0F172A] transition-colors">
                                Forgot password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
