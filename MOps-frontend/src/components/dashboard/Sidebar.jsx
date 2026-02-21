import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

    const navItems = {
        'REQUESTER': [
            { label: 'Dashboard', path: '/dashboard', icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
            { label: 'My Requests', path: '/dashboard/requests', icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
            { label: 'Profile', path: '/dashboard/profile', icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
        ],
        // Adding admins etc if needed, but the prompt says REQUESTER role.
        'ADMIN': [
            { label: 'Admin Dashboard', path: '/admin', icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
            { label: 'Action Queue', path: '/admin/queue', icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
            { label: 'Vendors', path: '/admin/vendors', icon: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
            { label: 'Inventory', path: '/admin/inventory', icon: <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /> },
        ],
        'SUPER_ADMIN': [
            { label: 'System Overview', path: '/super-admin', icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
            { label: 'Approval Queue', path: '/super-admin/approvals', icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
            { label: 'Escalations', path: '/super-admin/escalations', icon: <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> },
            { label: 'System Admins', path: '/super-admin/admins', icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
            { label: 'Settings', path: '/super-admin/settings', icon: <><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></> },
        ]
    };

    const links = navItems[role] && navItems[role].length > 0 ? navItems[role] : navItems['REQUESTER'];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r border-[#dadce0] hidden md:flex md:flex-col z-50">
            {/* Top Logo */}
            <div className="h-[64px] flex items-center px-6 border-b border-transparent">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-[#1a73e8] rounded-[8px] flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span className="text-[20px] font-['Google_Sans_Display',sans-serif] text-[#1a73e8]">
                        MaintenOps
                    </span>
                </Link>
            </div>

            {/* Nav Items */}
            <div className="py-4 flex-grow flex flex-col overflow-y-auto">
                {links.map((link, index) => {
                    const active = isActive(link.path);
                    return (
                        <div key={index} className="pr-4 mb-1">
                            <Link
                                to={link.path}
                                className={`flex items-center gap-3 px-6 py-3 text-[14px] font-['Google_Sans',sans-serif] transition-all duration-200 ${active
                                    ? 'bg-[#e8f0fe] text-[#1a73e8] font-medium border-l-[3px] border-[#1a73e8] rounded-r-[50px]'
                                    : 'text-[#5f6368] hover:bg-[#f1f3f4] border-l-[3px] border-transparent rounded-r-[50px] font-normal'
                                    }`}
                            >
                                <svg className={`w-5 h-5 ${active ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    {link.icon}
                                </svg>
                                {link.label}
                            </Link>
                        </div>
                    );
                })}
            </div>

        </aside>
    );
};

export default Sidebar;
