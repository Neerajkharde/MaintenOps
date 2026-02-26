import React, { useState } from 'react';
import { useRequests } from '../../context/RequestContext';
import RequestDetailsModal from '../../components/requests/RequestDetailsModal';
import Button from '../../components/Button';

const RequestsPage = () => {
    const { requests, refreshRequests } = useRequests();
    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleApprovalSuccess = () => {
        refreshRequests();
        setSelectedRequest(null);
    };

    const getStatusChip = (status) => {
        const styles = {
            'REQUEST_CREATED': 'bg-primary-container text-primary border-primary/20',
            'QUOTATION_ADDED': 'bg-warning-container text-warning border-warning/20',
            'QUOTATION_APPROVED': 'bg-[#e8f5e9] text-[#2e7d32] border-[#2e7d32]/20',
            'APPROVED': 'bg-success-container text-success border-success/20',
            'PENDING_SA_APPROVAL': 'bg-warning-container text-warning border-warning/20',
            'VENDOR_LIST_APPROVED': 'bg-[#e3f2fd] text-[#1565c0] border-[#1565c0]/20',
            'ITEMS_READY': 'bg-[#f3e8fd] text-[#9334ea] border-[#9334ea]/20',
            'IN_PRODUCTION': 'bg-[#fff3e0] text-[#e65100] border-[#e65100]/20',
            'PAYMENT_PENDING': 'bg-[#fce4ec] text-[#c62828] border-[#c62828]/20',
            'COMPLETED': 'bg-success text-white border-transparent',
            'REJECTED': 'bg-error-container text-error border-error/20'
        };
        const style = styles[status] || 'bg-surface-variant text-on-surface-variant border-outline/30';

        return (
            <span className={`inline-flex items-center px-3 py-0.5 rounded-pill border text-[11px] font-medium font-ui tracking-wide uppercase ${style}`}>
                {status.replace(/_/g, ' ')}
            </span>
        );
    };

    const getDeptChip = (dept) => {
        const styles = {
            'Electrical': 'text-error bg-error-container/20 border-error/10',
            'Carpentry': 'text-warning bg-warning-container/20 border-warning/10',
            'Plumbing': 'text-primary bg-primary-container/20 border-primary/10',
            'EM': 'text-success bg-success-container/20 border-success/10'
        };
        const style = styles[dept] || 'text-on-surface-variant bg-surface-variant border-outline/10';

        return (
            <span className={`px-2.5 py-0.5 rounded-md border text-[12px] font-medium font-ui ${style}`}>
                {dept}
            </span>
        );
    };

    return (
        <div className="relative pb-24 px-6 sm:px-8 pt-8 max-w-[1400px] mx-auto animate-fadeUp">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[32px] text-on-surface font-display font-medium tracking-tight mb-2">My Requests</h1>
                    <p className="text-[15px] text-on-surface-variant font-ui">Manage and monitor your facility maintenance service tickets.</p>
                </div>
                <div className="flex gap-3">
                    {/* Add Request Button could go here */}
                </div>
            </div>

            <div className="google-card border-outline/50 overflow-hidden shadow-sm hover:shadow-md">
                <div className="flex justify-between items-center px-6 py-5 border-b border-outline/30 bg-white/50">
                    <h3 className="text-[18px] font-display font-medium text-on-surface">Recent Activity</h3>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-success"></div>
                        <span className="text-[13px] text-on-surface-variant font-ui">Live Updates</span>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0 min-w-[900px]">
                        <thead>
                            <tr className="bg-surface-variant/30">
                                <th className="px-6 py-4 text-[12px] font-bold font-ui text-on-surface-variant uppercase tracking-[1px] border-b border-outline/30">Request ID</th>
                                <th className="px-6 py-4 text-[12px] font-bold font-ui text-on-surface-variant uppercase tracking-[1px] border-b border-outline/30">Category</th>
                                <th className="px-6 py-4 text-[12px] font-bold font-ui text-on-surface-variant uppercase tracking-[1px] border-b border-outline/30">Description</th>
                                <th className="px-6 py-4 text-[12px] font-bold font-ui text-on-surface-variant uppercase tracking-[1px] border-b border-outline/30">Created Date</th>
                                <th className="px-6 py-4 text-[12px] font-bold font-ui text-on-surface-variant uppercase tracking-[1px] border-b border-outline/30">Status</th>
                                <th className="px-6 py-4 text-[12px] font-bold font-ui text-on-surface-variant uppercase tracking-[1px] border-b border-outline/30 text-right">Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline/10">
                            {requests.map((req, i) => (
                                <tr
                                    key={i}
                                    onClick={() => setSelectedRequest(req)}
                                    className="hover:bg-primary-container/10 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-[14px] font-medium font-ui text-primary group-hover:underline">
                                            #{req.requestNumber}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{getDeptChip(req.serviceDepartmentName)}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-[14px] font-body text-on-surface max-w-[280px] truncate" title={req.itemDescription}>
                                            {req.itemDescription}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[14px] font-body text-on-surface-variant">
                                        {req.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusChip(req.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            className="h-8 px-4 text-[13px] opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-40">
                                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="font-ui text-[14px]">No maintenance requests found.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RequestDetailsModal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                request={selectedRequest}
                onSuccess={handleApprovalSuccess}
            />
        </div>
    );
};

export default RequestsPage;
