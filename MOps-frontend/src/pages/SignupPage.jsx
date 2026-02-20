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
        { id: 'plumbing', label: 'Plumbing', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', color: '#1a73e8', bg: 'bg-[#1a73e8]/10' },
        { id: 'carpentry', label: 'Carpentry', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: '#f9ab00', bg: 'bg-[#f9ab00]/10' },
        { id: 'electrical', label: 'Electrical', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: '#c5221f', bg: 'bg-[#c5221f]/10' },
        { id: 'em', label: 'EM', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: '#137333', bg: 'bg-[#137333]/10' }
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
            navigate('/');
        } catch {
            setError('Failed to create account');
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
                        Join efficient teams. <br /> Get started today.
                    </h2>
                    <div className="space-y-4 max-w-[320px]">
                        <div className="flex items-center gap-3 text-[#64748B]">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-[15px]">Real-time request tracking</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#64748B]">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-[15px]">Automated workflow notifications</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#64748B]">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-[15px]">Comprehensive reporting dashboard</span>
                        </div>
                    </div>
                </div>

                {/* Abstract shape decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/50 to-transparent opacity-50 pointer-events-none"></div>
                <div className="z-10 text-[13px] text-[#94A3B8]">
                    By joining, you agree to our Terms and Privacy Policy.
                </div>
            </div>

            {/* Right: Auth Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
                <div className="w-full max-w-[480px] animate-fade-in my-auto">
                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-[24px] font-bold text-[#0F172A] mb-2">Create an account</h1>
                        <p className="text-[#64748B]">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Department Selection */}
                        <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Department</label>
                            <div className="grid grid-cols-2 gap-3">
                                {departments.map((dept) => (
                                    <div
                                        key={dept.id}
                                        onClick={() => handleDeptSelect(dept.id)}
                                        className={`relative bg-white border-[1.5px] rounded-[12px] p-4 cursor-pointer transition-all duration-200 group flex items-start gap-3
                                            ${formData.department === dept.id
                                                ? 'border-[#1a73e8] bg-[#e8f0fe]'
                                                : 'border-[#dadce0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'}`}
                                        style={{ borderColor: formData.department === dept.id ? '#1a73e8' : undefined }}
                                        onMouseEnter={(e) => {
                                            if (formData.department !== dept.id) e.currentTarget.style.borderColor = dept.color;
                                        }}
                                        onMouseLeave={(e) => {
                                            if (formData.department !== dept.id) e.currentTarget.style.borderColor = '#dadce0';
                                        }}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${formData.department === dept.id ? 'bg-white' : dept.bg}`}>
                                            <svg className="w-4 h-4" style={{ color: dept.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dept.icon} />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-[13px] font-medium text-[#202124] leading-tight">{dept.label}</h3>
                                            {/* Optional Short Desc */}
                                            {/* <p className="text-[11px] text-[#5f6368] mt-0.5">Maintaince</p> */}
                                        </div>
                                        {formData.department === dept.id && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-4 h-4 bg-[#1a73e8] rounded-full flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="text-[13px] text-red-500 bg-red-50 p-3 rounded-[6px] border border-red-100 flex items-center gap-2 mt-2">
                                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                {error}
                            </div>
                        )}

                        <Button type="submit" variant="primary" fullWidth loading={loading} className="!mt-6">
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-[12px] text-[#94A3B8]">
                        © 2025 MaintenancePortal. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
