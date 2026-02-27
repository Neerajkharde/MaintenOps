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
        department: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const departments = [
        { id: 'Seva Office', label: 'Seva Office', icon: 'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m0-2c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm3.5 8c.83 0 1.5.67 1.5 1.5S16.33 19 15.5 19 14 18.33 14 17.5s.67-1.5 1.5-1.5z', color: '#1a73e8' },
        { id: 'Jiva Daya', label: 'Jiva Daya', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', color: '#d93025' },
        { id: 'Campus Program', label: 'Campus Program', icon: 'M12 14l9-5-9-5-9 5m0 0l9 5m-9-5v10l9 5m0-10l9-5m-9 5v10m0-10l-9-5m19 5l-9-5', color: '#f9ab00' },
        { id: 'Kitchen', label: 'Kitchen', icon: 'M9 3v2H5v4h4v2H2v4h2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h2v-4h-7V5h4V3H9zm0 5h6v10H9V8z', color: '#137333' }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDeptSelect = (deptId) => {
        setFormData({ ...formData, department: deptId });
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

        if (!formData.department) {
            setError('Please select a department');
            return;
        }

        try {
            setLoading(true);
            await signup(formData.name, formData.email, formData.password, formData.department);
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="6+ chars"
                            value={formData.password}
                            onChange={handleChange}
                            className="font-ui text-sm sm:text-base"
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
                            required
                        />
                    </div>

                    {/* Department Selection */}
                    <div className="space-y-3">
                        <label className="text-[11px] sm:text-[12px] font-ui font-bold text-on-surface-variant uppercase tracking-widest pl-1">Target Department</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                            {departments.map((dept) => (
                                <div
                                    key={dept.id}
                                    onClick={() => handleDeptSelect(dept.id)}
                                    className={`relative bg-transparent border-[1.5px] rounded-[14px] p-3 sm:p-3 cursor-pointer transition-all flex items-center gap-3 group
                                        ${formData.department === dept.id
                                            ? 'border-primary bg-primary-container/20'
                                            : 'border-outline/40 hover:border-outline hover:bg-surface-variant/20'}`}
                                >
                                    <div className={`w-8 h-8 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                                        ${formData.department === dept.id ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface-variant group-hover:bg-surface-variant/50'}`}>
                                        <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={dept.icon} />
                                        </svg>
                                    </div>
                                    <span className={`text-[12px] sm:text-[13px] font-display font-medium transition-colors ${formData.department === dept.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                                        {dept.label}
                                    </span>
                                    {formData.department === dept.id && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center shadow-sm">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
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
