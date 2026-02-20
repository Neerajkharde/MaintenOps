import React, { useState } from 'react';
import StatusTracker from '../../components/dashboard/user/StatusTracker';
import StatsRow from '../../components/dashboard/user/StatsRow';
import RequestsTable from '../../components/dashboard/user/RequestsTable';
import NewRequestModal from '../../components/NewRequestModal';

const UserDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-8 relative pb-20">
            {/* Header Section */}
            <div>
                <h1 className="text-[28px] font-display text-[#202124] mb-1">Dashboard</h1>
                <p className="text-[14px] text-[#5f6368]">Track your requests and view status updates.</p>
            </div>

            {/* Status Tracker Widget */}
            <div className="bg-white p-6 rounded-[16px] shadow-google-1 border border-[#dadce0]/50">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[16px] font-google-sans text-[#202124]">Current Request Status: <span className="text-[#1a73e8] font-bold">#REQ-2024-001</span></h3>
                    <span className="text-[12px] text-[#5f6368]">Estimated Completion: Oct 28</span>
                </div>
                <StatusTracker currentStage="In Production" />
            </div>

            {/* Stats Row */}
            <StatsRow />

            {/* Requests Table */}
            <RequestsTable />

            {/* FAB */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 bg-[#1a73e8] text-white pl-4 pr-6 py-4 rounded-full shadow-[0_4px_8px_3px_rgba(26,115,232,0.3)] hover:shadow-[0_6px_12px_4px_rgba(26,115,232,0.3)] hover:bg-[#1557b0] transition-all duration-300 flex items-center gap-3 z-50 group"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-google-sans font-medium text-[16px]">New Request</span>
            </button>

            {/* New Request Modal */}
            <NewRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default UserDashboard;
