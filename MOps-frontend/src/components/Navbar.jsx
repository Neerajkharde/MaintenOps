import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { getRoleDisplayName, getDashboardRoute } from '../utils/roleUtils';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (

        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-[12px] border-b border-[#dadce0] z-50 h-[64px]">
            <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="text-[22px] font-normal font-google-sans text-[#5f6368] tracking-tight group-hover:text-[#1a73e8] transition-colors">
                        Maintenance<span className="font-bold text-[#1a73e8]">Ops</span>
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
                            <div className="flex items-center gap-3 pl-4 border-l border-[#dadce0]">
                                <div className="text-right">
                                    <div className="text-[14px] font-medium text-[#202124] font-google-sans leading-tight">
                                        {user.name || user.username || 'User'}
                                    </div>
                                    <div className="text-[12px] text-[#5f6368]">
                                        {getRoleDisplayName(user.role)}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="h-9 w-9 rounded-full bg-[#d93025] text-white flex items-center justify-center font-bold text-[14px] hover:bg-[#b3261e] hover:ring-2 hover:ring-[#fce8e6] transition-all"
                                    title="Logout"
                                >
                                    {(user.name || user.username || 'U')?.charAt(0).toUpperCase()}
                                </button>
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
    );
};

export default Navbar;
