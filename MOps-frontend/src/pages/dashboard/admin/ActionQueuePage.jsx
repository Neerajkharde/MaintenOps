import React, { useState, useEffect, useCallback } from 'react';
import { requestService } from '../../../services/requestService';
import AdminReviewModal from '../../../components/requests/AdminReviewModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { get } from '../../../services/api';
import Button from '../../../components/Button';

/**
 * Statuses where the admin must take an action:
 *   REQUEST_CREATED  → Draft / Finalize quotation
 *   APPROVED         → Generate Lists
 *   VENDOR_LIST_APPROVED → Mark items as Procured
 *   ITEMS_READY      → Start Production
 *   IN_PRODUCTION    → Complete Production
 *   PAYMENT_PENDING  → Confirm Payment
 */
const ADMIN_ACTIONABLE = [
    'REQUEST_CREATED',
    'APPROVED',
    'VENDOR_LIST_APPROVED',
    'ITEMS_READY',
    'IN_PRODUCTION',
    'PAYMENT_PENDING',
];

const ActionQueuePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [tab, setTab] = useState('pending'); // 'pending' | 'completed'
    const [pendingRequests, setPendingRequests] = useState([]);
    const [completedRequests, setCompletedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // id of request being acted on
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

        // Actionable = REQUEST_CREATED requests + any history requests with an admin-actionable status
        const actionableFromHistory = history.filter(r => ADMIN_ACTIONABLE.includes(r.status) && r.status !== 'REQUEST_CREATED');
        const allActionable = [...pending, ...actionableFromHistory];

        // Completed = history items NOT in an actionable status
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

    // ==================== Phase-specific actions ====================

    const handleGenerateLists = async (reqId) => {
        setActionLoading(reqId);
        try {
            await requestService.generateLists(reqId);
            fetchData();
        } catch (e) { alert(e.message); }
        setActionLoading(null);
    };

    const handleStartProduction = async (reqId) => {
        setActionLoading(reqId);
        try {
            await requestService.startProduction(reqId);
            fetchData();
        } catch (e) { alert(e.message); }
        setActionLoading(null);
    };

    const handleCompleteProduction = async (reqId) => {
        setActionLoading(reqId);
        try {
            await requestService.completeProduction(reqId);
            fetchData();
        } catch (e) { alert(e.message); }
        setActionLoading(null);
    };

    const handleConfirmPayment = async (reqId) => {
        setActionLoading(reqId);
        try {
            await requestService.confirmPayment(reqId);
            fetchData();
        } catch (e) { alert(e.message); }
        setActionLoading(null);
    };

    const handleMarkItemProcured = async (materialId) => {
        setActionLoading(materialId);
        try {
            await requestService.markItemProcured(materialId);
            fetchData();
        } catch (e) { alert(e.message); }
        setActionLoading(null);
    };

    // ==================== Status Config ====================

    const statusConfig = {
        REQUEST_CREATED: { label: 'Submitted', bg: 'bg-primary-container', text: 'text-primary' },
        QUOTATION_ADDED: { label: 'Awaiting SA', bg: 'bg-warning-container', text: 'text-warning' },
        QUOTATION_APPROVED: { label: 'Quotation Approved', bg: 'bg-[#e8f5e9]', text: 'text-[#2e7d32]' },
        APPROVED: { label: 'User Accepted', bg: 'bg-success-container', text: 'text-success' },
        PENDING_SA_APPROVAL: { label: 'Lists Pending SA', bg: 'bg-warning-container', text: 'text-warning' },
        VENDOR_LIST_APPROVED: { label: 'Vendor Approved', bg: 'bg-[#e3f2fd]', text: 'text-[#1565c0]' },
        ITEMS_READY: { label: 'Items Ready', bg: 'bg-[#f3e8fd]', text: 'text-[#9334ea]' },
        IN_PRODUCTION: { label: 'In Production', bg: 'bg-[#fff3e0]', text: 'text-[#e65100]' },
        PAYMENT_PENDING: { label: 'Payment Pending', bg: 'bg-[#fce4ec]', text: 'text-[#c62828]' },
        COMPLETED: { label: 'Completed', bg: 'bg-success', text: 'text-white' },
    };

    // ==================== Request Card ====================

    const RequestCard = ({ req }) => {
        const cfg = statusConfig[req.status] || { label: req.status, bg: 'bg-surface-variant', text: 'text-on-surface-variant' };
        const quotationReady = !!req.estimatedDays;
        const isActing = actionLoading === req.id;
        const st = req.status;

        return (
            <div className="google-card p-6 hover:shadow-md transition-all group border-outline/30 bg-white">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[11px] font-bold font-ui text-on-surface-variant tracking-wider uppercase">#{req.requestNumber}</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-[11px] font-semibold font-ui uppercase ${cfg.bg} ${cfg.text}`}>
                                {cfg.label}
                            </span>
                            {req.urgencyRequested && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill bg-error-container text-error text-[11px] font-bold font-ui animate-pulse">
                                    Critical Attention
                                </span>
                            )}
                        </div>
                        <h4 className="text-[17px] font-display font-medium text-on-surface mb-2 leading-snug line-clamp-2">
                            {req.itemDescription}
                        </h4>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-on-surface-variant mb-6 font-ui">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {req.requesterName}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        {req.organizationDepartmentName}
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-variant text-[11px] font-medium tracking-wide">
                        {req.serviceDepartmentName}
                    </span>
                </div>

                {req.totalEstimatedCost && (
                    <div className="mb-6 flex items-center justify-between bg-success-container/10 border border-success/10 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-success"></div>
                            <span className="text-[13px] font-ui text-on-surface">Quotation Processed</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[15px] font-bold text-success font-ui">₹{Number(req.totalEstimatedCost).toLocaleString('en-IN')}</span>
                            <span className="text-[12px] text-on-surface-variant font-ui">{req.estimatedDays} Days</span>
                        </div>
                    </div>
                )}

                {/* ===== Material list with Procure buttons (VENDOR_LIST_APPROVED) ===== */}
                {st === 'VENDOR_LIST_APPROVED' && req.materials && req.materials.length > 0 && (
                    <div className="mb-6 border border-outline/20 rounded-lg overflow-hidden">
                        <div className="px-4 py-2.5 bg-[#e3f2fd]/40 border-b border-outline/20 text-[12px] font-bold font-ui text-[#1565c0] uppercase tracking-wider">
                            Procurement Checklist
                        </div>
                        <div className="divide-y divide-outline/10">
                            {req.materials.map(m => (
                                <div key={m.id} className="flex items-center justify-between px-4 py-3">
                                    <div className="flex-1">
                                        <div className="text-[13px] font-medium text-on-surface">{m.materialName}</div>
                                        <div className="text-[11px] text-on-surface-variant">
                                            {m.quantity} {m.unit} · {m.vendorName || 'No vendor'} · ₹{Number(m.totalPrice ?? 0).toFixed(2)}
                                        </div>
                                    </div>
                                    {m.status === 'PROCURED' ? (
                                        <span className="text-[11px] font-semibold text-success px-2.5 py-1 bg-success-container rounded-pill">✓ Procured</span>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => handleMarkItemProcured(m.id)}
                                            disabled={actionLoading === m.id}
                                            className="!rounded-md text-[12px] h-8 px-3 border-[#1565c0] text-[#1565c0] hover:bg-[#e3f2fd]"
                                        >
                                            {actionLoading === m.id ? 'Marking...' : 'Mark Procured'}
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===== Phase-specific action buttons ===== */}
                <div className="flex gap-3 flex-wrap">

                    {/* Phase 1: REQUEST_CREATED — Draft / Finalize / Details */}
                    {st === 'REQUEST_CREATED' && (
                        <>
                            {!quotationReady ? (
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(`/admin/create-quotation/${req.id}`)}
                                    className="!rounded-md px-5"
                                >
                                    Draft Quotation
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={() => { setSelectedRequest(req); setShowReviewModal(true); }}
                                    className="!rounded-md bg-success hover:bg-success/90 px-6"
                                >
                                    Finalize Assessment
                                </Button>
                            )}

                            {quotationReady && (
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/admin/create-quotation/${req.id}`)}
                                    className="!rounded-md border-outline"
                                >
                                    Adjust Costs
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                onClick={() => { setSelectedRequest(req); setShowReviewModal(true); }}
                                className="!rounded-md"
                            >
                                Details
                            </Button>
                        </>
                    )}

                    {/* Phase 2: APPROVED — Generate Lists */}
                    {st === 'APPROVED' && (
                        <Button
                            variant="primary"
                            onClick={() => handleGenerateLists(req.id)}
                            disabled={isActing}
                            className="!rounded-md px-6 bg-[#1565c0] hover:bg-[#0d47a1]"
                        >
                            {isActing ? 'Generating...' : '📋 Generate Lists'}
                        </Button>
                    )}

                    {/* Phase 3: VENDOR_LIST_APPROVED — individual procure buttons are above */}

                    {/* Phase 4a: ITEMS_READY — Start Production */}
                    {st === 'ITEMS_READY' && (
                        <Button
                            variant="primary"
                            onClick={() => handleStartProduction(req.id)}
                            disabled={isActing}
                            className="!rounded-md px-6 bg-[#e65100] hover:bg-[#bf360c]"
                        >
                            {isActing ? 'Starting...' : '🏭 Start Production'}
                        </Button>
                    )}

                    {/* Phase 4b: IN_PRODUCTION — Complete Production */}
                    {st === 'IN_PRODUCTION' && (
                        <Button
                            variant="primary"
                            onClick={() => handleCompleteProduction(req.id)}
                            disabled={isActing}
                            className="!rounded-md px-6 bg-[#c62828] hover:bg-[#b71c1c]"
                        >
                            {isActing ? 'Completing...' : '✅ Complete Production'}
                        </Button>
                    )}

                    {/* Phase 5: PAYMENT_PENDING — Confirm Payment */}
                    {st === 'PAYMENT_PENDING' && (
                        <Button
                            variant="primary"
                            onClick={() => handleConfirmPayment(req.id)}
                            disabled={isActing}
                            className="!rounded-md px-6 bg-success hover:bg-success/90"
                        >
                            {isActing ? 'Confirming...' : '💰 Confirm Payment'}
                        </Button>
                    )}
                </div>

                {/* Admin audit note (shown on completed tab) */}
                {!ADMIN_ACTIONABLE.includes(st) && req.adminRemarks && (
                    <div className="mt-4 bg-background rounded-lg p-4 border border-outline/20">
                        <div className="text-[10px] text-on-surface-variant mb-2 font-bold uppercase tracking-widest font-ui">Admin Audit Note</div>
                        <p className="text-[13px] text-on-surface leading-relaxed font-body">{req.adminRemarks}</p>
                        {req.adminReviewedAt && (
                            <div className="text-[11px] text-on-surface-variant mt-2 font-ui">
                                Processed on {new Date(req.adminReviewedAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const activeList = tab === 'pending' ? pendingRequests : completedRequests;

    return (
        <div className="p-8 max-w-5xl mx-auto animate-fadeUp pb-24">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-[32px] font-display font-medium text-on-surface tracking-tight mb-2">
                        Action Queue
                    </h1>
                    <p className="text-[15px] text-on-surface-variant font-ui">Maintain oversight and process pending facility requests.</p>
                </div>
                <Button
                    variant="ghost"
                    onClick={fetchData}
                    className="border border-outline h-10 hover:bg-surface-variant"
                >
                    <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sync
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-surface-variant/40 rounded-pill w-fit mb-10">
                {[
                    { key: 'pending', label: 'Awaiting Action', count: pendingRequests.length, urgent: pendingRequests.filter(r => r.urgencyRequested).length },
                    { key: 'completed', label: 'Resolved', count: completedRequests.length },
                ].map(tab_ => (
                    <button
                        key={tab_.key}
                        onClick={() => setTab(tab_.key)}
                        className={`flex items-center gap-3 px-6 py-2 rounded-pill text-[13px] font-medium transition-all group ${tab === tab_.key ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                    >
                        {tab_.label}
                        <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${tab === tab_.key ? 'bg-primary text-white' : 'bg-outline/20 text-on-surface-variant'
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
                <div className="flex flex-col items-center justify-center py-32 opacity-30">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <span className="font-ui text-[14px]">Fetching queue...</span>
                </div>
            ) : activeList.length === 0 ? (
                <div className="text-center py-32 bg-surface-variant/20 rounded-xl border border-dashed border-outline/30">
                    <div className="text-5xl mb-6 grayscale opacity-20 select-none">
                        {tab === 'pending' ? '✨' : '📂'}
                    </div>
                    <div className="text-[17px] font-display font-medium text-on-surface mb-1">
                        {tab === 'pending' ? 'All tickets resolved' : 'No processed requests'}
                    </div>
                    <p className="text-[14px] text-on-surface-variant font-ui">
                        {tab === 'pending' ? 'Your queue is empty. Good job!' : 'Recent processed items will appear here.'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {activeList.map(req => (
                        <RequestCard key={req.id} req={req} />
                    ))}
                </div>
            )}

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
