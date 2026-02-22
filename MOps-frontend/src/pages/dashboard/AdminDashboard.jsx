import React from 'react';
import ActionQueue from '../../components/dashboard/admin/ActionQueue';
import VendorList from '../../components/dashboard/admin/VendorList';
import InventoryStatus from '../../components/dashboard/admin/InventoryStatus';
import ActiveRequests from '../../components/dashboard/admin/ActiveRequests';
import TimelineCompliance from '../../components/dashboard/admin/TimelineCompliance';
import Button from '../../components/Button';

const AdminDashboard = () => {
    return (
        <div className="flex flex-col gap-8 pb-32 px-6 sm:px-8 mt-4 max-w-[1600px] mx-auto animate-fadeUp">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-[32px] font-display font-medium text-on-surface tracking-tight mb-2">Operational Insights</h1>
                    <p className="text-[15px] text-on-surface-variant font-ui">Central command for facility maintenance and resource allocation.</p>
                </div>
                <div className="flex items-center gap-3 bg-surface-variant/40 p-1.5 rounded-pill border border-outline/20">
                    <div className="w-2.5 h-2.5 rounded-full bg-success ml-2 animate-pulse"></div>
                    <span className="text-[12px] font-bold font-ui text-primary uppercase tracking-wider mr-2">System Live</span>
                </div>
            </div>

            {/* Top Critical Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-8 h-full">
                    <ActionQueue />
                </div>
                <div className="lg:col-span-4 h-full">
                    <TimelineCompliance />
                </div>
            </div>

            {/* Middle Resource Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <VendorList />
                </div>
                <div className="lg:col-span-4">
                    <InventoryStatus />
                </div>
                <div className="lg:col-span-4 google-card border-outline/30 bg-white p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-primary-container/30 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-[18px] font-display font-medium text-on-surface mb-2">Manager Shortcuts</h3>
                    <p className="text-[13px] text-on-surface-variant font-ui mb-8 max-w-[200px]">Accelerate frequent administrative operations.</p>
                    <div className="flex flex-col w-full gap-3">
                        <Button variant="primary" className="w-full h-11">Register Vendor</Button>
                        <Button variant="ghost" className="w-full h-11 border border-outline/20">System Logs</Button>
                    </div>
                </div>
            </div>

            {/* Full Width Visibility Row */}
            <div className="grid grid-cols-1">
                <ActiveRequests />
            </div>
        </div>
    );
};

export default AdminDashboard;
