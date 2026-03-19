import React from 'react';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen bg-white font-['Roboto',sans-serif]">
            <Sidebar
                role={user?.role}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />
            <div className={`md:pl-[240px] flex flex-col min-h-screen transition-all duration-300`}>
                <Topbar onMenuClick={toggleSidebar} />
                {/* Main Content Area */}
                <main className="pt-[64px] flex-grow bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
