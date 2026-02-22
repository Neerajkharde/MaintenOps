import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';

const ProfilePage = () => {
    const { user } = useAuth();

    const profileInfo = {
        name: user?.name || user?.username || 'Hitesh K',
        email: user?.email || 'hitesh.k@example.com',
        phone: '+91 98765 43210',
        department: 'Operations & Facilities',
        role: user?.role === 'REQUESTER' ? 'Standard User' : user?.role,
        joinDate: 'March 15, 2024',
        location: 'ISKCON NVCC, Pune, Building B'
    };

    return (
        <div className="relative pb-24 px-6 sm:px-8 mt-4 max-w-[1400px] mx-auto animate-fadeUp">
            {/* Page Header */}
            <div className="mb-10">
                <h1 className="text-[32px] font-display font-medium text-on-surface tracking-tight mb-2">Account Management</h1>
                <p className="text-[15px] font-ui text-on-surface-variant">View and manage your professional profile and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: ID Summary */}
                <div className="lg:col-span-4">
                    <div className="google-card p-10 flex flex-col items-center border-t-8 border-primary bg-white shadow-sm">
                        <div className="relative mb-8">
                            <div className="w-32 h-32 rounded-full bg-primary-container/30 text-primary border-4 border-white shadow-lg flex items-center justify-center text-[48px] font-display font-medium">
                                {profileInfo.name.substring(0, 2).toUpperCase()}
                            </div>
                            <button className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-white border border-outline/30 shadow-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all active:scale-95">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </button>
                        </div>

                        <h2 className="text-[24px] font-display font-medium text-on-surface mb-1">{profileInfo.name}</h2>
                        <div className="text-[14px] font-ui text-on-surface-variant mb-6 uppercase tracking-widest font-bold">{profileInfo.role}</div>

                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-pill bg-success-container/30 text-success text-[12px] font-bold font-ui border border-success/10">
                            <div className="w-2 h-2 rounded-full bg-success"></div>
                            ACTIVE STATUS
                        </div>

                        <div className="mt-10 w-full pt-8 border-t border-outline/10 space-y-4">
                            <div className="flex items-center gap-3 text-on-surface-variant">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span className="text-[14px] font-ui">{profileInfo.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-on-surface-variant">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="text-[14px] font-ui">Member since {profileInfo.joinDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Detailed Info & Settings */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* Identity Section */}
                    <div className="google-card border-outline/30 bg-white shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center px-8 py-6 border-b border-outline/10 bg-surface-variant/5">
                            <div>
                                <h3 className="text-[18px] font-display font-medium text-on-surface">Identity Details</h3>
                                <p className="text-[13px] text-on-surface-variant font-ui">Basic information used across MaintenOps.</p>
                            </div>
                            <Button variant="outline" className="h-10 text-[13px] border-outline/30 font-bold">
                                Update Data
                            </Button>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                                {[
                                    { label: 'Display Name', value: profileInfo.name },
                                    { label: 'Work Email', value: profileInfo.email, isEmail: true },
                                    { label: 'Emergency Contact', value: profileInfo.phone },
                                    { label: 'Assigned Department', value: profileInfo.department },
                                    { label: 'Access Level', value: profileInfo.role },
                                    { label: 'Primary Site', value: 'Main Campus' }
                                ].map((item, idx) => (
                                    <div key={idx} className="group">
                                        <div className="text-[12px] font-ui font-bold text-on-surface-variant uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{item.label}</div>
                                        <div className={`text-[15px] font-display font-medium text-on-surface ${item.isEmail ? 'text-primary' : ''}`}>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preferences & Security */}
                    <div className="google-card border-outline/30 bg-white shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-outline/10 bg-surface-variant/5">
                            <h3 className="text-[18px] font-display font-medium text-on-surface">Security & Control</h3>
                            <p className="text-[13px] text-on-surface-variant font-ui">Manage your authentication and platform experience.</p>
                        </div>
                        <div className="divide-y divide-outline/5">
                            {[
                                { title: 'Password & Authentication', desc: 'Secure your account with two-step verification.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                                { title: 'Communication Stream', desc: 'Set your preferred triggers for dashboard alerts.', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
                                { title: 'Interface Language', desc: 'Current: English (India)', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
                            ].map((item, idx) => (
                                <a key={idx} href="#" className="flex items-center justify-between px-8 py-6 hover:bg-surface-variant/10 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 rounded-xl bg-surface-variant/40 text-on-surface-variant flex items-center justify-center group-hover:bg-primary-container/30 group-hover:text-primary transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                                        </div>
                                        <div>
                                            <div className="text-[15px] font-display font-medium text-on-surface mb-0.5 group-hover:text-primary transition-colors">{item.title}</div>
                                            <div className="text-[13px] font-ui text-on-surface-variant">{item.desc}</div>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-outline/40 group-hover:text-primary transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
