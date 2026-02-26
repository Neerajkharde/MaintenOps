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
        <div className="p-6 sm:p-8 max-w-[1400px] mx-auto animate-fadeUp pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[28px] font-display font-bold text-on-surface tracking-tight">Dashboard</h1>
                    <p className="text-[14px] text-on-surface-variant font-ui mt-1">Your workspace at a glance</p>
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
                    { label: 'Needs Action', value: actionable.length, color: '#1a73e8', bg: '#e8f0fe', urgent: actionable.some(r => r.urgencyRequested) },
                    { label: 'Waiting on Others', value: waiting.length, color: '#f9ab00', bg: '#fef7e0' },
                    { label: 'Completed', value: completed.length, color: '#137333', bg: '#e6f4ea' },
                    { label: 'Total Active', value: allRequests.filter(r => r.status !== 'COMPLETED').length, color: '#5f6368', bg: '#f1f3f4' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-outline/20 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: s.color }}>{s.label}</div>
                        <div className="flex items-end gap-2">
                            <span className="text-[32px] font-bold leading-none" style={{ color: s.color }}>{s.value}</span>
                            {s.urgent && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse mb-1.5" title="Has urgent items" />}
                        </div>
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
                                <h2 className="text-[17px] font-display font-semibold text-on-surface">Needs Your Action</h2>
                                <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8]">{actionable.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {actionable.map(req => {
                                    const cfg = STATUS_CONFIG[req.status];
                                    const handler = getActionHandler(req);
                                    const isActing = actionLoading === req.id;
                                    return (
                                        <div key={req.id} className="bg-white rounded-2xl border border-outline/20 shadow-sm hover:shadow-md transition-all overflow-hidden">
                                            {/* Color top accent */}
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

                                                {req.urgencyRequested && (
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 mb-3">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                        Urgent
                                                    </div>
                                                )}

                                                <button
                                                    onClick={handler}
                                                    disabled={isActing}
                                                    className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                                                    style={{ background: cfg.color }}
                                                >
                                                    {isActing ? 'Processing...' : getActionLabel(req)}
                                                </button>
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
                                        <div key={req.id} className="bg-white/70 rounded-xl border border-outline/15 p-4 opacity-75 hover:opacity-100 transition-opacity">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[11px] font-bold text-on-surface-variant">#{req.requestNumber}</span>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <div className="text-[13px] font-medium text-on-surface line-clamp-1 mb-1">{req.itemDescription}</div>
                                            <div className="text-[11px] text-on-surface-variant">{req.requesterName}</div>
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
                                    <div key={req.id} className="bg-white/60 rounded-xl border border-outline/10 p-4 opacity-60 hover:opacity-90 transition-opacity">
                                        <div className="text-[11px] font-bold text-on-surface-variant mb-1">#{req.requestNumber}</div>
                                        <div className="text-[13px] font-medium text-on-surface line-clamp-1">{req.itemDescription}</div>
                                        <div className="text-[11px] text-on-surface-variant mt-1">{req.requesterName}</div>
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

            {/* Admin Review Modal */}
            {showReviewModal && selectedRequest && (
                <AdminReviewModal
                    isOpen={showReviewModal}
                    onClose={() => { setShowReviewModal(false); setSelectedRequest(null); }}
                    request={selectedRequest}
                    onSuccess={() => { setShowReviewModal(false); setSelectedRequest(null); fetchData(); }}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
