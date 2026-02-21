import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getRoleDisplayName } from '../../utils/roleUtils';

const Topbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <header className="fixed top-0 right-0 left-0 md:left-[240px] h-[64px] bg-white border-b border-[#dadce0] z-40 flex items-center justify-between px-8">
                <div className="flex items-center">
                    <h1 className="text-[22px] font-['Google_Sans_Display',sans-serif] text-[#202124] tracking-tight">
                        Dashboard
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notification Bell */}
                    <button className="relative w-10 h-10 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center transition-colors text-[#5f6368]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-2 right-2 w-[18px] h-[18px] bg-[#c5221f] rounded-full border-2 border-white text-white text-[9px] font-bold flex items-center justify-center">
                            3
                        </span>
                    </button>

                    {/* User Profile */}
                    <div className="relative flex items-center" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-10 h-10 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-[14px] shadow-sm hover:ring-2 hover:ring-[#e8f0fe] transition-all"
                            title="Profile"
                        >
                            {user?.name?.substring(0, 2)?.toUpperCase() || 'HK'}
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute top-[52px] right-0 w-[240px] bg-white rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#dadce0] py-2 animate-fadeUp origin-top-right">
                                <div className="px-4 py-3 border-b border-[#dadce0] mb-2">
                                    <div className="text-[14px] font-['Google_Sans',sans-serif] font-medium text-[#202124]">
                                        {user?.name || 'Hitesh Kumar'}
                                    </div>
                                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] truncate">
                                        {user?.email || 'hitesh.kumar@example.com'}
                                    </div>
                                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-[50px] bg-[#e8f0fe] text-[#1a73e8] text-[11px] font-medium tracking-wide">
                                        {getRoleDisplayName(user?.role) || 'REQUESTER'}
                                    </div>
                                </div>
                                <button className="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] transition-colors flex items-center gap-3 text-[14px] font-['Google_Sans',sans-serif] text-[#202124]">
                                    <svg className="w-5 h-5 text-[#5f6368]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    My Profile
                                </button>
                                <button
                                    onClick={() => { setDropdownOpen(false); setShowLogoutConfirm(true); }}
                                    className="w-full text-left px-4 py-2 hover:bg-[#fce8e6] transition-colors flex items-center gap-3 text-[14px] font-['Google_Sans',sans-serif] text-[#c5221f]"
                                >
                                    <svg className="w-5 h-5 text-[#c5221f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[100] flex items-center justify-center p-4 animate-fadeUp">
                    <div className="bg-white rounded-[16px] w-full max-w-[400px] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.15)]">
                        <h3 className="text-[20px] font-['Google_Sans_Display',sans-serif] text-[#202124] mb-2">Sign out</h3>
                        <p className="text-[14px] font-['Roboto',sans-serif] text-[#5f6368] mb-6">
                            Are you sure you want to sign out of MaintenanceOps?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-5 py-2 font-['Google_Sans',sans-serif] text-[14px] font-medium text-[#5f6368] hover:bg-[#f1f3f4] rounded-[50px] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 rounded-[50px] bg-[#c5221f] text-white font-['Google_Sans',sans-serif] text-[14px] font-medium shadow-md hover:bg-[#a50e0e] transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Topbar;
