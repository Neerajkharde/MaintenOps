import React, { useState, useEffect, useCallback } from 'react';
import { requestService } from '../../services/requestService';
import AdminReviewModal from '../../components/requests/AdminReviewModal';
import { useNavigate } from 'react-router-dom';

/**
 * Admin Dashboard — clean card-based layout.
 * Groups requests into clear sections with one-click actions.
 */

const STATUS_CONFIG = {
    REQUEST_CREATED: { label: 'New Request', color: '#1a73e8', bg: '#e8f0fe', action: 'Review', icon: '📋' },
    APPROVED: { label: 'Approved', color: '#137333', bg: '#e6f4ea', action: 'Generate Lists', icon: '✅' },
    VENDOR_LIST_APPROVED: { label: 'Procurement', color: '#1565c0', bg: '#e3f2fd', action: 'Mark Procured', icon: '🛒' },
    ITEMS_READY: { label: 'Items Ready', color: '#9334ea', bg: '#f3e8fd', action: 'Start Production', icon: '📦' },
    IN_PRODUCTION: { label: 'In Production', color: '#e65100', bg: '#fff3e0', action: 'Complete', icon: '🏭' },
    PAYMENT_PENDING: { label: 'Payment Due', color: '#c62828', bg: '#fce4ec', action: 'Confirm Payment', icon: '💰' },
    QUOTATION_ADDED: { label: 'With Super Admin', color: '#f9ab00', bg: '#fef7e0', icon: '⏳' },
    QUOTATION_APPROVED: { label: 'With Requester', color: '#f9ab00', bg: '#fef7e0', icon: '⏳' },
    PENDING_SA_APPROVAL: { label: 'Lists with SA', color: '#f9ab00', bg: '#fef7e0', icon: '⏳' },
    COMPLETED: { label: 'Completed', color: '#137333', bg: '#e6f4ea', icon: '🎉' },
};

const ACTIONABLE = ['REQUEST_CREATED', 'APPROVED', 'VENDOR_LIST_APPROVED', 'ITEMS_READY', 'IN_PRODUCTION', 'PAYMENT_PENDING'];
const WAITING = ['QUOTATION_ADDED', 'QUOTATION_APPROVED', 'PENDING_SA_APPROVAL'];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [allRequests, setAllRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [p, h] = await Promise.allSettled([
            requestService.getPendingAdminRequests(),
            requestService.getAdminRequestHistory(),
        ]);
        const map = new Map();
        [...(p.status === 'fulfilled' ? p.value || [] : []), ...(h.status === 'fulfilled' ? h.value || [] : [])]
            .forEach(r => { if (!map.has(r.id)) map.set(r.id, r); });
        setAllRequests(Array.from(map.values()));
        setLoading(false);
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const actionable = allRequests.filter(r => ACTIONABLE.includes(r.status));
    const waiting = allRequests.filter(r => WAITING.includes(r.status));
    const completed = allRequests.filter(r => r.status === 'COMPLETED');

    const handleAction = async (action, reqId) => {
        setActionLoading(reqId);
        try {
            switch (action) {
                case 'generate-lists': await requestService.generateLists(reqId); break;
                case 'start-production': await requestService.startProduction(reqId); break;
                case 'complete-production': await requestService.completeProduction(reqId); break;
                case 'confirm-payment': await requestService.confirmPayment(reqId); break;
                default: break;
            }
            fetchData();
        } catch (e) { alert(e.message); }
        setActionLoading(null);
    };

    const getActionHandler = (req) => {
        const s = req.status;
        if (s === 'REQUEST_CREATED') return () => {
            if (req.estimatedDays) { setSelectedRequest(req); setShowReviewModal(true); }
            else navigate(`/admin/create-quotation/${req.id}`);
        };
        if (s === 'APPROVED') return () => handleAction('generate-lists', req.id);
        if (s === 'VENDOR_LIST_APPROVED') return () => navigate('/admin/queue');
        if (s === 'ITEMS_READY') return () => handleAction('start-production', req.id);
        if (s === 'IN_PRODUCTION') return () => handleAction('complete-production', req.id);
        if (s === 'PAYMENT_PENDING') return () => handleAction('confirm-payment', req.id);
        return null;
    };

    const getActionLabel = (req) => {
        const s = req.status;
        if (s === 'REQUEST_CREATED') return req.estimatedDays ? 'Finalize' : 'Draft Quote';
        return STATUS_CONFIG[s]?.action || 'View';
    };

    return (
        <>
            <div className="p-6 sm:p-8 max-w-[1400px] mx-auto animate-fadeUp pb-24">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-6 border-b border-on-surface/5">
                    <div>
                        <h1 className="text-[32px] font-display font-black text-on-surface tracking-tighter leading-tight uppercase">Hare Krishna</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-5 py-3 rounded-2xl bg-surface-variant/40 border border-white/50 shadow-sm flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-[12px] font-black text-on-surface-variant uppercase tracking-widest">Active Ops</span>
                        </div>
                        <button onClick={fetchData} className="w-12 h-12 rounded-2xl bg-white border border-outline/20 flex items-center justify-center hover:bg-surface-variant hover:scale-105 active:scale-95 transition-all shadow-sm" title="Refresh Context">
                            <svg className={`w-5 h-5 text-on-surface-variant ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Needs Action', value: actionable.length, color: '#1a73e8', bg: 'bg-primary/5', urgent: actionable.some(r => r.urgencyRequested) },
                        { label: 'External Sync', value: waiting.length, color: '#f9ab00', bg: 'bg-warning/5' },
                        { label: 'Completed', value: completed.length, color: '#137333', bg: 'bg-success/5' },
                        { label: 'Total Active', value: allRequests.filter(r => r.status !== 'COMPLETED').length, color: '#5f6368', bg: 'bg-surface-variant/40' },
                    ].map((s, i) => (
                        <div key={i} className="vanguard-card p-6 border-white/30 flex flex-col justify-between min-h-[140px]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: s.color }}>{s.label}</div>
                                {s.urgent && <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shadow-[0_0_10px_rgba(239,68,68,0.5)]" />}
                            </div>
                            <div className="text-[40px] font-display font-black leading-none tracking-tight" style={{ color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="animate-fadeUp">
                        {/* Stats Skeleton */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="vanguard-card p-6 min-h-[140px] flex flex-col justify-between">
                                    <div className="w-16 h-3 animate-skeleton rounded-pill mb-4 opacity-40"></div>
                                    <div className="w-20 h-10 animate-skeleton rounded-2xl"></div>
                                </div>
                            ))}
                        </div>
                        {/* Cards Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="vanguard-card p-7 min-h-[380px] flex flex-col justify-between">
                                    <div className="w-1/2 h-6 animate-skeleton rounded-xl mb-4"></div>
                                    <div className="w-full h-12 animate-skeleton rounded-xl mb-8"></div>
                                    <div className="space-y-4">
                                        <div className="w-full h-3 animate-skeleton rounded-pill"></div>
                                        <div className="w-3/4 h-3 animate-skeleton rounded-pill"></div>
                                    </div>
                                    <div className="w-full h-12 animate-skeleton rounded-2xl mt-8"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* === NEEDS YOUR ACTION === */}
                        {actionable.length > 0 && (
                            <section className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-[#1a73e8]"></div>
                                    <h2 className="text-[17px] font-display font-semibold text-on-surface">Needs Your Action</h2>
                                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8]">{actionable.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {actionable.map(req => {
                                        const cfg = STATUS_CONFIG[req.status];
                                        const handler = getActionHandler(req);
                                        const isActing = actionLoading === req.id;
                                        const isUrgent = req.urgencyRequested;

                                        // Calc days pending (simplified)
                                        const created = new Date(req.createdAt || Date.now());
                                        const diff = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
                                        const daysLabel = diff === 0 ? 'Today' : `${diff}d ago`;

                                        return (
                                            <div key={req.id} className={`vanguard-card group relative p-6 border-white/40 transition-all duration-500 flex flex-col justify-between min-h-[340px] ${isUrgent ? 'ring-2 ring-red-500/20 shadow-2xl shadow-red-500/5' : ''}`}>
                                                {isUrgent && <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-red-500 animate-ping shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>}

                                                <div>
                                                    <div className="flex items-center justify-between mb-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px] shadow-inner bg-on-surface/5">
                                                                {cfg.icon}
                                                            </div>
                                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-pill border border-white/50" style={{ background: cfg.bg, color: cfg.color }}>
                                                                {cfg.label}
                                                            </span>
                                                        </div>
                                                        <span className="text-[12px] font-black text-on-surface-variant/30 uppercase tracking-widest">#{req.requestNumber}</span>
                                                    </div>

                                                    <h3 className="text-[21px] font-display font-black text-on-surface line-clamp-2 mb-6 leading-tight group-hover:text-primary transition-colors tracking-tight italic">{req.itemDescription}</h3>

                                                    <div className="grid grid-cols-2 gap-2 mb-5">
                                                        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-surface-variant/30 rounded-xl">
                                                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                                                                {(req.requesterName || 'U').charAt(0)}
                                                            </div>
                                                            <span className="text-[12px] font-medium text-on-surface truncate">{req.requesterName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-surface-variant/30 rounded-xl">
                                                            <svg className="w-3.5 h-3.5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            <span className="text-[12px] font-bold text-on-surface-variant">{daysLabel}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-outline/10">
                                                        <div className="text-[14px] font-black text-[#137333]">
                                                            {req.totalEstimatedCost ? `₹${Number(req.totalEstimatedCost).toLocaleString('en-IN')}` : 'Estimating...'}
                                                        </div>
                                                        <button
                                                            onClick={handler}
                                                            disabled={isActing}
                                                            className="px-6 py-2 rounded-xl text-[13px] font-black text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg"
                                                            style={{ background: isUrgent ? '#ef4444' : cfg.color }}
                                                        >
                                                            {isActing ? '...' : getActionLabel(req)}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* === WAITING ON OTHERS === */}
                        {waiting.length > 0 && (
                            <section className="mb-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-[#f9ab00]"></div>
                                    <h2 className="text-[17px] font-display font-semibold text-on-surface">Waiting on Others</h2>
                                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#fef7e0] text-[#f9ab00]">{waiting.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                                    {waiting.map(req => {
                                        const cfg = STATUS_CONFIG[req.status];
                                        return (
                                            <div key={req.id} className="vanguard-card bg-white/70 p-4 opacity-75 hover:opacity-100 transition-opacity min-h-[100px] flex flex-col justify-between">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[12px] font-black text-on-surface-variant/40 uppercase">#{req.requestNumber}</span>
                                                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border border-outline/10" style={{ background: cfg.bg, color: cfg.color }}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <div className="text-[14px] font-display font-black text-on-surface line-clamp-1 italic">{req.itemDescription}</div>
                                                <div className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">{req.requesterName}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* === RECENTLY COMPLETED === */}
                        {completed.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-[#137333]"></div>
                                    <h2 className="text-[17px] font-display font-semibold text-on-surface">Recently Completed</h2>
                                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333]">{completed.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                                    {completed.slice(0, 8).map(req => (
                                        <div key={req.id} className="vanguard-card bg-white/60 p-4 opacity-60 hover:opacity-95 transition-opacity min-h-[100px] flex flex-col justify-between">
                                            <div className="text-[12px] font-black text-on-surface-variant/40 mb-1 uppercase tracking-widest">#{req.requestNumber}</div>
                                            <div className="text-[14px] font-display font-black text-on-surface line-clamp-1 italic">{req.itemDescription}</div>
                                            <div className="text-[12px] font-bold text-on-surface-variant mt-1 uppercase tracking-wider">{req.requesterName}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Empty state */}
                        {actionable.length === 0 && waiting.length === 0 && completed.length === 0 && (
                            <div className="text-center py-20 bg-surface-variant/20 rounded-2xl border border-dashed border-outline/20">
                                <div className="text-5xl mb-4 opacity-30">✨</div>
                                <div className="text-[17px] font-display font-medium text-on-surface mb-1">All clear</div>
                                <p className="text-[14px] text-on-surface-variant">No active requests. Enjoy the calm!</p>
                            </div>
                        )}
                    </>
                )}

            </div>

            {/* Admin Review Modal */}
            {showReviewModal && selectedRequest && (
                <AdminReviewModal
                    isOpen={showReviewModal}
                    onClose={() => { setShowReviewModal(false); setSelectedRequest(null); }}
                    request={selectedRequest}
                    onSuccess={() => { setShowReviewModal(false); setSelectedRequest(null); fetchData(); }}
                />
            )}
        </>
    );
};

export default AdminDashboard;
