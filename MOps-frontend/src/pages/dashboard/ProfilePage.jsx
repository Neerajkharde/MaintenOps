import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';

const ProfilePage = () => {
    const { user } = useAuth();

    const profileInfo = {
        name: user?.name || user?.username || 'User',
        email: user?.email || '',
        phone: user?.mobileNumber || '',
        // Map possible backend keys into Assigned Department
        department: user?.organizationDepartmentName || user?.orgDeptName || user?.department || 'Not set',
        role: user?.role === 'REQUESTER' ? 'Standard User' : (user?.role || 'REQUESTER'),
        joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
        location: user?.location || ''
    };

    return (
        <div className="relative pb-24 px-6 sm:px-8 mt-4 max-w-[1400px] mx-auto animate-fadeUp">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-[28px] sm:text-[32px] font-display font-medium text-on-surface tracking-tight mb-1">My Profile</h1>
                <p className="text-[14px] sm:text-[15px] font-ui text-on-surface-variant">Basic details for your MaintenOps account.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: ID Summary */}
                <div className="lg:col-span-4">
                    <div className="google-card p-8 sm:p-10 flex flex-col items-center border-t-8 border-primary bg-white shadow-sm">
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

                        <div className="mt-8 w-full pt-6 border-t border-outline/10 space-y-4">
                            <div className="flex items-center gap-3 text-on-surface-variant">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span className="text-[14px] font-ui">{profileInfo.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-on-surface-variant">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="text-[14px] font-ui">{profileInfo.joinDate !== '—' ? `Member since ${profileInfo.joinDate}` : 'Join date not available'}</span>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
                                {[
                                    { label: 'Display Name', value: profileInfo.name },
                                    { label: 'Work Email', value: profileInfo.email || 'Not set', isEmail: !!profileInfo.email },
                                    { label: 'Contact Number', value: profileInfo.phone || 'Not set' },
                                    { label: 'Assigned Department', value: profileInfo.department }
                                ].map((item, idx) => (
                                    <div key={idx} className="group">
                                        <div className="text-[12px] font-ui font-bold text-on-surface-variant uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{item.label}</div>
                                        <div className={`text-[15px] font-display font-medium text-on-surface ${item.isEmail ? 'text-primary' : ''}`}>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Extra security / preferences sections removed to keep profile simple for requester */}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
