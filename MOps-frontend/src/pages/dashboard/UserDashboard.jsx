import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestContext';
import NewRequestModal from '../../components/requests/NewRequestModal';

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
        switch (dept) {
            case 'Electrical': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#fce8e6] text-[#c5221f] text-[12px]">Electrical</span>;
            case 'Carpentry': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#fff8e1] text-[#f9ab00] text-[12px]">Carpentry</span>;
            case 'Plumbing': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#e6f4ea] text-[#137333] text-[12px]">Plumbing</span>;
            default: return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#f1f3f4] text-[#5f6368] text-[12px]">{dept}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-[#e8f0fe] border-t-[#1a73e8] rounded-full animate-spin mb-4"></div>
                <p className="text-[#5f6368] font-['Roboto',sans-serif]">Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 bg-[#fce8e6] text-[#c5221f] rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-[18px] font-['Google_Sans',sans-serif] text-[#202124] mb-2">Something went wrong</h3>
                <p className="text-[#5f6368] font-['Roboto',sans-serif] mb-6">{error}</p>
                <button
                    onClick={refreshRequests}
                    className="px-6 py-2 bg-[#1a73e8] text-white rounded-[50px] font-['Google_Sans',sans-serif] text-[14px] hover:bg-[#1557b0] transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="relative pb-24 px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl mx-auto">
            {/* SECTION 1 — WELCOME BANNER */}
            <div className="bg-[#e8f0fe] rounded-[16px] px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden animate-fadeUp" style={{ animationDelay: '0ms' }}>
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#1a73e8]"></div>
                <div>
                    <h2 className="text-[24px] font-['Google_Sans_Display',sans-serif] text-[#202124] mb-1">
                        Hare Krishna, {user?.name?.split(' ')[0] || user?.username || 'User'} 👋
                    </h2>
                    <p className="text-[14px] font-['Roboto',sans-serif] text-[#5f6368]">
                        You have {stats.active} submitted request{stats.active !== 1 ? 's' : ''}. {stats.pending} {stats.pending === 1 ? ' is' : ' are'} awaiting SA approval.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-[10px] rounded-[50px] font-['Google_Sans',sans-serif] text-[14px] font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        New Request
                    </button>
                </div>
            </div>

            {/* SECTION 2 — STATS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 animate-fadeUp opacity-0" style={{ animationDelay: '100ms' }}>
                <div className="bg-white rounded-[16px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)] relative">
                    <div className="absolute top-6 right-6 w-10 h-10 bg-[#e8f0fe] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="text-[32px] font-['Google_Sans_Display',sans-serif] text-[#202124] leading-tight">{animatedStats.total}</div>
                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] mt-1">Total Requests</div>
                </div>
                <div className="bg-white rounded-[16px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)] relative">
                    <div className="absolute top-6 right-6 w-10 h-10 bg-[#e8f0fe] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className="text-[32px] font-['Google_Sans_Display',sans-serif] text-[#1a73e8] leading-tight">{animatedStats.active}</div>
                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] mt-1">Submitted</div>
                </div>
                <div className="bg-white rounded-[16px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)] relative">
                    <div className="absolute top-6 right-6 w-10 h-10 bg-[#fef9e7] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#f9ab00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-[32px] font-['Google_Sans_Display',sans-serif] text-[#f9ab00] leading-tight">{animatedStats.pending}</div>
                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] mt-1">Pending SA</div>
                </div>
                <div className="bg-white rounded-[16px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)] relative">
                    <div className="absolute top-6 right-6 w-10 h-10 bg-[#e6f4ea] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#137333]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div className="text-[32px] font-['Google_Sans_Display',sans-serif] text-[#137333] leading-tight">{animatedStats.completed}</div>
                    <div className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] mt-1">Approved</div>
                </div>
            </div>

            {/* SECTION 4 — REQUEST TRACKER */}
            <div className="flex flex-col lg:flex-row gap-6 mt-6 animate-fadeUp opacity-0" style={{ animationDelay: '300ms' }}>
                {/* LEFT: Timeline */}
                <div className="w-full lg:w-[60%] bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[16px] font-['Google_Sans',sans-serif] font-medium text-[#202124]">Track Active Request</h3>
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2 border border-[#dadce0] rounded-[50px] text-[13px] font-['Google_Sans',sans-serif] text-[#202124] bg-white hover:bg-[#f8f9fa] transition-colors focus:outline-none focus:border-[#1a73e8]"
                            >
                                {selectedTrackId || 'No Active'}
                                <svg className={`w-4 h-4 text-[#5f6368] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                    <div className="absolute right-0 top-[calc(100%+8px)] w-[180px] bg-white rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#dadce0] py-2 z-20 animate-fadeUp origin-top-right">
                                        {activeRequests.length > 0 ? activeRequests.map(req => (
                                            <button
                                                key={req.id}
                                                onClick={() => {
                                                    setSelectedTrackId(req.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-[13px] font-['Roboto',sans-serif] transition-colors flex items-center justify-between ${selectedTrackId === req.id ? 'text-[#1a73e8] bg-[#e8f0fe] hover:bg-[#e8f0fe]' : 'text-[#202124] hover:bg-[#f8f9fa]'}`}
                                            >
                                                {req.id}
                                                {selectedTrackId === req.id && (
                                                    <svg className="w-4 h-4 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                )}
                                            </button>
                                        )) : (
                                            <div className="px-4 py-2 text-[13px] text-[#5f6368] font-['Roboto',sans-serif]">No active requests</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {activeRequests.length > 0 ? (
                        <div className="mb-6">
                            <div className="text-[15px] font-medium text-[#202124] mb-2">
                                {activeRequests.find(r => r.id === selectedTrackId)?.desc || ''}
                            </div>
                            {getDeptChip(activeRequests.find(r => r.id === selectedTrackId)?.dept || '')}
                        </div>
                    ) : (
                        <div className="mb-6 text-[14px] text-[#5f6368]">
                            No active requests to track.
                        </div>
                    )}

                    {(() => {
                        const currentReq = activeRequests.find(r => r.id === selectedTrackId);
                        const isSubmitted = currentReq?.status === 'SUBMITTED';
                        const isPendingSA = currentReq?.status === 'PENDING_SA_APPROVAL';
                        const isApproved = currentReq?.status === 'APPROVED';

                        return (
                            <div className="relative pl-3 mt-4">
                                {/* Connecting Line (background) */}
                                <div className="absolute left-[23.5px] top-4 bottom-4 w-[2px] bg-[#dadce0]"></div>
                                {/* Connecting Line (progress) */}
                                <div className={`absolute left-[23.5px] top-4 w-[2px] bg-[#137333] transition-all duration-500 ${isApproved ? 'h-[120px]' : isPendingSA ? 'h-[60px]' : 'h-0'}`}></div>

                                {/* Stage 1 */}
                                <div className="flex gap-4 mb-8 relative z-10">
                                    <div className="w-6 h-6 rounded-full bg-[#137333] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div>
                                        <div className="text-[14px] font-['Google_Sans',sans-serif] font-medium text-[#202124]">Request Submitted</div>
                                        <div className="text-[12px] font-['Roboto',sans-serif] text-[#5f6368]">{currentReq?.date || 'N/A'}</div>
                                    </div>
                                </div>

                                {/* Stage 2 */}
                                <div className="flex gap-4 mb-8 relative z-10">
                                    {isApproved ? (
                                        <div className="w-6 h-6 rounded-full bg-[#137333] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    ) : isPendingSA ? (
                                        <div className="w-6 h-6 rounded-full bg-[#1a73e8] flex-shrink-0 mt-0.5 animate-pulseBlue border-2 border-white shadow-[0_0_0_4px_rgba(26,115,232,0.1)]"></div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-[#dadce0] bg-white flex-shrink-0 mt-0.5"></div>
                                    )}
                                    <div className={isSubmitted ? 'opacity-70' : ''}>
                                        <div className={`text-[14px] font-['Google_Sans',sans-serif] ${isPendingSA || isApproved ? 'font-medium text-[#202124]' : 'text-[#9aa0a6]'}`}>Pending SA Approval</div>
                                        {isPendingSA && (
                                            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[50px] bg-[#fef9e7] text-[#f9ab00] text-[12px] font-medium">
                                                <span>⏳</span> Awaiting super admin review
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Stage 3 */}
                                <div className="flex gap-4 relative z-10">
                                    {isApproved ? (
                                        <div className="w-6 h-6 rounded-full bg-[#137333] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_0_4px_rgba(19,115,51,0.1)]">
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-[#dadce0] bg-white flex-shrink-0 mt-0.5"></div>
                                    )}
                                    <div className={!isApproved ? 'opacity-70' : ''}>
                                        <div className={`text-[14px] font-['Google_Sans',sans-serif] ${isApproved ? 'font-medium text-[#202124]' : 'text-[#9aa0a6]'}`}>Approved for Work</div>
                                        {isApproved && (
                                            <div className="mt-1 text-[13px] font-['Roboto',sans-serif] text-[#137333] font-medium">Ready for execution</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* RIGHT: Quotation Card */}
                <div className="w-full lg:w-[40%] bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6">
                    <h3 className="text-[16px] font-['Google_Sans',sans-serif] font-medium text-[#202124] mb-6">Quotation Details</h3>

                    {activeRequests.find(r => r.id === selectedTrackId)?.status === 'APPROVED' ? (
                        <div>
                            <div className="text-[32px] font-['Google_Sans_Display',sans-serif] text-[#202124] leading-tight mt-2">₹5,000</div>
                            <div className="text-[12px] font-['Roboto',sans-serif] text-[#5f6368]">Estimated Cost</div>

                            <hr className="my-4 border-[#dadce0]" />

                            <div className="space-y-2">
                                <div className="flex justify-between text-[13px] font-['Roboto',sans-serif] text-[#5f6368]">
                                    <span>Parts: AC compressor</span>
                                    <span className="border-b border-dotted border-[#dadce0] flex-grow mx-2 relative top-[-6px]"></span>
                                    <span className="text-[#202124] font-medium">₹3,500</span>
                                </div>
                                <div className="flex justify-between text-[13px] font-['Roboto',sans-serif] text-[#5f6368]">
                                    <span>Labor charges</span>
                                    <span className="border-b border-dotted border-[#dadce0] flex-grow mx-2 relative top-[-6px]"></span>
                                    <span className="text-[#202124] font-medium">₹1,500</span>
                                </div>
                            </div>

                            <hr className="my-4 border-[#dadce0]" />

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-[#137333] text-white flex items-center justify-center text-[12px] font-bold">SA</div>
                                <div>
                                    <div className="text-[13px] text-[#202124] font-medium">super_admin_user</div>
                                    <div className="text-[12px] text-[#5f6368]">Feb 22, 2026</div>
                                </div>
                            </div>

                            <div className="bg-[#e6f4ea] border-l-[3px] border-[#137333] p-3 rounded-[8px] text-[13px] font-['Roboto',sans-serif] italic text-[#137333] mb-5">
                                "Approved for execution. Standard maintenance work."
                            </div>

                            <div className="inline-flex py-1.5 px-3 rounded-[50px] bg-[#e6f4ea] text-[#137333] text-[12px] font-medium items-center gap-1.5">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Approved — Work can begin
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center h-[300px]">
                            <div className="w-16 h-16 bg-[#f1f3f4] rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-[#9aa0a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h4 className="text-[16px] font-['Google_Sans',sans-serif] font-medium text-[#202124] mb-2">Quotation Pending</h4>
                            <p className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] max-w-[200px]">
                                Super Admin will review and send a cost estimate soon.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* FLOATING ACTION BUTTON */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-3.5 rounded-[50px] font-['Google_Sans',sans-serif] text-[14px] font-medium shadow-[0_4px_12px_rgba(26,115,232,0.4)] hover:shadow-[0_6px_16px_rgba(26,115,232,0.5)] transition-all transform hover:scale-[1.02] z-50 flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                New Request
            </button>

            {/* NEW REQUEST MODAL */}
            <NewRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default UserDashboard;
