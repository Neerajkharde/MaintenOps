import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestContext';
import NewRequestModal from '../../components/requests/NewRequestModal';
import Button from '../../components/Button';

const UserDashboard = () => {
    const { user } = useAuth();
    const { activeRequests, stats, loading, error, refreshRequests } = useRequests();
    const [animatedStats, setAnimatedStats] = useState({ total: 0, active: 0, pending: 0, completed: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrackId, setSelectedTrackId] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (activeRequests.length > 0 && !selectedTrackId) {
            setSelectedTrackId(activeRequests[0].id);
        }
    }, [activeRequests, selectedTrackId]);

    useEffect(() => {
        const duration = 800;
        const steps = 20;
        const stepTime = duration / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            setAnimatedStats({
                total: Math.floor(stats.total * progress),
                active: Math.floor(stats.active * progress),
                pending: Math.floor(stats.pending * progress),
                completed: Math.floor(stats.completed * progress),
            });

            if (currentStep >= steps) clearInterval(timer);
        }, stepTime);

        return () => clearInterval(timer);
    }, [stats]);

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
                <div className="w-12 h-12 border-4 border-outline/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-on-surface-variant font-ui">Preparing your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-[20px] font-display font-medium text-on-surface mb-2">Service Connection Error</h3>
                <p className="text-on-surface-variant font-ui max-w-sm mb-8">{error}</p>
                <Button variant="primary" onClick={refreshRequests}>
                    Reconnect Now
                </Button>
            </div>
        );
    }

    const currentReq = activeRequests.find(r => r.id === selectedTrackId);

    return (
        <div className="relative pb-24 px-6 sm:px-8 pt-8 max-w-[1400px] mx-auto animate-fadeUp">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-[32px] font-display font-medium text-on-surface tracking-tight mb-2">
                        Welcome, {user?.name?.split(' ')[0] || user?.username || 'User'}
                    </h2>
                    <p className="text-[15px] font-ui text-on-surface-variant">
                        Overview of your recent facility maintenance requests and status updates.
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}
                    className="h-12 px-8 shadow-md hover:shadow-lg transition-all"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    New Request
                </Button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Tickets', val: animatedStats.total, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', bg: 'bg-primary-container/30', color: 'text-primary' },
                    { label: 'Active', val: animatedStats.active, icon: 'M13 10V3L4 14h7v7l9-11h-7z', bg: 'bg-primary-container/30', color: 'text-primary' },
                    { label: 'Awaiting Review', val: animatedStats.pending, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0y', bg: 'bg-warning-container/30', color: 'text-warning' },
                    { label: 'Resolved', val: animatedStats.completed, icon: 'M5 13l4 4L19 7', bg: 'bg-success-container/30', color: 'text-success' }
                ].map((s, i) => (
                    <div key={i} className="google-card p-6 border-outline/30 bg-white hover:bg-surface-variant/10 transition-colors">
                        <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mb-6`}>
                            <svg className={`w-6 h-6 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                            </svg>
                        </div>
                        <div className="text-[36px] font-display font-medium text-on-surface leading-none mb-2">{s.val}</div>
                        <div className="text-[14px] font-ui font-medium text-on-surface-variant uppercase tracking-wider">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col xl:flex-row gap-8">
                {/* LEFT: Dynamic Tracker */}
                <div className="flex-1 google-card p-8 border-outline/30 bg-white shadow-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-outline/20">
                        <div>
                            <h3 className="text-[18px] font-display font-medium text-on-surface mb-1">Service Tracker</h3>
                            <p className="text-[14px] text-on-surface-variant font-ui">Track live progress of your active maintenance tickets</p>
                        </div>

                        <div className="relative w-full sm:w-auto">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full sm:w-56 flex items-center justify-between px-4 py-2.5 bg-surface-variant/40 rounded-lg text-[14px] font-ui text-on-surface hover:bg-surface-variant/60 transition-colors focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <span className="truncate">{currentReq ? `Ticket #${currentReq.id}` : 'No active tickets'}</span>
                                <svg className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                    <div className="absolute left-0 mt-2 w-full sm:w-64 bg-white rounded-xl shadow-lg border border-outline/30 py-2 z-20 animate-fadeUp origin-top">
                                        {activeRequests.length > 0 ? activeRequests.map(req => (
                                            <button
                                                key={req.id}
                                                onClick={() => { setSelectedTrackId(req.id); setIsDropdownOpen(false); }}
                                                className={`w-full text-left px-5 py-3 hover:bg-surface-variant transition-colors flex items-center gap-3 ${selectedTrackId === req.id ? 'bg-primary-container/20 text-primary font-medium' : 'text-on-surface font-ui'}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${selectedTrackId === req.id ? 'bg-primary' : 'bg-outline/40'}`}></div>
                                                <div className="flex-1">
                                                    <div className="text-[13px]">Ticket #{req.id}</div>
                                                    <div className="text-[11px] text-on-surface-variant truncate">{req.desc}</div>
                                                </div>
                                            </button>
                                        )) : (
                                            <div className="px-5 py-4 text-[13px] text-on-surface-variant font-ui">No active service tickets.</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {currentReq ? (
                        <div className="animate-fadeUp">
                            <div className="mb-10 bg-primary-container/10 p-5 rounded-xl border border-primary/10">
                                <h4 className="text-[16px] font-display font-medium text-on-surface mb-2">{currentReq.desc}</h4>
                                <div className="flex gap-2">
                                    {getDeptChip(currentReq.dept)}
                                    <span className="px-2.5 py-0.5 rounded-md border border-outline/20 bg-white text-[12px] font-medium font-ui text-on-surface-variant">
                                        Submitted on {currentReq.date}
                                    </span>
                                </div>
                            </div>

                            <div className="relative pl-12 space-y-12 pb-4">
                                {/* Vertical Progress Line */}
                                <div className="absolute left-[18px] top-6 bottom-6 w-[2px] bg-outline/20"></div>

                                {/* Stage Completion logic */}
                                {(() => {
                                    const st = currentReq.status;
                                    const trackerSteps = [
                                        { label: 'Request Created', desc: 'Successfully logged into the maintenance portal.', key: 'REQUEST_CREATED' },
                                        { label: 'Quotation Added', desc: 'Admin assessed materials & costs.', key: 'QUOTATION_ADDED' },
                                        { label: 'Quotation Approved', desc: 'Super Admin approved the quotation.', key: 'QUOTATION_APPROVED' },
                                        { label: 'You Accepted', desc: 'Quotation accepted, lists being prepared.', key: 'APPROVED' },
                                        { label: 'Lists Pending SA', desc: 'Material & vendor lists awaiting approval.', key: 'PENDING_SA_APPROVAL' },
                                        { label: 'Vendor Lists Approved', desc: 'Procurement authorized by SA.', key: 'VENDOR_LIST_APPROVED' },
                                        { label: 'Items Ready', desc: 'All materials procured.', key: 'ITEMS_READY' },
                                        { label: 'In Production', desc: 'Work underway on your request.', key: 'IN_PRODUCTION' },
                                        { label: 'Payment Pending', desc: 'Production complete, awaiting payment.', key: 'PAYMENT_PENDING' },
                                        { label: 'Completed', desc: 'Request fulfilled and closed.', key: 'COMPLETED' },
                                    ];
                                    const statusOrder = trackerSteps.map(s => s.key);
                                    const currentIdx = statusOrder.indexOf(st);

                                    return (
                                        <>
                                            {trackerSteps.map((step, i) => {
                                                const isDone = i <= currentIdx;
                                                const isCurrent = i === currentIdx;
                                                return (
                                                    <div key={step.key} className="relative flex items-start group">
                                                        <div className={`absolute -left-12 flex h-10 w-10 items-center justify-center rounded-full ring-8 ring-white transition-all ${isDone ? 'bg-success text-white' : isCurrent ? 'bg-primary text-white shadow-md animate-pulse' : 'bg-surface-variant text-on-surface-variant'
                                                            }`}>
                                                            {isDone ? (
                                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                            ) : (
                                                                <span className="text-[13px] font-bold">{i + 1}</span>
                                                            )}
                                                        </div>
                                                        <div className={!isDone && !isCurrent ? 'opacity-40' : ''}>
                                                            <h5 className="text-[15px] font-display font-medium text-on-surface">{step.label}</h5>
                                                            <p className="text-[13px] text-on-surface-variant font-ui mt-1">{step.desc}</p>
                                                            {isCurrent && (
                                                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-container/30 text-primary text-[12px] font-semibold font-ui uppercase tracking-wide">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                                                    Current Stage
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-20 h-20 bg-surface-variant/40 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-on-surface-variant/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h4 className="text-[17px] font-display font-medium text-on-surface mb-2">Queue Clear</h4>
                            <p className="text-[14px] text-on-surface-variant font-ui max-w-[240px]">You don't have any active requests requiring tracking right now.</p>
                        </div>
                    )}
                </div>

                {/* RIGHT: Financial Sidebar */}
                <div className="w-full xl:w-[450px] space-y-8">
                    <div className="google-card p-8 border-outline/30 bg-white">
                        <h3 className="text-[18px] font-display font-medium text-on-surface mb-8 pb-4 border-b border-outline/20">Operational Audit</h3>

                        {currentReq?.totalEstimatedCost ? (
                            <div className="animate-fadeUp">
                                <div className="mb-6">
                                    <div className="text-[12px] font-ui font-bold text-on-surface-variant uppercase tracking-widest mb-1">Approved Estimate</div>
                                    <div className="text-[42px] font-display font-medium text-primary leading-tight font-ui">₹5,000</div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-[14px] font-ui">
                                        <span className="text-on-surface-variant">Components & Parts</span>
                                        <span className="font-semibold text-on-surface">₹3,500</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[14px] font-ui">
                                        <span className="text-on-surface-variant">Labor & Logistics</span>
                                        <span className="font-semibold text-on-surface">₹1,500</span>
                                    </div>
                                    <div className="pt-4 border-t border-outline/20 flex justify-between items-center text-[15px] font-display font-medium">
                                        <span className="text-on-surface">Final Assessment</span>
                                        <span className="text-success">Verified</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-surface-variant/30 rounded-xl mb-8">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[11px] font-bold">SA</div>
                                        <div>
                                            <div className="text-[13px] text-on-surface font-semibold font-ui">Super Admin Verification</div>
                                            <div className="text-[11px] text-on-surface-variant font-ui">Authored on Feb 22, 2026</div>
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-on-surface-variant leading-relaxed italic">
                                        "Work proposal approved. Standard maintenance cycles apply. Priority execution assigned."
                                    </p>
                                </div>

                                <Button variant="outline" className="w-full border-outline text-on-surface font-ui">
                                    Archive Ticket
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center opacity-40 grayscale">
                                <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h4 className="text-[16px] font-display font-medium text-on-surface mb-1">Price Control</h4>
                                <p className="text-[13px] font-ui">Financial audit will be active post-review.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* FAB REDESIGN */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 h-14 bg-primary text-white pl-5 pr-7 rounded-2xl font-ui font-medium shadow-2xl hover:shadow-primary/20 transition-all transform hover:-translate-y-1 z-50 flex items-center gap-3 active:scale-95"
            >
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </div>
                Create New Request
            </button>

            <NewRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default UserDashboard;
