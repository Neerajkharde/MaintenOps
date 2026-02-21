import React from 'react';
import { createPortal } from 'react-dom';

const RequestDetailsModal = ({ isOpen, onClose, request }) => {
    if (!isOpen || !request) return null;

    const getDeptChip = (dept) => {
        switch (dept) {
            case 'Electrical': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#fce8e6] text-[#c5221f] text-[12px]">Electrical</span>;
            case 'Carpentry': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#fff8e1] text-[#f9ab00] text-[12px]">Carpentry</span>;
            case 'Plumbing': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#e6f4ea] text-[#137333] text-[12px]">Plumbing</span>;
            case 'Estate Management': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#e6f4ea] text-[#137333] text-[12px]">Estate Mgt</span>;
            default: return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#f1f3f4] text-[#5f6368] text-[12px]">{dept}</span>;
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[100] flex items-center justify-center p-4 overflow-y-auto pt-20">
            <div className="bg-[#f8f9fa] rounded-[24px] w-full max-w-[900px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] flex flex-col relative my-auto animate-fadeUp overflow-hidden max-h-[90vh]">

                {/* Header */}
                <div className="bg-white px-8 py-6 border-b border-[#dadce0] flex justify-between items-center sticky top-0 z-20">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-[20px] font-['Google_Sans_Display',sans-serif] text-[#202124]">{request.id}</h2>
                            {getDeptChip(request.dept)}
                        </div>
                        <p className="text-[14px] font-['Roboto',sans-serif] text-[#5f6368]">{request.desc}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex flex-col lg:flex-row gap-6">
                    {/* LEFT: Timeline */}
                    <div className="w-full lg:w-[60%] bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6">
                        <h3 className="text-[16px] font-['Google_Sans',sans-serif] font-medium text-[#202124] mb-6">Status Tracker</h3>

                        <div className="relative pl-3 mt-4">
                            {/* Connecting Line (background) */}
                            <div className="absolute left-[23.5px] top-4 bottom-4 w-[2px] bg-[#dadce0]"></div>
                            {/* Connecting Line (progress) */}
                            <div className="absolute left-[23.5px] top-4 h-[65px] w-[2px] bg-[#137333]"></div>
                            <div className="absolute left-[23.5px] top-[65px] h-[50px] w-[2px] bg-transparent border-l-2 border-dashed border-[#dadce0]"></div>

                            {/* Stage 1 */}
                            <div className="flex gap-4 mb-6 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-[#137333] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div>
                                    <div className="text-[14px] font-['Google_Sans',sans-serif] font-medium text-[#202124]">Request Submitted</div>
                                    <div className="text-[12px] font-['Roboto',sans-serif] text-[#5f6368]">{request.date} · 10:30 AM</div>
                                </div>
                            </div>

                            {/* Stage 2 */}
                            <div className="flex gap-4 mb-6 relative z-10">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${request.adminReviewedAt ? 'bg-[#137333]' : 'border-2 border-[#dadce0] bg-white'}`}>
                                    {request.adminReviewedAt && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div className={!request.adminReviewedAt ? 'opacity-70' : ''}>
                                    <div className={`text-[14px] font-['Google_Sans',sans-serif] ${request.adminReviewedAt ? 'font-medium text-[#202124]' : 'text-[#9aa0a6]'}`}>Admin Reviewed</div>
                                    {request.adminReviewedAt && (
                                        <>
                                            <div className="text-[12px] font-['Roboto',sans-serif] text-[#5f6368]">
                                                {new Date(request.adminReviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {request.adminName}
                                            </div>
                                            {request.adminRemarks && (
                                                <div className="mt-2 bg-[#f8f9fa] p-3 rounded-[8px] text-[13px] font-['Roboto',sans-serif] italic text-[#5f6368] border border-[#f1f3f4]">
                                                    "{request.adminRemarks}"
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Stage 3 (Current) */}
                            <div className="flex gap-4 mb-6 relative z-10">
                                {request.status === 'APPROVED' ? (
                                    <div className="w-6 h-6 rounded-full bg-[#137333] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-[#1a73e8] flex-shrink-0 mt-0.5 animate-pulseBlue border-2 border-white"></div>
                                )}
                                <div>
                                    <div className={`text-[14px] font-['Google_Sans',sans-serif] font-medium ${request.status === 'APPROVED' ? 'text-[#202124]' : 'text-[#1a73e8]'}`}>
                                        {request.status === 'APPROVED' ? 'Quotation Approved' : 'Awaiting Super Admin'}
                                    </div>
                                    <div className="text-[12px] font-['Roboto',sans-serif] text-[#5f6368]">
                                        {request.status === 'APPROVED' ? 'Quotation reviewed' : 'Quotation pending'}
                                    </div>
                                    {request.status !== 'APPROVED' && (
                                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[50px] bg-[#fef9e7] text-[#f9ab00] text-[12px] font-medium">
                                            <span>⏳</span> Usually takes 1-2 business days
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stage 4 */}
                            <div className="flex gap-4 mb-6 relative z-10 opacity-70">
                                <div className="w-6 h-6 rounded-full border-2 border-[#dadce0] bg-white flex-shrink-0 mt-0.5"></div>
                                <div>
                                    <div className="text-[14px] font-['Google_Sans',sans-serif] text-[#9aa0a6]">Approval & Quotation</div>
                                </div>
                            </div>

                            {/* Stage 5 */}
                            <div className="flex gap-4 mb-6 relative z-10 opacity-70">
                                <div className="w-6 h-6 rounded-full border-2 border-[#dadce0] bg-white flex-shrink-0 mt-0.5"></div>
                                <div>
                                    <div className="text-[14px] font-['Google_Sans',sans-serif] text-[#9aa0a6]">Work in Progress</div>
                                </div>
                            </div>

                            {/* Stage 6 */}
                            <div className="flex gap-4 relative z-10 opacity-70">
                                <div className="w-6 h-6 rounded-full border-2 border-[#dadce0] bg-white flex-shrink-0 mt-0.5"></div>
                                <div>
                                    <div className="text-[14px] font-['Google_Sans',sans-serif] text-[#9aa0a6]">Completed</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Quotation Card */}
                    <div className="w-full lg:w-[40%] bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6">
                        <h3 className="text-[16px] font-['Google_Sans',sans-serif] font-medium text-[#202124] mb-6">Quotation Details</h3>

                        {request.status === 'APPROVED' ? (
                            <div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-4">
                                    <div>
                                        <label className="block text-[13px] font-['Roboto',sans-serif] text-[#dadce0] mb-2">Estimated Cost</label>
                                        <div className="w-full h-11 rounded-[8px] border-[1.5px] border-dashed border-[#dadce0] bg-transparent flex items-center px-4 text-[#202124] text-[14px] font-medium font-['Roboto',sans-serif]">
                                            {request.quotationAmount ? `₹${request.quotationAmount.toLocaleString()}` : 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-['Roboto',sans-serif] text-[#dadce0] mb-2">Required Date</label>
                                        <div className="w-full h-11 rounded-[8px] border-[1.5px] border-dashed border-[#dadce0] bg-transparent flex items-center px-4 text-[#202124] text-[14px] font-medium font-['Roboto',sans-serif]">
                                            {request.requiredDate ? new Date(request.requiredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {request.quotationDescription && (
                                    <>
                                        <hr className="my-5 border-[#f1f3f4]" />
                                        <div className="mb-5">
                                            <label className="block text-[13px] font-['Roboto',sans-serif] text-[#dadce0] mb-2">Quotation Description</label>
                                            <div className="w-full min-h-11 rounded-[8px] border-[1.5px] border-dashed border-[#dadce0] bg-transparent p-4 text-[#202124] text-[13px] font-['Roboto',sans-serif]">
                                                {request.quotationDescription}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <hr className="my-5 border-[#f1f3f4]" />

                                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5">
                                    <div>
                                        <label className="block text-[13px] font-['Roboto',sans-serif] text-[#dadce0] mb-2">Work Completed Date</label>
                                        <div className="w-full h-11 rounded-[8px] border-[1.5px] border-dashed border-[#dadce0] bg-transparent flex items-center px-4 text-[#202124] text-[14px] font-medium font-['Roboto',sans-serif]">
                                            {/* To be filled by user later */}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-['Roboto',sans-serif] text-[#dadce0] mb-2">IDT Amount</label>
                                        <div className="w-full h-11 rounded-[8px] border-[1.5px] border-dashed border-[#dadce0] bg-transparent flex items-center px-4 text-[#202124] text-[14px] font-medium font-['Roboto',sans-serif]">
                                            {/* To be filled by user later */}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[13px] font-['Roboto',sans-serif] text-[#dadce0] mb-2">Sign (Super Admin)</label>
                                    <div className="w-full h-11 rounded-[8px] border-[1.5px] border-dashed border-[#dadce0] bg-transparent flex items-center px-4 text-[#202124] text-[14px] font-medium font-['Google_Sans_Display',sans-serif] italic">
                                        {request.superAdminName || 'Pending'}
                                    </div>
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
            </div>
        </div>,
        document.body
    );
};

export default RequestDetailsModal;
