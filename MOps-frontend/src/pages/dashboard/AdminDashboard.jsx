import React from 'react';
import ActionQueue from '../../components/dashboard/admin/ActionQueue';
import VendorList from '../../components/dashboard/admin/VendorList';
import InventoryStatus from '../../components/dashboard/admin/InventoryStatus';
import ActiveRequests from '../../components/dashboard/admin/ActiveRequests';
import TimelineCompliance from '../../components/dashboard/admin/TimelineCompliance';

const AdminDashboard = () => {
    return (
        <div className="flex flex-col gap-6 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-[28px] font-display text-[#202124] mb-1">Overview</h1>
                <p className="text-[14px] text-[#5f6368]">Welcome back, Facility Manager. You have 12 pending tasks.</p>
            </div>

            {/* Top Row: Hero and Side Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <ActionQueue />
                </div>
                <div className="lg:col-span-4">
                    <TimelineCompliance />
                </div>
            </div>

            {/* Middle Row: Vendor & Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                    <VendorList />
                </div>
                <div className="lg:col-span-4">
                    <InventoryStatus />
                </div>
                <div className="lg:col-span-4 bg-white rounded-[16px] border border-[#dadce0] p-6 flex flex-col items-center justify-center text-center shadow-sm">
                    {/* Placeholder for 'Recent Activity' or another widget */}
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-[16px] font-medium">Quick Actions</h3>
                    <div className="flex gap-2 mt-4">
                        <button className="px-3 py-2 bg-[#1a73e8] text-white rounded-[8px] text-[13px] font-medium">Add Vendor</button>
                        <button className="px-3 py-2 bg-white border border-[#dadce0] text-[#5f6368] rounded-[8px] text-[13px] font-medium hover:bg-[#f1f3f4]">Updates</button>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Active Requests Table */}
            <div className="grid grid-cols-1">
                <ActiveRequests />
            </div>
        </div>
    );
};

export default AdminDashboard;
