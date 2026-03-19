import React, { useState, useEffect, useCallback } from 'react';
import { requestService } from '../../../services/requestService';
import AdminReviewModal from '../../../components/requests/AdminReviewModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { get } from '../../../services/api';
import Button from '../../../components/Button';

/**
 * Action Queue — indigo-toned admin ops page.
 * Matches the AdminDashboard's cool command-center aesthetic.
 */
const ADMIN_ACTIONABLE = [
    'REQUEST_CREATED',
    'NEGOTIATION_PENDING',
    'APPROVED',
    'VENDOR_LIST_APPROVED',
    'ITEMS_READY',
    'IN_PRODUCTION',
    'PAYMENT_PENDING',
];

const ActionQueuePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [tab, setTab] = useState('pending');
    const [pendingRequests, setPendingRequests] = useState([]);
    const [completedRequests, setCompletedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [pendingResult, historyResult] = await Promise.allSettled([
            requestService.getPendingAdminRequests(),
            requestService.getAdminRequestHistory(),
        ]);

        const pending = pendingResult.status === 'fulfilled' ? (pendingResult.value || []) : [];
        let history = [];
        if (historyResult.status === 'fulfilled') {
            history = historyResult.value || [];
        }

        const actionableFromHistory = history.filter(r => ADMIN_ACTIONABLE.includes(r.status) && r.status !== 'REQUEST_CREATED');
        const allActionable = [...pending, ...actionableFromHistory];
        const done = history.filter(r => !ADMIN_ACTIONABLE.includes(r.status));

        setPendingRequests(allActionable);
        setCompletedRequests(done);
        setLoading(false);
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const openReviewId = params.get('openReview');
        if (!openReviewId) return;

        get(`/api/request/admin/${openReviewId}`)
            .then(r => r.json())
            .then(req => {
                setSelectedRequest(req);
                setShowReviewModal(true);
                navigate('/admin/queue', { replace: true });
            })
            .catch(console.error);
    }, [location.search, navigate]);

    const handleReviewSuccess = () => {
        setShowReviewModal(false);
        setSelectedRequest(null);
        fetchData();
    };

    const handleGenerateLists = async (reqId) => {
        setActionLoading(reqId);
        try { await requestService.generateLists(reqId); fetchData(); } catch (e) { alert(e.message); }
        setActionLoading(null);
    };

    const handleStartProduction = async (reqId) => {
        setActionLoading(reqId);
        try { await requestService.startProduction(reqId); fetchData(); } catch (e) { alert(e.message); }
        setActionLoading(null);
    };

    const handleCompleteProduction = async (reqId) => {
        setActionLoading(reqId);
        try { await requestService.completeProduction(reqId); fetchData(); } catch (e) { alert(e.message); }
        setActionLoading(null);
    };

    const handleConfirmPayment = async (reqId) => {
        setActionLoading(reqId);
        try { await requestService.confirmPayment(reqId); fetchData(); } catch (e) { alert(e.message); }
        setActionLoading(null);
    };

    const handleMarkItemProcured = async (materialId) => {
        setActionLoading(materialId);
        try { await requestService.markItemProcured(materialId); fetchData(); } catch (e) { alert(e.message); }
        setActionLoading(null);
    };

    /* ================== Status config ================== */
    const statusConfig = {
        REQUEST_CREATED:      { label: 'Submitted',          accent: '#6366f1' },
        QUOTATION_ADDED:      { label: 'Awaiting SA',        accent: '#f59e0b' },
        QUOTATION_APPROVED:   { label: 'Quotation Approved', accent: '#10b981' },
        NEGOTIATION_PENDING:  { label: 'Negotiation Requested', accent: '#f59e0b' },
        APPROVED:             { label: 'User Accepted',      accent: '#10b981' },
        PENDING_SA_APPROVAL:  { label: 'Lists Pending SA',   accent: '#f59e0b' },
        VENDOR_LIST_APPROVED: { label: 'Vendor Approved',    accent: '#3b82f6' },
        ITEMS_READY:          { label: 'Items Ready',        accent: '#8b5cf6' },
        IN_PRODUCTION:        { label: 'In Production',      accent: '#f97316' },
        PAYMENT_PENDING:      { label: 'Payment Pending',    accent: '#ef4444' },
        COMPLETED:            { label: 'Completed',          accent: '#10b981' },
    };

    /* ================== Request Card ================== */
    const RequestCard = ({ req }) => {
        const cfg = statusConfig[req.status] || { label: req.status, accent: '#64748b' };
        const quotationReady = !!req.estimatedDays;
        const isActing = actionLoading === req.id;
        const st = req.status;

        return (
            <div className="relative rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-[#6366f1]/15 overflow-hidden group">
                {/* Left accent */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: cfg.accent }}></div>

                <div className="p-6 pl-7">
                    {/* Top row: status + number + urgent */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[11px] font-ui font-bold text-on-surface-variant/50 tracking-wider uppercase">#{req.requestNumber}</span>
                        <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-ui font-bold uppercase tracking-[0.1em] text-white"
                            style={{ background: cfg.accent }}
                        >
                            {cfg.label}
                        </span>
                        {req.urgencyRequested && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-error/10 text-error text-[10px] font-ui font-bold uppercase tracking-wider border border-error/15 animate-pulse">
                                Critical
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h4 className="text-[17px] font-display font-semibold text-on-surface mb-3 leading-snug line-clamp-2">
                        {req.itemDescription}
                    </h4>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-on-surface-variant/60 mb-5 font-ui">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-[#6366f1]/10 text-[#6366f1] flex items-center justify-center text-[10px] font-bold">
                                {(req.requesterName || 'U').charAt(0)}
                            </div>
                            <span>{req.requesterName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            <span>{req.organizationDepartmentName}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-[#f0f2f8] text-on-surface-variant text-[10px] font-bold tracking-wide border border-[#dde1ed]">
                            {req.serviceDepartmentName}
                        </span>
                    </div>

                    {/* Quotation cost banner */}
                    {req.totalEstimatedCost && (
                        <div className="mb-5 flex items-center justify-between bg-[#6366f1]/5 border border-[#6366f1]/10 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-[#6366f1]"></div>
                                <span className="text-[12px] font-ui font-medium text-on-surface">Quotation Processed</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[15px] font-display font-bold text-[#6366f1]">₹{Number(req.totalEstimatedCost).toLocaleString('en-IN')}</span>
                                <span className="text-[11px] font-ui text-on-surface-variant/60">{req.estimatedDays} Days</span>
                            </div>
                        </div>
                    )}

                    {/* Procurement checklist */}
                    {st === 'VENDOR_LIST_APPROVED' && req.materials && req.materials.length > 0 && (
                        <div className="mb-5 border border-[#6366f1]/10 rounded-lg overflow-hidden">
                            <div className="px-4 py-2.5 bg-[#6366f1]/5 border-b border-[#6366f1]/10 text-[10px] font-ui font-bold text-[#6366f1] uppercase tracking-[0.15em]">
                                Procurement Checklist
                            </div>
                            <div className="divide-y divide-[#eaecf5]">
                                {req.materials.map(m => (
                                    <div key={m.id} className="flex items-center justify-between px-4 py-3">
                                        <div className="flex-1">
                                            <div className="text-[13px] font-display font-medium text-on-surface">{m.materialName}</div>
                                            <div className="text-[11px] font-ui text-on-surface-variant/60">
                                                {m.quantity} {m.unit} · {m.vendorName || 'No vendor'} · ₹{Number(m.totalPrice ?? 0).toFixed(2)}
                                            </div>
                                        </div>
                                        {m.status === 'PROCURED' ? (
                                            <span className="text-[10px] font-ui font-bold text-[#10b981] px-2.5 py-1 bg-[#10b981]/10 rounded-md border border-[#10b981]/15">✓ Procured</span>
                                        ) : (
                                            <button
                                                onClick={() => handleMarkItemProcured(m.id)}
                                                disabled={actionLoading === m.id}
                                                className="px-3 py-1.5 rounded-md text-[11px] font-ui font-bold text-[#6366f1] border border-[#6366f1]/20 bg-[#6366f1]/5 hover:bg-[#6366f1]/10 transition-colors disabled:opacity-40"
                                            >
                                                {actionLoading === m.id ? 'Marking...' : 'Mark Procured'}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Phase-specific action buttons */}
                    <div className="flex gap-3 flex-wrap">
                        {st === 'REQUEST_CREATED' && (
                            <>
                                {!quotationReady ? (
                                    <button
                                        onClick={() => navigate(`/admin/create-quotation/${req.id}`)}
                                        className="px-5 py-2 rounded-lg text-[12px] font-ui font-bold text-white bg-gradient-to-r from-[#6366f1] to-[#818cf8] shadow-sm shadow-[#6366f1]/20 hover:opacity-90 active:scale-[0.97] transition-all"
                                    >
                                        Draft Quotation
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { setSelectedRequest(req); setShowReviewModal(true); }}
                                        className="px-5 py-2 rounded-lg text-[12px] font-ui font-bold text-white bg-gradient-to-r from-[#10b981] to-[#34d399] shadow-sm shadow-[#10b981]/20 hover:opacity-90 active:scale-[0.97] transition-all"
                                    >
                                        Finalize Assessment
                                    </button>
                                )}
                                {quotationReady && (
                                    <button
                                        onClick={() => navigate(`/admin/create-quotation/${req.id}`)}
                                        className="px-4 py-2 rounded-lg text-[12px] font-ui font-bold text-on-surface-variant border border-[#dde1ed] hover:bg-[#f0f2f8] transition-colors"
                                    >
                                        Adjust Costs
                                    </button>
                                )}
                                <button
                                    onClick={() => { setSelectedRequest(req); setShowReviewModal(true); }}
                                    className="px-4 py-2 rounded-lg text-[12px] font-ui font-medium text-on-surface-variant/70 hover:text-on-surface hover:bg-[#f0f2f8] transition-colors"
                                >
                                    Details
                                </button>
                            </>
                        )}

                        {st === 'NEGOTIATION_PENDING' && (
                            <button
                                onClick={() => { setSelectedRequest(req); setShowReviewModal(true); }}
                                className="px-5 py-2 rounded-lg text-[12px] font-ui font-bold text-white bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] shadow-sm shadow-[#f59e0b]/20 hover:opacity-90 active:scale-[0.97] transition-all"
                            >
                                Review Negotiation
                            </button>
                        )}

                        {st === 'APPROVED' && (
                            <button
                                onClick={() => handleGenerateLists(req.id)}
                                disabled={isActing}
                                className="px-5 py-2 rounded-lg text-[12px] font-ui font-bold text-white bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] shadow-sm shadow-[#3b82f6]/20 hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-40"
                            >
                                {isActing ? 'Generating...' : '📋 Generate Lists'}
                            </button>
                        )}

                        {st === 'ITEMS_READY' && (
                            <button
                                onClick={() => handleStartProduction(req.id)}
                                disabled={isActing}
                                className="px-5 py-2 rounded-lg text-[12px] font-ui font-bold text-white bg-gradient-to-r from-[#f97316] to-[#fb923c] shadow-sm shadow-[#f97316]/20 hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-40"
                            >
                                {isActing ? 'Starting...' : '🏭 Start Production'}
                            </button>
                        )}

                        {st === 'IN_PRODUCTION' && (
                            <button
                                onClick={() => handleCompleteProduction(req.id)}
                                disabled={isActing}
                                className="px-5 py-2 rounded-lg text-[12px] font-ui font-bold text-white bg-gradient-to-r from-[#ef4444] to-[#f87171] shadow-sm shadow-[#ef4444]/20 hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-40"
                            >
                                {isActing ? 'Completing...' : '✅ Complete Production'}
                            </button>
                        )}

                        {st === 'PAYMENT_PENDING' && (
                            <button
                                onClick={() => handleConfirmPayment(req.id)}
                                disabled={isActing}
                                className="px-5 py-2 rounded-lg text-[12px] font-ui font-bold text-white bg-gradient-to-r from-[#10b981] to-[#34d399] shadow-sm shadow-[#10b981]/20 hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-40"
                            >
                                {isActing ? 'Confirming...' : '💰 Confirm Payment'}
                            </button>
                        )}
                    </div>

                    {/* Admin audit note */}
                    {!ADMIN_ACTIONABLE.includes(st) && req.adminRemarks && (
                        <div className="mt-5 bg-[#f0f2f8] rounded-lg p-4 border border-[#dde1ed]">
                            <div className="text-[10px] text-on-surface-variant/50 mb-1.5 font-ui font-bold uppercase tracking-[0.15em]">Admin Audit Note</div>
                            <p className="text-[13px] text-on-surface leading-relaxed">{req.adminRemarks}</p>
                            {req.adminReviewedAt && (
                                <div className="text-[11px] text-on-surface-variant/50 mt-2 font-ui">
                                    Processed on {new Date(req.adminReviewedAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const activeList = tab === 'pending' ? pendingRequests : completedRequests;

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#f4f5fb] via-[#eaecf5] to-[#e2e6f3] pb-24">
            {/* Indigo mesh glow */}
            <div className="absolute top-0 left-0 w-full h-[300px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 50% at 40% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
            />

            <div className="relative px-6 sm:px-8 pt-10 max-w-5xl mx-auto animate-fadeUp">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center shadow-sm shadow-[#6366f1]/20">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-ui font-bold uppercase tracking-[0.2em] text-[#6366f1]">Operations</span>
                        </div>
                        <h1 className="text-[28px] font-display font-semibold text-on-surface tracking-tight mb-1">
                            Action Queue
                        </h1>
                        <p className="text-[13px] font-ui text-on-surface-variant/70">Process pending facility requests and maintain oversight.</p>
                    </div>

                    <button
                        onClick={fetchData}
                        className="h-10 px-4 rounded-xl bg-white/80 backdrop-blur-sm border border-[#6366f1]/10 text-[12px] font-ui font-bold text-on-surface-variant flex items-center gap-2 hover:bg-[#6366f1]/5 hover:border-[#6366f1]/25 transition-all shadow-sm"
                    >
                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Sync
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl w-fit mb-8 shadow-sm">
                    {[
                        { key: 'pending', label: 'Awaiting Action', count: pendingRequests.length, urgent: pendingRequests.filter(r => r.urgencyRequested).length },
                        { key: 'completed', label: 'Resolved', count: completedRequests.length },
                    ].map(tab_ => (
                        <button
                            key={tab_.key}
                            onClick={() => setTab(tab_.key)}
                            className={`flex items-center gap-2.5 px-5 py-2 rounded-lg text-[12px] font-ui font-bold transition-all ${
                                tab === tab_.key
                                    ? 'bg-white shadow-sm text-[#6366f1] border border-[#6366f1]/10'
                                    : 'text-on-surface-variant/60 hover:text-on-surface'
                            }`}
                        >
                            {tab_.label}
                            <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-bold ${
                                tab === tab_.key
                                    ? 'bg-[#6366f1] text-white'
                                    : 'bg-[#f0f2f8] text-on-surface-variant/60'
                            }`}>
                                {tab_.count}
                            </span>
                            {tab_.urgent > 0 && tab_.key === 'pending' && (
                                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-8 h-8 border-[3px] border-[#6366f1] border-t-transparent rounded-full animate-spin mb-3" />
                        <span className="font-ui text-[13px] text-on-surface-variant/50">Fetching queue…</span>
                    </div>
                ) : activeList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-[#6366f1]/8 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-[#6366f1]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                {tab === 'pending'
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                                }
                            </svg>
                        </div>
                        <div className="text-[15px] font-display font-semibold text-on-surface mb-1">
                            {tab === 'pending' ? 'All tickets resolved' : 'No processed requests'}
                        </div>
                        <p className="text-[13px] font-ui text-on-surface-variant/50">
                            {tab === 'pending' ? 'Your queue is empty. Good job!' : 'Recent processed items will appear here.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {activeList.map(req => (
                            <RequestCard key={req.id} req={req} />
                        ))}
                    </div>
                )}
            </div>

            {/* Admin Review Modal */}
            {showReviewModal && selectedRequest && (
                <AdminReviewModal
                    isOpen={showReviewModal}
                    onClose={() => { setShowReviewModal(false); setSelectedRequest(null); }}
                    request={selectedRequest}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </div>
    );
};

export default ActionQueuePage;
