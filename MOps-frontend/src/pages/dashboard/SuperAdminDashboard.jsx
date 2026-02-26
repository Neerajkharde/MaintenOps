import React, { useState, useEffect, useCallback } from 'react';
import { requestService } from '../../services/requestService';
import SuperAdminReviewModal from '../../components/requests/SuperAdminReviewModal';
import SARequestDetailModal from '../../components/requests/SARequestDetailModal';

/**
 * Super Admin Dashboard — clean card-based layout.
 * Two action sections + passive tracking.
 */

const STATUS_CONFIG = {
    QUOTATION_ADDED: { label: 'Quotation Review', color: '#f9ab00', bg: '#fef7e0', icon: '📝', action: 'Review & Approve' },
    PENDING_SA_APPROVAL: { label: 'Vendor Lists', color: '#1565c0', bg: '#e3f2fd', icon: '📋', action: 'Approve Lists' },
    QUOTATION_APPROVED: { label: 'With Requester', color: '#5e6c84', bg: '#f1f3f4', icon: '⏳' },
    APPROVED: { label: 'Approved', color: '#137333', bg: '#e6f4ea', icon: '✅' },
    VENDOR_LIST_APPROVED: { label: 'Procurement', color: '#1565c0', bg: '#e3f2fd', icon: '🛒' },
    ITEMS_READY: { label: 'Items Ready', color: '#9334ea', bg: '#f3e8fd', icon: '📦' },
    IN_PRODUCTION: { label: 'Production', color: '#e65100', bg: '#fff3e0', icon: '🏭' },
    PAYMENT_PENDING: { label: 'Payment', color: '#c62828', bg: '#fce4ec', icon: '💰' },
    COMPLETED: { label: 'Completed', color: '#137333', bg: '#e6f4ea', icon: '🎉' },
    REQUEST_CREATED: { label: 'New', color: '#1a73e8', bg: '#e8f0fe', icon: '📋' },
};

const SuperAdminDashboard = () => {
    const [allRequests, setAllRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [detailRequest, setDetailRequest] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [pRes, hRes, lRes] = await Promise.allSettled([
            requestService.getPendingSuperAdminRequests(),
            requestService.getSuperAdminRequestHistory(),
            requestService.getPendingListApproval(),
        ]);
        const map = new Map();
        [...(pRes.status === 'fulfilled' ? pRes.value || [] : []),
        ...(hRes.status === 'fulfilled' ? hRes.value || [] : []),
        ...(lRes.status === 'fulfilled' ? lRes.value || [] : [])]
            .forEach(r => { if (!map.has(r.id)) map.set(r.id, r); });
        setAllRequests(Array.from(map.values()));
        setLoading(false);
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Categorize
    const quotationReview = allRequests.filter(r => r.status === 'QUOTATION_ADDED');
    const listsApproval = allRequests.filter(r => r.status === 'PENDING_SA_APPROVAL');
    const inProgress = allRequests.filter(r => ['QUOTATION_APPROVED', 'APPROVED', 'VENDOR_LIST_APPROVED', 'ITEMS_READY', 'IN_PRODUCTION', 'PAYMENT_PENDING', 'REQUEST_CREATED'].includes(r.status));
    const completed = allRequests.filter(r => r.status === 'COMPLETED');

    const actionable = [...quotationReview, ...listsApproval];

    const handleApproveVendorLists = async (reqId) => {
        setActionLoading(reqId);
        try {
            await requestService.approveVendorLists(reqId);
            fetchData();
        } catch (e) { alert(e.message); }
        setActionLoading(null);
    };

    return (
        <div className="p-6 sm:p-8 max-w-[1400px] mx-auto animate-fadeUp pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[28px] font-display font-bold text-on-surface tracking-tight">Dashboard</h1>
                    <p className="text-[14px] text-on-surface-variant font-ui mt-1">Oversight & approvals</p>
                </div>
                <button onClick={fetchData} className="w-9 h-9 rounded-xl border border-outline/30 flex items-center justify-center hover:bg-surface-variant transition-colors" title="Refresh">
                    <svg className={`w-4 h-4 text-on-surface-variant ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Needs Action', value: actionable.length, color: '#1a73e8', bg: '#e8f0fe' },
                    { label: 'In Progress', value: inProgress.length, color: '#e65100', bg: '#fff3e0' },
                    { label: 'Completed', value: completed.length, color: '#137333', bg: '#e6f4ea' },
                    { label: 'All Requests', value: allRequests.length, color: '#5f6368', bg: '#f1f3f4' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-outline/20 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: s.color }}>{s.label}</div>
                        <span className="text-[32px] font-bold leading-none" style={{ color: s.color }}>{s.value}</span>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* === NEEDS YOUR ACTION === */}
                    {actionable.length > 0 && (
                        <section className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-[#1a73e8]"></div>
                                <h2 className="text-[17px] font-display font-semibold text-on-surface">Needs Your Approval</h2>
                                <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8]">{actionable.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {actionable.map(req => {
                                    const cfg = STATUS_CONFIG[req.status];
                                    const isActing = actionLoading === req.id;
                                    const isQuotation = req.status === 'QUOTATION_ADDED';
                                    return (
                                        <div key={req.id} className="bg-white rounded-2xl border border-outline/20 shadow-sm hover:shadow-md transition-all overflow-hidden">
                                            <div className="h-1" style={{ background: cfg.color }}></div>
                                            <div className="p-5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[14px]">{cfg.icon}</span>
                                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                                                            {cfg.label}
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] font-bold text-on-surface-variant">#{req.requestNumber}</span>
                                                </div>

                                                <h3 className="text-[15px] font-medium text-on-surface line-clamp-2 mb-3 leading-snug">{req.itemDescription}</h3>

                                                <div className="flex items-center gap-3 text-[12px] text-on-surface-variant mb-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-5 h-5 rounded-full bg-surface-variant flex items-center justify-center text-[9px] font-bold">
                                                            {(req.requesterName || 'U').charAt(0)}
                                                        </div>
                                                        <span className="truncate max-w-[100px]">{req.requesterName}</span>
                                                    </div>
                                                    <span className="px-1.5 py-0.5 rounded bg-surface-variant text-[10px] font-medium">{req.serviceDepartmentName}</span>
                                                    {req.totalEstimatedCost && (
                                                        <span className="font-bold text-[#137333]">₹{Number(req.totalEstimatedCost).toLocaleString('en-IN')}</span>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    {isQuotation ? (
                                                        <button
                                                            onClick={() => { setSelectedRequest(req); setShowReviewModal(true); }}
                                                            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90"
                                                            style={{ background: cfg.color }}
                                                        >
                                                            {cfg.action}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleApproveVendorLists(req.id)}
                                                            disabled={isActing}
                                                            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                                                            style={{ background: cfg.color }}
                                                        >
                                                            {isActing ? 'Approving...' : cfg.action}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => { setDetailRequest(req); setIsDetailOpen(true); }}
                                                        className="px-3 py-2.5 rounded-xl text-[13px] font-medium text-on-surface-variant border border-outline/20 hover:bg-surface-variant transition-colors"
                                                    >
                                                        Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* === IN PROGRESS === */}
                    {inProgress.length > 0 && (
                        <section className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-[#e65100]"></div>
                                <h2 className="text-[17px] font-display font-semibold text-on-surface">In Progress</h2>
                                <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#fff3e0] text-[#e65100]">{inProgress.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                                {inProgress.map(req => {
                                    const cfg = STATUS_CONFIG[req.status] || { label: req.status, color: '#5e6c84', bg: '#f1f3f4', icon: '📎' };
                                    return (
                                        <div
                                            key={req.id}
                                            className="bg-white/80 rounded-xl border border-outline/15 p-4 hover:shadow-sm transition-all cursor-pointer"
                                            onClick={() => { setDetailRequest(req); setIsDetailOpen(true); }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[11px] font-bold text-on-surface-variant">#{req.requestNumber}</span>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                                                    {cfg.icon} {cfg.label}
                                                </span>
                                            </div>
                                            <div className="text-[13px] font-medium text-on-surface line-clamp-1 mb-1">{req.itemDescription}</div>
                                            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                                                <span>{req.requesterName}</span>
                                                {req.totalEstimatedCost && (
                                                    <span className="font-bold text-[#137333]">₹{Number(req.totalEstimatedCost).toLocaleString('en-IN')}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* === COMPLETED === */}
                    {completed.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-[#137333]"></div>
                                <h2 className="text-[17px] font-display font-semibold text-on-surface">Recently Completed</h2>
                                <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333]">{completed.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                                {completed.slice(0, 8).map(req => (
                                    <div
                                        key={req.id}
                                        className="bg-white/60 rounded-xl border border-outline/10 p-4 opacity-60 hover:opacity-90 transition-opacity cursor-pointer"
                                        onClick={() => { setDetailRequest(req); setIsDetailOpen(true); }}
                                    >
                                        <div className="text-[11px] font-bold text-on-surface-variant mb-1">#{req.requestNumber}</div>
                                        <div className="text-[13px] font-medium text-on-surface line-clamp-1">{req.itemDescription}</div>
                                        <div className="text-[11px] text-on-surface-variant mt-1">{req.requesterName}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty state */}
                    {allRequests.length === 0 && (
                        <div className="text-center py-20 bg-surface-variant/20 rounded-2xl border border-dashed border-outline/20">
                            <div className="text-5xl mb-4 opacity-30">✨</div>
                            <div className="text-[17px] font-display font-medium text-on-surface mb-1">All clear</div>
                            <p className="text-[14px] text-on-surface-variant">No requests in the system.</p>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            {showReviewModal && selectedRequest && (
                <SuperAdminReviewModal
                    isOpen={showReviewModal}
                    onClose={() => { setShowReviewModal(false); setSelectedRequest(null); }}
                    onSuccess={() => { setShowReviewModal(false); setSelectedRequest(null); fetchData(); }}
                    request={selectedRequest}
                />
            )}
            <SARequestDetailModal
                isOpen={isDetailOpen}
                onClose={() => { setIsDetailOpen(false); setDetailRequest(null); }}
                request={detailRequest}
            />
        </div>
    );
};

export default SuperAdminDashboard;
