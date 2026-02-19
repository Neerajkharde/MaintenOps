import React from 'react';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#f8fafe] font-sans">
            <Topbar />
            <Sidebar role={user?.role} />

            {/* Main Content Area */}
            <main className="pt-[64px] md:pl-[240px] min-h-screen transition-all duration-300">
                <div className="max-w-[1440px] mx-auto p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
