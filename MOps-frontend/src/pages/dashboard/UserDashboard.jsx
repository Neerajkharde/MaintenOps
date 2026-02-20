import React from 'react';

const UserDashboard = () => {
    return (
        <div className="flex flex-col gap-8 relative pb-20">
            {/* Header Section */}
            <div>
                <h1 className="text-[28px] text-[#202124] mb-1">Dashboard</h1>
                <p className="text-[14px] text-[#5f6368]">Track your requests and view status updates.</p>
            </div>

            {/* TEST: Simple Box to verify rendering */}
            <div className="bg-green-100 p-4 rounded text-green-900 font-bold">
                ✅ USER DASHBOARD IS WORKING!
            </div>

            {/* Simple Test Card */}
            <div className="bg-white p-6 rounded border border-gray-300">
                <h3 className="text-lg font-bold mb-2">Welcome to Your Dashboard</h3>
                <p className="text-gray-600">This is a test to verify the dashboard renders correctly.</p>
            </div>
        </div>
    );
};

export default UserDashboard;
