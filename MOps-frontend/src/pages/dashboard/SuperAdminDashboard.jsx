import React from 'react';
import EscalationAlerts from '../../components/dashboard/superadmin/EscalationAlerts';
import SystemOverview from '../../components/dashboard/superadmin/SystemOverview';
import ApprovalQueue from '../../components/dashboard/superadmin/ApprovalQueue';
import AdminPerformance from '../../components/dashboard/superadmin/AdminPerformance';

const SuperAdminDashboard = () => {
    return (
        <div className="flex flex-col gap-6 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-[28px] font-display text-[#202124] mb-1">System Overview</h1>
                <p className="text-[14px] text-[#5f6368]">Welcome back, Overseer. System status is nominal with <span className="text-[#d93025] font-bold">1 critical alert</span>.</p>
            </div>

            {/* Critical Alerts */}
            <EscalationAlerts />

            {/* High Level Stats */}
            <SystemOverview />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Approval Queue */}
                <div className="lg:col-span-8 bg-white rounded-[16px] shadow-google-1 border border-[#dadce0]/50 p-6">
                    <ApprovalQueue />
                </div>

                {/* Admin Performance */}
                <div className="lg:col-span-4 bg-white rounded-[16px] shadow-google-1 border border-[#dadce0]/50 p-6">
                    <AdminPerformance />
                </div>
            </div>

            {/* Additional Metrics Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                <div className="bg-white rounded-[16px] shadow-google-1 border border-[#dadce0]/50 p-6 h-[200px] flex items-center justify-center text-[#9aa0a6] text-[14px]">
                    Department Request Volume Chart Placeholder
                </div>
                <div className="bg-white rounded-[16px] shadow-google-1 border border-[#dadce0]/50 p-6 h-[200px] flex items-center justify-center text-[#9aa0a6] text-[14px]">
                    Vendor Spend Analysis Placeholder
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
