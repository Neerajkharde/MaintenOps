import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Topbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-[64px] bg-white/95 backdrop-blur-md border-b border-[#dadce0] z-50 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2 group">
                    {/* Logo Icon */}
                    <div className="w-8 h-8 bg-[#1a73e8] rounded-[8px] flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span className="text-[20px] font-normal font-display text-[#5f6368] tracking-tight">
                        Maintenance<span className="font-bold text-[#1a73e8]">Ops</span>
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="relative w-10 h-10 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center transition-colors text-[#5f6368]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-[#dadce0]">
                    <div className="text-right hidden sm:block">
                        <div className="text-[14px] font-medium text-[#202124] font-google-sans leading-tight">
                            {user?.name || 'User'}
                        </div>
                        <div className="text-[12px] text-[#5f6368]">
                            {user?.role || 'Employee'}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-9 h-9 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-[14px] shadow-sm hover:ring-2 hover:ring-[#e8f0fe] transition-all"
                    >
                        {user?.name?.charAt(0) || 'U'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
