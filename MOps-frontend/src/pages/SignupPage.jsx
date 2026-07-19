import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!/^\d{10}$/.test(formData.mobileNumber)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            setLoading(true);
            await signup(formData.name, formData.email, formData.password, formData.mobileNumber);
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 font-body overflow-y-auto py-8 sm:py-12">
            {/* Logo */}
            <div className="mb-6 sm:mb-8 flex flex-col items-center gap-2 sm:gap-3 animate-fadeUp">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center shadow-sm text-primary">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <span className="text-[20px] sm:text-[24px] font-display font-medium text-on-surface tracking-tight">MaintenOps</span>
            </div>

            {/* Signup Card */}
            <div className="w-full max-w-[500px] bg-white border border-outline rounded-2xl p-6 sm:p-10 shadow-sm animate-fadeUp" style={{ animationDelay: '100ms' }}>
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-[22px] sm:text-[24px] font-display font-medium text-on-surface mb-1 sm:mb-2">Create account</h1>
                    <p className="text-[13px] sm:text-[14px] text-on-surface-variant font-ui">to join MaintenOps (ISKCON NVCC)</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    <Input
                        label="Full Name"
                        name="name"
                        placeholder="Nityanand Das"
                        value={formData.name}
                        onChange={handleChange}
                        className="font-ui text-sm sm:text-base"
                        required
                    />

                    <Input
                        label="Email address"
                        type="email"
                        name="email"
                        placeholder="nityananda@iskconnvcc.in"
                        value={formData.email}
                        onChange={handleChange}
                        className="font-ui text-sm sm:text-base"
                        required
                    />

                    <Input
                        label="Mobile Number (10 digits)"
                        name="mobileNumber"
                        placeholder="9876543210"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="font-ui text-sm sm:text-base"
                        required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="6+ chars"
                            value={formData.password}
                            onChange={handleChange}
                            className="font-ui text-sm sm:text-base"
                            showPasswordToggle={true}
                            required
                        />
                        <Input
                            label="Confirm"
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-type"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="font-ui text-sm sm:text-base"
                            showPasswordToggle={true}
                            required
                        />
                    </div>


                    {error && (
                        <div className="text-[12px] sm:text-[13px] text-error bg-error-container/30 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-error/10 flex items-center gap-2 font-ui animate-fadeUp">
                            <svg className="w-4 h-4 shrink-0 fill-error" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-4 !mt-8 sm:!mt-10">
                        <div className="flex items-center justify-between text-[13px] sm:text-[14px]">
                            <Link to="/login" className="text-primary hover:text-primary/80 font-medium font-ui transition-colors">Sign in instead</Link>
                            <Button type="submit" variant="primary" loading={loading} className="px-6 sm:px-8 !rounded-xl">
                                Create
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="mt-8 flex gap-5 sm:gap-6 text-[11px] sm:text-[12px] text-on-surface-variant font-ui">
                <a href="#" className="hover:text-on-surface">Privacy</a>
                <a href="#" className="hover:text-on-surface">Terms</a>
                <a href="#" className="hover:text-on-surface">Help</a>
            </div>

            <div className="mt-4 text-[10px] sm:text-[11px] text-on-surface-variant/60 font-ui">
                © 2026 MaintenOps. All rights reserved.
            </div>
        </div>
    );
};

export default SignupPage;
