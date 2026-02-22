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
            <header className="fixed top-0 right-0 left-0 md:left-[240px] h-[64px] bg-white border-b border-outline z-40 flex items-center justify-between px-8">
                <div className="flex items-center">
                    <h1 className="text-[20px] font-display text-on-surface tracking-tight">
                        Dashboard
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    {/* Search Bar Placeholder (Google Style) */}
                    <div className="hidden lg:flex items-center bg-surface-variant px-4 py-2 rounded-md border border-transparent focus-within:bg-white focus-within:border-primary focus-within:shadow-sm transition-all mr-4 w-[300px]">
                        <svg className="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" placeholder="Search requests..." className="bg-transparent border-none outline-none px-3 text-[14px] w-full" />
                    </div>

                    {/* Notification Bell */}
                    <button className="relative w-10 h-10 rounded-full hover:bg-surface-variant flex items-center justify-center transition-all text-on-surface-variant">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
                    </button>

                    {/* User Profile */}
                    <div className="relative pl-2" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center transition-all shadow-sm"
                        >
                            <span className="text-white text-[14px] font-medium font-ui">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute top-[52px] right-0 w-[240px] bg-white rounded-md shadow-md border border-outline py-2 animate-fadeUp origin-top-right">
                                <div className="px-4 py-3 border-b border-outline mb-2 text-center">
                                    <div className="w-12 h-12 rounded-full bg-primary mx-auto mb-2 flex items-center justify-center text-white text-[18px] font-bold">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <div className="text-[15px] font-ui font-medium text-on-surface">
                                        {user?.name}
                                    </div>
                                    <div className="text-[12px] text-on-surface-variant truncate mb-2">
                                        {user?.email}
                                    </div>
                                    <div className="inline-flex items-center px-3 py-0.5 rounded-pill bg-primary-container text-primary text-[11px] font-medium tracking-wide uppercase">
                                        {getRoleDisplayName(user?.role)}
                                    </div>
                                </div>
                                <Link
                                    to="/dashboard/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="w-full text-left px-4 py-2 hover:bg-surface-variant transition-colors flex items-center gap-3 text-[14px] font-ui text-on-surface"
                                >
                                    <svg className="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    Manage Account
                                </Link>
                                <button
                                    onClick={() => { setDropdownOpen(false); setShowLogoutConfirm(true); }}
                                    className="w-full text-left px-4 py-2 hover:bg-error-container transition-colors flex items-center gap-3 text-[14px] font-ui text-error"
                                >
                                    <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
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
                    <div className="bg-white rounded-xl w-full max-w-[400px] p-8 shadow-lg">
                        <h3 className="text-[20px] font-display text-on-surface mb-3">Sign out</h3>
                        <p className="text-[14px] text-on-surface-variant mb-8 leading-relaxed">
                            Are you sure you want to sign out of MaintenOps? You'll need to log in again to manage your requests.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-5 py-2 font-ui text-[14px] font-medium text-on-surface-variant hover:bg-surface-variant rounded-pill transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 rounded-pill bg-error text-white font-ui text-[14px] font-medium shadow-sm hover:shadow-md transition-all"
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
