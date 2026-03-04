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
            <div className="pb-24 px-6 sm:px-8 pt-8 max-w-[1400px] mx-auto animate-fadeUp">
                <div className="mb-10 w-64 h-12 animate-skeleton rounded-2xl"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="vanguard-card p-6 min-h-[160px] flex flex-col justify-between">
                            <div className="w-12 h-12 animate-skeleton rounded-2xl"></div>
                            <div className="w-24 h-10 animate-skeleton rounded-2xl"></div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col xl:flex-row gap-8">
                    <div className="flex-1 vanguard-card p-8 min-h-[500px]">
                        <div className="w-1/3 h-8 animate-skeleton rounded-xl mb-8"></div>
                        <div className="w-full h-24 animate-skeleton rounded-2xl mb-12"></div>
                        <div className="w-full h-40 animate-skeleton rounded-2xl"></div>
                    </div>
                    <div className="w-full xl:w-[450px] vanguard-card p-8 min-h-[500px]">
                        <div className="w-1/2 h-8 animate-skeleton rounded-xl mb-8"></div>
                        <div className="w-full h-40 animate-skeleton rounded-2xl mb-8"></div>
                        <div className="w-full h-14 animate-skeleton rounded-2xl"></div>
                    </div>
                </div>
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
        <>
            <div className="relative pb-24 px-6 sm:px-8 pt-8 max-w-[1400px] mx-auto animate-fadeUp">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-[32px] font-display font-medium text-on-surface tracking-tight mb-2">
                            Hare Krishna, {user?.name?.split(' ')[0] || user?.username || 'User'}
                        </h2>
                        <p className="text-[15px] font-ui text-on-surface-variant">
                            Overview of your recent facility maintenance requests and status updates.
                        </p>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Tickets', val: animatedStats.total, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', bg: 'bg-primary/5', color: 'text-primary' },
                        { label: 'Active', val: animatedStats.active, icon: 'M13 10V3L4 14h7v7l9-11h-7z', bg: 'bg-primary/5', color: 'text-primary' },
                        { label: 'Awaiting Review', val: animatedStats.pending, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0y', bg: 'bg-warning/5', color: 'text-warning' },
                        { label: 'Resolved', val: animatedStats.completed, icon: 'M5 13l4 4L19 7', bg: 'bg-success/5', color: 'text-success' }
                    ].map((s, i) => (
                        <div key={i} className="vanguard-card p-6 border-white/40 flex flex-col justify-between min-h-[160px]">
                            <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-inner`}>
                                <svg className={`w-6 h-6 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={s.icon} />
                                </svg>
                            </div>
                            <div>
                                <div className="text-[32px] font-display font-black text-on-surface leading-none mb-1">{s.val}</div>
                                <div className="text-[12px] font-ui font-black text-on-surface-variant/40 uppercase tracking-[0.15em]">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col xl:flex-row gap-8">
                    {/* LEFT: Dynamic Tracker */}
                    <div className="flex-1 vanguard-card p-8 border-white/40 shadow-xl overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-on-surface/5">
                            <div>
                                <h3 className="text-[20px] font-display font-black text-on-surface tracking-tight mb-1">Service Progress</h3>
                                <p className="text-[13px] text-on-surface-variant/60 font-bold uppercase tracking-[0.1em]">Intelligence Ops Hub</p>
                            </div>

                            <div className="relative w-full sm:w-auto">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full sm:w-60 flex items-center justify-between px-5 py-3 bg-on-surface text-surface rounded-xl text-[13px] font-bold hover:bg-on-surface/90 transition-all shadow-lg shadow-on-surface/10 outline-none focus:ring-4 focus:ring-on-surface/10"
                                >
                                    <span className="truncate">{currentReq ? `TICKET_${currentReq.id}` : 'SELECT_TICKET'}</span>
                                    <svg className={`w-4 h-4 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                        <div className="absolute left-0 mt-3 w-full sm:w-64 vanguard-card bg-white/95 border-white shadow-2xl py-2 z-20 animate-fadeUp origin-top border border-outline/10 overflow-hidden">
                                            {activeRequests.length > 0 ? activeRequests.map(req => (
                                                <button
                                                    key={req.id}
                                                    onClick={() => { setSelectedTrackId(req.id); setIsDropdownOpen(false); }}
                                                    className={`w-full text-left px-5 py-3.5 hover:bg-surface-variant transition-colors flex items-center gap-4 border-b border-on-surface/5 last:border-none ${selectedTrackId === req.id ? 'bg-primary/5 text-primary font-black' : 'text-on-surface/70 font-bold'}`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${selectedTrackId === req.id ? 'bg-primary scale-150 rotate-in' : 'bg-outline/40'}`}></div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <div className="text-[13px] tracking-tight">TICKET_{req.id}</div>
                                                        <div className="text-[10px] text-on-surface-variant/60 truncate uppercase font-bold tracking-wider">{req.desc}</div>
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

                                {/* Compact Horizontal Stepper */}
                                <div className="py-8 px-2 mt-4 overflow-x-auto custom-scrollbar">
                                    <div className="relative min-w-[500px] px-4">
                                        {/* Line background */}
                                        <div className="absolute top-5 left-0 w-full h-0.5 bg-outline/20"></div>

                                        {/* Progress line */}
                                        {(() => {
                                            const st = currentReq.status;
                                            const phases = [
                                                { label: 'Logged', keys: ['REQUEST_CREATED'] },
                                                { label: 'Reviewed', keys: ['QUOTATION_ADDED', 'QUOTATION_APPROVED'] },
                                                { label: 'Production', keys: ['APPROVED', 'PENDING_SA_APPROVAL', 'VENDOR_LIST_APPROVED', 'ITEMS_READY', 'IN_PRODUCTION', 'PAYMENT_PENDING'] },
                                                { label: 'Complete', keys: ['COMPLETED'] }
                                            ];
                                            const currentIdx = phases.findIndex(p => p.keys.includes(st));
                                            const progressWidth = currentIdx === -1 ? 0 : (currentIdx / (phases.length - 1)) * 100;
                                            const isActionRequired = st === 'QUOTATION_APPROVED';

                                            return (
                                                <>
                                                    <div
                                                        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-700 ease-in-out"
                                                        style={{ width: `${progressWidth}%` }}
                                                    ></div>

                                                    <div className="grid grid-cols-4 relative">
                                                        {phases.map((phase, i) => {
                                                            const isDone = i <= currentIdx;
                                                            const isNow = i === currentIdx;
                                                            return (
                                                                <div key={i} className="flex flex-col items-center shrink-0">
                                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 bg-white transition-all duration-300 z-10 
                                                                        ${isDone ? 'border-primary text-primary shadow-sm' : 'border-outline/20 text-on-surface-variant/40'}`}>
                                                                        {isDone ? (
                                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                                        ) : (
                                                                            <span className="text-[13px] font-bold">{i + 1}</span>
                                                                        )}
                                                                    </div>
                                                                    <div className={`mt-3 text-[11px] font-bold uppercase tracking-wider text-center transition-all duration-300 ${isDone ? 'text-on-surface' : 'text-on-surface-variant/40'}`}>
                                                                        {phase.label}
                                                                    </div>
                                                                    {isNow && (
                                                                        <div className="mt-1 text-[9px] font-bold text-white px-2 py-0.5 bg-primary rounded-md shadow-sm">
                                                                            ACTIVE
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {(() => {
                                    const st = currentReq.status;
                                    const isActionRequired = st === 'QUOTATION_APPROVED';
                                    return (
                                        <>
                                            {/* Premium Action Alert */}
                                            {isActionRequired && (
                                                <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 animate-fadeUp">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative shrink-0">
                                                            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25"></div>
                                                            <div className="relative w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[16px] font-bold text-on-surface leading-tight mb-1">Action Required: Your approval needed</div>
                                                            <div className="text-[13px] text-on-surface-variant">Review the maintenance cost estimate and approve to proceed.</div>
                                                        </div>
                                                    </div>
                                                    <button className="w-full sm:w-auto bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-[14px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                                        View Details
                                                    </button>
                                                </div>
                                            )}

                                            {/* Contextual Status Info */}
                                            {!isActionRequired && (
                                                <div className="mt-8 flex-grow flex flex-col justify-center items-center text-center p-8 border border-dashed border-outline/30 rounded-2xl bg-surface-variant/5">
                                                    <div className="text-[14px] font-medium text-on-surface-variant mb-3">Live Status</div>
                                                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-xl border border-outline/10 shadow-sm text-primary font-bold text-[14px]">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(26,115,232,0.6)]"></div>
                                                        {st.replace(/_/g, ' ')}
                                                    </div>
                                                    <p className="mt-4 text-[13px] text-on-surface-variant/60 max-w-sm leading-relaxed">No actions needed from your end yet. We'll update you as soon as the next phase begins.</p>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
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
                    <div className="w-full xl:w-[450px] space-y-8 animate-fadeUp" style={{ animationDelay: '200ms' }}>
                        <div className="vanguard-card p-8 border-white/40 shadow-xl overflow-hidden">
                            <h3 className="text-[18px] font-display font-black text-on-surface mb-8 pb-4 border-b border-on-surface/5">Operational Audit</h3>

                            {currentReq?.totalEstimatedCost ? (
                                <div>
                                    <div className="mb-6">
                                        <div className="text-[11px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mb-2">Approved Financial Estimate</div>
                                        <div className="text-[44px] font-display font-black text-primary leading-tight font-ui tracking-tight italic">₹5,000</div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center text-[14px]">
                                            <span className="text-on-surface-variant font-bold uppercase tracking-wider text-[11px]">Components & Parts</span>
                                            <span className="font-black text-on-surface">₹3,500</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[14px]">
                                            <span className="text-on-surface-variant font-bold uppercase tracking-wider text-[11px]">Labor & Logistics</span>
                                            <span className="font-black text-on-surface">₹1,500</span>
                                        </div>
                                        <div className="pt-4 border-t border-on-surface/5 flex justify-between items-center">
                                            <span className="text-[13px] font-black text-on-surface uppercase tracking-widest leading-none">Status</span>
                                            <span className="px-3 py-1 bg-success/10 text-success text-[10px] font-black uppercase tracking-widest border border-success/20 rounded-pill">Verified Authority</span>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-on-surface/5 rounded-2xl mb-8 border border-white/40">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-9 h-9 rounded-xl bg-on-surface text-surface flex items-center justify-center text-[12px] font-black shadow-lg shadow-on-surface/10 ring-4 ring-on-surface/5">SA</div>
                                            <div>
                                                <div className="text-[13px] text-on-surface font-black uppercase tracking-tight">Executive Verification</div>
                                                <div className="text-[10px] text-on-surface-variant/60 font-bold uppercase">Authored Feb 22, 2026</div>
                                            </div>
                                        </div>
                                        <p className="text-[13px] text-on-surface-variant/80 leading-relaxed font-ui italic">
                                            "Work proposal approved. Standard maintenance cycles apply. Priority execution assigned."
                                        </p>
                                    </div>

                                    <Button variant="outline" fullWidth className="h-14 font-black text-[13px] uppercase tracking-[0.15em] border-on-surface/10">
                                        Archive Ticket_
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40 grayscale group">
                                    <div className="w-20 h-20 bg-on-surface/5 rounded-full flex items-center justify-center mb-6 border border-dashed border-on-surface/20 group-hover:scale-110 transition-transform">
                                        <svg className="w-10 h-10 text-on-surface-variant/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h4 className="text-[16px] font-display font-black text-on-surface uppercase tracking-tight mb-2">Price Control</h4>
                                    <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">Financial audit post-review</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FAB REDESIGN */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-6 sm:bottom-10 right-6 sm:right-10 h-14 sm:h-16 bg-on-surface text-surface pl-5 sm:pl-6 pr-6 sm:pr-8 rounded-2xl font-display font-black text-[12px] sm:text-[13px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-primary/40 transition-all transform hover:-translate-y-2 z-50 flex items-center gap-3 sm:gap-4 active:scale-90 select-none border-t border-white/10 uppercase tracking-[0.1em]"
                >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-surface/20 rounded-xl flex items-center justify-center shadow-inner">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    Create Request
                </button>

            </div>

            <NewRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default UserDashboard;
