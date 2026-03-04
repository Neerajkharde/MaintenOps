import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { getRoleDisplayName, getDashboardRoute } from '../utils/roleUtils';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
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
            <nav className="fixed top-0 left-0 right-0 glass-panel z-50 h-[64px]">
                <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-[22px] font-normal font-google-sans text-[#5f6368] tracking-tight group-hover:text-[#1a73e8] transition-colors">
                            Mainten<span className="font-bold text-[#1a73e8]">Ops</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <Link
                                    to={getDashboardRoute(user.role)}
                                    className="text-[14px] font-medium text-[#5f6368] font-google-sans hover:text-[#1a73e8] transition-colors"
                                >
                                    Dashboard
                                </Link>

                                {/* User Profile Dropdown */}
                                <div className="relative flex items-center pl-4 border-l border-[#dadce0]" ref={dropdownRef}>
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
                                            <Link
                                                to="/dashboard/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] transition-colors flex items-center gap-3 text-[14px] font-['Google_Sans',sans-serif] text-[#202124]"
                                            >
                                                <svg className="w-5 h-5 text-[#5f6368]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                My Profile
                                            </Link>
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
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className="h-10 px-6 rounded-full border-[1.5px] border-[#dadce0] text-[#5f6368] font-google-sans text-[14px] font-medium hover:text-[#202124] hover:bg-[#f1f3f4] transition-all duration-200">
                                        Log in
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="h-10 px-6 rounded-full bg-[#1a73e8] text-white font-google-sans text-[14px] font-medium shadow-google-1 hover:shadow-google-2 hover:bg-[#1557b0] transition-all duration-200 scale-100 active:scale-95">
                                        Sign up
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button - Simplified */}
                    <button className="md:hidden text-[#5f6368] p-2 hover:bg-[#f1f3f4] rounded-full transition-colors" onClick={() => setIsOpen(!isOpen)}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="absolute top-[64px] left-0 right-0 bg-white border-b border-[#dadce0] p-4 md:hidden flex flex-col gap-3 shadow-google-2">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-4 py-2">
                                    <div className="text-right flex-1">
                                        <div className="text-[14px] font-medium text-[#202124] font-google-sans">{user.name || user.username || 'User'}</div>
                                        <div className="text-[12px] text-[#5f6368]">{getRoleDisplayName(user.role)}</div>
                                    </div>
                                    <button onClick={handleLogout} className="h-9 w-9 rounded-full bg-[#d93025] text-white flex items-center justify-center font-bold text-[14px] hover:bg-[#b3261e]">
                                        {(user.name || user.username || 'U')?.charAt(0).toUpperCase()}
                                    </button>
                                </div>
                                <Link to={getDashboardRoute(user.role)} onClick={() => setIsOpen(false)}>
                                    <button className="w-full h-10 rounded-full bg-[#f1f3f4] text-[#1a73e8] font-medium font-google-sans">Dashboard</button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <button className="w-full h-10 rounded-full border-[1.5px] border-[#dadce0] text-[#5f6368] font-medium font-google-sans hover:bg-[#f1f3f4] hover:text-[#202124]">Log in</button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsOpen(false)}>
                                    <button className="w-full h-10 rounded-full bg-[#1a73e8] text-white font-medium font-google-sans hover:bg-[#1557b0]">Sign up</button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Logout Confirmation Modal */}
            {
                showLogoutConfirm && (
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
                )
            }
        </>
    );
};

export default Navbar;
