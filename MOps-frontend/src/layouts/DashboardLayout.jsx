import React from 'react';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#f1f3f4] font-['Roboto',sans-serif]">
            <Sidebar role={user?.role} />
            <div className="md:pl-[240px] flex flex-col min-h-screen transition-all duration-300">
                <Topbar />
                {/* Main Content Area */}
                <main className="pt-[64px] flex-grow">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
