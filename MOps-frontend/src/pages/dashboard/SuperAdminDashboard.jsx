import React from 'react';
import EscalationAlerts from '../../components/dashboard/superadmin/EscalationAlerts';
import SystemOverview from '../../components/dashboard/superadmin/SystemOverview';
import ApprovalQueue from '../../components/dashboard/superadmin/ApprovalQueue';
import AdminPerformance from '../../components/dashboard/superadmin/AdminPerformance';
import Button from '../../components/Button';

const SuperAdminDashboard = () => {
    return (
        <div className="flex flex-col gap-8 pb-32 px-6 sm:px-8 mt-4 max-w-[1600px] mx-auto animate-fadeUp">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-[32px] font-display font-medium text-on-surface tracking-tight mb-2">Systems Oversight</h1>
                    <p className="text-[15px] text-on-surface-variant font-ui">
                        Global state monitor for maintenance operations and financial compliance.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-error-container/20 px-4 py-2 rounded-xl border border-error/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></div>
                    <span className="text-[12px] font-bold font-ui text-error uppercase tracking-wider">1 Critical Escalation</span>
                </div>
            </div>

            {/* Critical Intervention Layer */}
            <div className="animate-fadeUp" style={{ animationDelay: '100ms' }}>
                <EscalationAlerts />
            </div>

            {/* Strategic KPI Stream */}
            <div className="animate-fadeUp" style={{ animationDelay: '200ms' }}>
                <SystemOverview />
            </div>

            {/* Primary Operations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeUp" style={{ animationDelay: '300ms' }}>
                {/* Approval Control Center */}
                <div className="lg:col-span-8 google-card border-outline/30 bg-white p-8">
                    <ApprovalQueue />
                </div>

                {/* Performance Analytics */}
                <div className="lg:col-span-4 google-card border-outline/30 bg-white p-8">
                    <AdminPerformance />
                </div>
            </div>

            {/* Analytics Deep-Dive Placeholders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2 animate-fadeUp" style={{ animationDelay: '400ms' }}>
                <div className="google-card border-outline/30 bg-white p-8 h-[240px] flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-surface-variant rounded-full flex items-center justify-center text-on-surface-variant/40 mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <h4 className="text-[16px] font-display font-medium text-on-surface mb-1">Departmental Volume</h4>
                    <p className="text-[13px] text-on-surface-variant font-ui">Aggregated request density by functional unit.</p>
                </div>
                <div className="google-card border-outline/30 bg-white p-8 h-[240px] flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-surface-variant rounded-full flex items-center justify-center text-on-surface-variant/40 mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h4 className="text-[16px] font-display font-medium text-on-surface mb-1">Fiscal Analysis</h4>
                    <p className="text-[13px] text-on-surface-variant font-ui">Vendor expenditure and budget utilization tracking.</p>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
