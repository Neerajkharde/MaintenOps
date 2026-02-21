import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
    const { user } = useAuth();

    // Provide some robust placeholders when full API user data isn't available
    const profileInfo = {
        name: user?.name || 'Hitesh K',
        email: user?.email || 'hitesh.k@example.com',
        phone: '+91 98765 43210',
        department: 'Operations',
        role: user?.role === 'REQUESTER' ? 'Requester' : user?.role,
        joinDate: 'March 15, 2024',
        location: 'ISKCON NVCC, Pune, Building B'
    };

    return (
        <div className="relative pb-24 px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl mx-auto animate-fadeUp">
            <div className="mb-6">
                <h1 className="text-[28px] text-[#202124] mb-1 font-['Google_Sans_Display',sans-serif]">My Profile</h1>
                <p className="text-[14px] text-[#5f6368] font-['Roboto',sans-serif]">View and manage your account details and settings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - ID Card Profile */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-8 flex flex-col items-center border-t-4 border-[#1a73e8]">
                        <div className="relative mb-6 group">
                            <div className="w-28 h-28 rounded-full bg-[#e8f0fe] text-[#1a73e8] border-[3px] border-white shadow-md flex items-center justify-center text-[40px] font-['Google_Sans',sans-serif] font-medium">
                                {profileInfo.name.substring(0, 2).toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-[#dadce0] shadow-sm flex items-center justify-center text-[#5f6368] hover:text-[#1a73e8] transition-colors group-hover:bg-[#f8f9fa]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                        </div>

                        <h2 className="text-[20px] font-['Google_Sans',sans-serif] font-medium text-[#202124] mb-1">{profileInfo.name}</h2>
                        <div className="text-[14px] font-['Roboto',sans-serif] text-[#5f6368] mb-4">{profileInfo.role}</div>

                        <div className="inline-flex px-3 py-[4px] rounded-[50px] bg-[#e6f4ea] text-[#137333] border border-[#137333] text-[12px] font-medium tracking-wide">
                            ACTIVE
                        </div>
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-5 border-b border-[#dadce0]">
                            <h3 className="text-[16px] font-['Google_Sans',sans-serif] font-medium text-[#202124]">Personal Information</h3>
                            <button className="px-4 py-[6px] rounded-[50px] border border-[#dadce0] text-[13px] font-['Google_Sans',sans-serif] text-[#1a73e8] hover:bg-[#f8f9fa] transition-colors flex items-center gap-1.5 font-medium">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Edit Profile
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Full Name</div>
                                    <div className="text-[15px] font-['Google_Sans',sans-serif] text-[#202124]">{profileInfo.name}</div>
                                </div>
                                <div>
                                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Email Address</div>
                                    <div className="text-[15px] font-['Google_Sans',sans-serif] text-[#202124]">{profileInfo.email}</div>
                                </div>
                                <div>
                                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Phone Number</div>
                                    <div className="text-[15px] font-['Google_Sans',sans-serif] text-[#202124]">{profileInfo.phone}</div>
                                </div>
                                <div>
                                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Department</div>
                                    <div className="text-[15px] font-['Google_Sans',sans-serif] text-[#202124]">{profileInfo.department}</div>
                                </div>
                                <div>
                                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Role</div>
                                    <div className="text-[15px] font-['Google_Sans',sans-serif] text-[#202124]">{profileInfo.role}</div>
                                </div>
                                <div>
                                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Location</div>
                                    <div className="text-[15px] font-['Google_Sans',sans-serif] text-[#202124]">{profileInfo.location}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden mt-6">
                        <div className="px-6 py-5 border-b border-[#dadce0]">
                            <h3 className="text-[16px] font-['Google_Sans',sans-serif] font-medium text-[#202124]">Account Settings</h3>
                        </div>
                        <div className="p-2">
                            <a href="#" className="flex items-center justify-between px-6 py-4 hover:bg-[#f8f9fa] transition-colors border-b border-[#f1f3f4] last:border-0 block">
                                <div>
                                    <div className="text-[15px] font-['Google_Sans',sans-serif] text-[#202124] mb-0.5">Password & Security</div>
                                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368]">Manage your password and 2-step verification</div>
                                </div>
                                <svg className="w-5 h-5 text-[#9aa0a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </a>
                            <a href="#" className="flex items-center justify-between px-6 py-4 hover:bg-[#f8f9fa] transition-colors border-b border-[#f1f3f4] last:border-0 block">
                                <div>
                                    <div className="text-[15px] font-['Google_Sans',sans-serif] text-[#202124] mb-0.5">Notifications</div>
                                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368]">Configure email and dashboard alerts</div>
                                </div>
                                <svg className="w-5 h-5 text-[#9aa0a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </a>
                            <a href="#" className="flex items-center justify-between px-6 py-4 hover:bg-[#f8f9fa] transition-colors border-b border-[#f1f3f4] last:border-0 block">
                                <div>
                                    <div className="text-[15px] font-['Google_Sans',sans-serif] text-[#202124] mb-0.5">Language & Region</div>
                                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368]">English (US)</div>
                                </div>
                                <svg className="w-5 h-5 text-[#9aa0a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
