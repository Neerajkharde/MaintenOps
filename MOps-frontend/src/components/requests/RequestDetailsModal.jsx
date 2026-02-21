import React from 'react';
import { createPortal } from 'react-dom';
import { formatDate } from '../../utils/dateUtils';

const RequestDetailsModal = ({ isOpen, onClose, request }) => {
    if (!isOpen || !request) return null;

    const getDeptChip = (dept) => {
        switch (dept) {
            case 'Electrical': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#fce8e6] text-[#c5221f] text-[12px]">Electrical</span>;
            case 'Carpentry': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#fff8e1] text-[#f9ab00] text-[12px]">Carpentry</span>;
            case 'Plumbing': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#e6f4ea] text-[#137333] text-[12px]">Plumbing</span>;
            case 'EM': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#e6f4ea] text-[#137333] text-[12px]">EM</span>;
            default: return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#f1f3f4] text-[#5f6368] text-[12px]">{dept}</span>;
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[100] flex items-center justify-center p-4 overflow-y-auto pt-20">
            <div className="bg-[#f8f9fa] rounded-[24px] w-full max-w-[900px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] flex flex-col relative my-auto animate-fadeUp overflow-hidden max-h-[90vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#e8f0fe] via-white to-white px-8 py-6 border-b border-[#dadce0] flex justify-between items-center sticky top-0 z-20">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-[22px] font-bold font-['Google_Sans_Display',sans-serif] text-[#1a73e8]">{request.id}</h2>
                            {getDeptChip(request.dept)}
                        </div>
                        <p className="text-[14px] font-medium font-['Roboto',sans-serif] text-[#3c4043]">{request.desc}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#e8eaed] hover:text-[#202124] transition-all shadow-sm border border-transparent hover:border-[#dadce0]"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex flex-col lg:flex-row gap-8 bg-[#f8f9fa]">
                    {/* LEFT: Timeline */}
                    <div className="w-full lg:w-[55%] bg-white rounded-[20px] shadow-sm border border-[#dadce0]/60 p-7 hover:shadow-md transition-shadow">
                        <h3 className="text-[18px] font-['Google_Sans',sans-serif] text-[#202124] font-medium mb-8 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                            Status Tracker
                        </h3>

                        {(() => {
                            const isSubmitted = request?.status === 'SUBMITTED';
                            const isPendingSA = request?.status === 'PENDING_SA_APPROVAL';
                            const isApproved = request?.status === 'APPROVED';

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
                                            <div className="text-[12px] font-['Roboto',sans-serif] text-[#5f6368]">{request.date}</div>
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
                    <div className="w-full lg:w-[45%] bg-white rounded-[20px] shadow-sm border border-[#dadce0]/60 p-7 hover:shadow-md transition-shadow relative overflow-hidden">
                        {/* Soft background decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1a73e8]/5 to-[#1a73e8]/0 rounded-bl-[100px] pointer-events-none"></div>

                        <h3 className="text-[18px] font-['Google_Sans',sans-serif] text-[#202124] font-medium mb-8 flex items-center gap-2 relative z-10">
                            <svg className="w-5 h-5 text-[#f9ab00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>
                            Quotation Details
                        </h3>

                        {request.status === 'APPROVED' ? (
                            <div className="relative z-10">
                                <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-5">
                                    <div className="group">
                                        <label className="block text-[13px] font-medium font-['Roboto',sans-serif] text-[#5f6368] mb-2 group-hover:text-[#1a73e8] transition-colors">Estimated Cost</label>
                                        <div className="w-full h-[48px] rounded-[10px] border border-[#1a73e8]/20 bg-[#f8fafe] flex items-center px-4 text-[#1a73e8] text-[16px] font-bold font-['Roboto',sans-serif] shadow-sm group-hover:border-[#1a73e8]/50 transition-colors">
                                            {request.quotationAmount ? `₹${request.quotationAmount.toLocaleString()}` : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-[13px] font-medium font-['Roboto',sans-serif] text-[#5f6368] mb-2 group-hover:text-[#137333] transition-colors">Required Date</label>
                                        <div className="w-full h-[48px] rounded-[10px] border border-[#137333]/20 bg-[#e6f4ea]/50 flex items-center px-4 text-[#137333] text-[15px] font-medium font-['Roboto',sans-serif] shadow-sm group-hover:border-[#137333]/50 transition-colors bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTM3MzMzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgb3BhY2l0eT0iMC4yIj48cmVjdCB4PSIzIiB5PSI0IiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiIvPjxsaW5lIHgxPSIxNiIgeTE9IjIiIHgyPSIxNiIgeTI9IjYiLz48bGluZSB4MT0iOCIgeTE9IjIiIHgyPSI4IiB5Mj0iNiIvPjxsaW5lIHgxPSIzIiB5MT0iMTAiIHgyPSIyMSIgeTI9IjEwIi8+PC9zdmc+')] bg-no-repeat bg-[right_12px_center] bg-[length:18px]">
                                            {request.requiredDate ? formatDate(request.requiredDate) : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {request.quotationDescription && (
                                    <div className="mb-6 group">
                                        <label className="block text-[13px] font-medium font-['Roboto',sans-serif] text-[#5f6368] mb-2 group-hover:text-[#202124] transition-colors">Quotation Description</label>
                                        <div className="w-full min-h-[48px] rounded-[10px] border border-[#dadce0] bg-[#f8f9fa] p-4 text-[#3c4043] text-[14px] leading-relaxed font-['Roboto',sans-serif] group-hover:border-[#bdc1c6] transition-colors relative">
                                            {/* decorative quote mark */}
                                            <div className="absolute -top-2 -left-1 text-[24px] text-[#dadce0] leading-none select-none">"</div>
                                            <span className="relative z-10">{request.quotationDescription}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
                                    <div className="group opacity-50 hover:opacity-100 transition-opacity cursor-not-allowed">
                                        <label className="block text-[13px] font-medium font-['Roboto',sans-serif] text-[#5f6368] mb-2">Work Completed</label>
                                        <div className="w-full h-[48px] rounded-[10px] border border-dashed border-[#dadce0] bg-[#f1f3f4] flex items-center px-4 text-[#9aa0a6] text-[14px] italic">
                                            Pending...
                                        </div>
                                    </div>
                                    <div className="group opacity-50 hover:opacity-100 transition-opacity cursor-not-allowed">
                                        <label className="block text-[13px] font-medium font-['Roboto',sans-serif] text-[#5f6368] mb-2">IDT Amount</label>
                                        <div className="w-full h-[48px] rounded-[10px] border border-dashed border-[#dadce0] bg-[#f1f3f4] flex items-center px-4 text-[#9aa0a6] text-[14px] italic">
                                            Pending...
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#fef7e0]/50 rounded-[12px] p-4 border border-[#fef0c3]">
                                    <label className="block text-[12px] font-medium font-['Roboto',sans-serif] text-[#ea8600] mb-2 uppercase tracking-wide">Authorized Signature</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#f9ab00] flex items-center justify-center text-white font-bold text-[14px] shadow-sm">
                                            {request.superAdminName ? request.superAdminName.charAt(0) : 'SA'}
                                        </div>
                                        <div className="text-[#202124] text-[16px] font-medium font-['Google_Sans_Display',sans-serif]">
                                            {request.superAdminName || 'Pending'}
                                        </div>
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
