import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

    const navItems = {
        'REQUESTER': [
            { label: 'Dashboard', path: '/dashboard', icon: <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 00.707-1.707l-9-9a.999.999 0 00-1.414 0l-9 9A1 1 0 003 13zm7 7v-5h4v5h-4zm2-15.586l7 7V20h-1v-7a1 1 0 00-1-1H7a1 1 0 00-1 1v7H5v-7.586l7-7.414z" /> },
            { label: 'My Requests', path: '/dashboard/requests', icon: <><path d="M19 4H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V6h14l.002 14H5z" /><path d="M7 9h10v2H7zm0 4h10v2H7z" /></> },
            { label: 'Profile', path: '/dashboard/profile', icon: <><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" /><path d="M12 6c-1.93 0-3.5 1.57-3.5 3.5S10.07 13 12 13s3.5-1.57 3.5-3.5S13.93 6 12 6zm0 12c-2.384 0-4.469-1.258-5.636-3.144a.994.994 0 01.127-1.251c1.189-1.127 2.924-1.605 5.509-1.605s4.32.478 5.509 1.605a.994.994 0 01.127 1.251C16.469 16.742 14.384 18 12 18z" /></> },
        ],
        'ADMIN': [
            { label: 'Admin Dashboard', path: '/admin', icon: <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 00.707-1.707l-9-9a.999.999 0 00-1.414 0l-9 9A1 1 0 003 13zm7 7v-5h4v5h-4z" /> },
            { label: 'Action Queue', path: '/admin/queue', icon: <path d="M20 6h-3V4c0-1.103-.897-2-2-2H9c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2zM9 4h6v2H9V4zm11 15H4V8h3v2h2V8h6v2h2V8h3v11z" /> },
            { label: 'Vendors', path: '/admin/vendors', icon: <><path d="M19 4H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V6h14l.002 14H5z" /><circle cx="8" cy="11" r="2" /><circle cx="16" cy="11" r="2" /><path d="M12 18c-2.757 0-5-2.243-5-5h2c0 1.654 1.346 3 3 3s3-1.346 3-3h2c0 2.757-2.243 5-5 5z" /></> },
            { label: 'Inventory', path: '/admin/inventory', icon: <path d="M10 3H4a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1zm-1 6H5V5h4v4zm11-6h-6a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1zm-1 6h-4V5h4v4zm-7 3H4a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-6a1 1 0 00-1-1zm-1 6H5v-4h4v4zm11-6h-6a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-6a1 1 0 00-1-1zm-1 6h-4v-4h4v4z" /> },
        ],
        'SUPER_ADMIN': [
            { label: 'System Overview', path: '/super-admin', icon: <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 00.707-1.707l-9-9a.999.999 0 00-1.414 0l-9 9A1 1 0 003 13zm7 7v-5h4v5h-4z" /> },
            { label: 'Approval Queue', path: '/super-admin/approvals', icon: <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.903 15.607l-4.524-4.524L7.003 11.66l3.148 3.148 6.845-6.845 1.414 1.414-8.259 8.259-.051-.029z" /> },
            { label: 'System Admins', path: '/super-admin/admins', icon: <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z" /> },
            { label: 'Vendor Lists', path: '/super-admin/vendor-lists', icon: <><path d="M19 4H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V6h14l.002 14H5z" /><path d="M7 9h10v2H7zm0 4h7v2H7z" /></> },
        ]
    };

    const links = navItems[role] && navItems[role].length > 0 ? navItems[role] : navItems['REQUESTER'];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r border-outline hidden md:flex md:flex-col z-50">
            {/* Logo Section */}
            <div className="h-[64px] flex items-center px-6">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-[20px] font-display font-medium tracking-tight text-on-surface">
                        MaintenOps
                    </span>
                </Link>
            </div>

            {/* Navigation Rail */}
            <div className="py-6 flex-grow flex flex-col overflow-y-auto custom-scrollbar">
                <div className="px-3 space-y-1">
                    {links.map((link, index) => {
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={index}
                                to={link.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-pill transition-all duration-200 group
                                    ${active
                                        ? 'bg-primary-container text-primary'
                                        : 'text-on-surface-variant hover:bg-surface-variant'
                                    }`}
                            >
                                <svg
                                    className={`w-5 h-5 transition-colors ${active ? 'fill-primary' : 'fill-on-surface-variant group-hover:fill-on-surface'}`}
                                    viewBox="0 0 24 24"
                                >
                                    {link.icon}
                                </svg>
                                <span className={`text-[14px] font-ui ${active ? 'font-medium' : 'font-normal'}`}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Footer or Info */}
            <div className="p-4 border-t border-outline">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[12px] font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-on-surface truncate">{user?.name}</div>
                        <div className="text-[11px] text-on-surface-variant truncate uppercase tracking-wider">{role}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
