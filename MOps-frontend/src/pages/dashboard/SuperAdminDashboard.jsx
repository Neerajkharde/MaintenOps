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
        try {
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
        } catch (e) {
            console.error("Error fetching data:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

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
        <>
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

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Strategic Ops', value: actionable.length, color: '#1a73e8', icon: '⚡' },
                        { label: 'Active Ops', value: inProgress.length, color: '#e65100', icon: '🏭' },
                        { label: 'Archived', value: completed.length, color: '#137333', icon: '✅' },
                        { label: 'Total Network', value: allRequests.length, color: '#5f6368', icon: '🌐' },
                    ].map((s, i) => (
                        <div key={i} className="vanguard-card p-6 border-white/30 flex flex-col justify-between min-h-[140px]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: s.color }}>{s.label}</div>
                                <div className="text-[18px] opacity-40">{s.icon}</div>
                            </div>
                            <div className="text-[40px] font-display font-black leading-none tracking-tighter" style={{ color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Contextual Logic */}
                {loading ? (
                    <div className="animate-fadeUp">
                        {/* Stats Skeleton */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="vanguard-card p-6 min-h-[140px] flex flex-col justify-between">
                                    <div className="w-16 h-3 animate-skeleton rounded-pill mb-4 opacity-40"></div>
                                    <div className="w-24 h-10 animate-skeleton rounded-2xl"></div>
                                </div>
                            ))}
                        </div>
                        {/* Queue Skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {[1, 2].map(i => (
                                <div key={i} className="vanguard-card p-10 min-h-[440px] flex flex-col justify-between">
                                    <div className="w-full h-8 animate-skeleton rounded-2xl mb-8"></div>
                                    <div className="space-y-4">
                                        <div className="w-3/4 h-3 animate-skeleton rounded-pill"></div>
                                        <div className="w-1/2 h-3 animate-skeleton rounded-pill"></div>
                                    </div>
                                    <div className="w-full h-14 animate-skeleton rounded-2xl mt-8"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {actionable.length > 0 && (
                            <section className="mb-12">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-6 sm:mb-8 pb-4 border-b border-outline/10">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-2.5 sm:w-3 h-8 sm:h-10 bg-primary rounded-full shadow-[0_0_20px_rgba(26,115,232,0.4)]"></div>
                                        <div>
                                            <h2 className="text-[18px] sm:text-[22px] font-display font-black text-on-surface uppercase tracking-tight leading-none mb-1">Approval Queue</h2>
                                            <p className="text-[10px] sm:text-[13px] text-on-surface-variant/60 font-bold uppercase tracking-[0.1em]">Authority Oversight Hub</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-3">
                                        <div className="px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-surface-variant/30 border border-outline/10 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span className="text-[9px] sm:text-[11px] font-black text-on-surface-variant/60 uppercase tracking-widest leading-none">High Exposure</span>
                                            <span className="text-[15px] sm:text-[18px] font-black text-primary leading-none">
                                                ₹{actionable.reduce((acc, curr) => acc + (Number(curr.totalEstimatedCost) || 0), 0).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        <div className="px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-primary text-white flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 shadow-lg shadow-primary/20">
                                            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest leading-none opacity-80">Needs Review</span>
                                            <span className="text-[15px] sm:text-[18px] font-black leading-none">{actionable.length}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {actionable.map(req => {
                                        const cfg = STATUS_CONFIG[req.status];
                                        const isActing = actionLoading === req.id;
                                        const isQuotation = req.status === 'QUOTATION_ADDED';

                                        // Priority Heatmap Logic
                                        const highValue = Number(req.totalEstimatedCost) >= 15000;
                                        const daysOld = req.createdAt ? Math.floor((new Date() - new Date(req.createdAt)) / (1000 * 60 * 60 * 24)) : 0;
                                        const isUrgent = highValue || daysOld >= 2;

                                        return (
                                            <div key={req.id} className={`vanguard-card group relative p-8 border-white/50 transition-all duration-500 flex flex-col justify-between min-h-[420px] ${isUrgent ? 'ring-2 ring-red-500/20 shadow-2xl shadow-red-500/5' : ''}`}>
                                                {isUrgent && <div className="absolute top-8 right-8 w-4 h-4 rounded-full bg-red-500 animate-ping shadow-[0_0_20px_rgba(239,68,68,0.6)]"></div>}

                                                <div className="h-2.5 w-full absolute top-0 left-0" style={{ background: cfg.color }}></div>

                                                {isUrgent && (highValue || daysOld >= 2) && (
                                                    <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
                                                        <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-md">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                                                            <span className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-[0.2em]">{highValue ? 'High Value' : 'Aged'}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="p-6 sm:p-10 flex flex-col h-full justify-between">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-4 sm:mb-5">
                                                            <div className="flex items-center gap-2 sm:gap-3">
                                                                <span className="text-[9px] sm:text-[10px] font-black px-2.5 sm:px-3 py-1 rounded-pill uppercase tracking-widest" style={{ background: cfg.bg, color: cfg.color }}>
                                                                    {cfg.label}
                                                                </span>
                                                                {req.urgency === 'URGENT' && (
                                                                    <span className="text-[9px] sm:text-[10px] font-black px-2.5 sm:px-3 py-1 bg-red-50 text-red-600 rounded-pill uppercase tracking-widest border border-red-100">Urgent</span>
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] sm:text-[11px] font-black text-on-surface-variant/30 tracking-[0.1em]">#{req.requestNumber}</span>
                                                        </div>

                                                        <h3 className="text-[18px] sm:text-[22px] font-display font-black text-on-surface line-clamp-2 mb-6 sm:mb-8 leading-tight group-hover:text-primary transition-colors">{req.itemDescription}</h3>

                                                        <div className="space-y-4 mb-8">
                                                            <div className="flex items-center justify-between text-[12px]">
                                                                <div className="flex items-center gap-4 text-on-surface-variant">
                                                                    <div className="w-8 h-8 rounded-2xl bg-primary text-white flex items-center justify-center text-[12px] font-black shadow-lg shadow-primary/20">
                                                                        {(req.requesterName || 'U').charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[11px] text-on-surface-variant/40 font-black uppercase tracking-widest leading-none mb-1">Requested By</div>
                                                                        <span className="font-bold text-[14px] leading-none">{req.requesterName}</span>
                                                                    </div>
                                                                </div>
                                                                <span className="px-3 py-1.5 rounded-xl bg-surface-variant/50 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] border border-outline/5">{req.serviceDepartmentName}</span>
                                                            </div>
                                                            {req.totalEstimatedCost && (
                                                                <div className="flex items-center justify-between pt-3 border-t border-outline/5">
                                                                    <span className="text-[12px] text-on-surface-variant/60 font-bold uppercase tracking-widest">Investment Value</span>
                                                                    <span className="text-[20px] font-black text-[#137333]">₹{Number(req.totalEstimatedCost).toLocaleString('en-IN')}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                                            {isQuotation ? (
                                                                <button
                                                                    onClick={() => { setSelectedRequest(req); setShowReviewModal(true); }}
                                                                    className="flex-1 py-4 sm:py-5 rounded-[16px] sm:rounded-[20px] text-[14px] sm:text-[15px] font-black text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl sm:shadow-2xl shadow-primary/25 border-t border-white/20"
                                                                    style={{
                                                                        background: `linear-gradient(135deg, ${cfg.color} 0%, #1a73e8 100%)`,
                                                                    }}
                                                                >
                                                                    {cfg.action}
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleApproveVendorLists(req.id)}
                                                                    disabled={isActing}
                                                                    className="flex-1 py-4 sm:py-5 rounded-[16px] sm:rounded-[20px] text-[14px] sm:text-[15px] font-black text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl sm:shadow-2xl shadow-primary/25 border-t border-white/20"
                                                                    style={{
                                                                        background: `linear-gradient(135deg, ${cfg.color} 0%, #1a73e8 100%)`,
                                                                    }}
                                                                >
                                                                    {isActing ? 'Wait...' : cfg.action}
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => { setDetailRequest(req); setIsDetailOpen(true); }}
                                                                className="py-4 sm:py-5 px-6 rounded-[16px] sm:rounded-[20px] text-[13px] font-bold text-on-surface-variant border border-outline/20 bg-white hover:bg-surface-variant transition-all sm:hover:scale-110 shadow-sm flex items-center justify-center"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {inProgress.length > 0 && (
                            <section className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-[#e65100]"></div>
                                    <h2 className="text-[17px] font-display font-semibold text-on-surface">In Progress</h2>
                                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#fff3e0] text-[#e65100]">{inProgress.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {inProgress.map(req => {
                                        const cfg = STATUS_CONFIG[req.status] || { label: req.status, color: '#5e6c84', bg: '#f1f3f4', icon: '📎' };
                                        return (
                                            <div
                                                key={req.id}
                                                className="bg-white rounded-xl border border-outline/25 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer min-h-[140px] flex flex-col justify-between"
                                                onClick={() => { setDetailRequest(req); setIsDetailOpen(true); }}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider opacity-60">#{req.requestNumber}</span>
                                                    <span className="text-[12px] font-bold px-3 py-1 rounded-full shadow-sm" style={{ background: cfg.bg, color: cfg.color }}>
                                                        {cfg.icon} {cfg.label}
                                                    </span>
                                                </div>
                                                <div className="text-[16px] font-display font-bold text-on-surface line-clamp-1 mb-2">{req.itemDescription}</div>
                                                <div className="flex items-center gap-3 text-[13px] text-on-surface-variant">
                                                    <span className="font-medium">{req.requesterName}</span>
                                                    {req.totalEstimatedCost && (
                                                        <span className="font-black text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-lg">₹{Number(req.totalEstimatedCost).toLocaleString('en-IN')}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

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
                                            className="bg-white/70 rounded-2xl border border-outline/20 p-6 opacity-70 hover:opacity-100 transition-all cursor-pointer min-h-[120px] flex flex-col justify-between"
                                            onClick={() => { setDetailRequest(req); setIsDetailOpen(true); }}
                                        >
                                            <div>
                                                <div className="text-[11px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest opacity-60">#{req.requestNumber}</div>
                                                <div className="text-[15px] font-bold text-on-surface line-clamp-1">{req.itemDescription}</div>
                                            </div>
                                            <div className="text-[12px] text-on-surface-variant font-medium">{req.requesterName}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {allRequests.length === 0 && (
                            <div className="text-center py-20 bg-surface-variant/20 rounded-2xl border border-dashed border-outline/20">
                                <div className="text-5xl mb-4 opacity-30">✨</div>
                                <div className="text-[17px] font-display font-medium text-on-surface mb-1">All clear</div>
                                <p className="text-[14px] text-on-surface-variant">No requests in the system.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals moved outside animating div */}
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
        </>
    );
};

export default SuperAdminDashboard;
