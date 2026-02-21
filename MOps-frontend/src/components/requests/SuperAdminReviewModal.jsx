import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { requestService } from '../../services/requestService';
import { formatDate } from '../../utils/dateUtils';

const SuperAdminReviewModal = ({ isOpen, onClose, request, onSuccess }) => {
    const [quotationAmount, setQuotationAmount] = useState('');
    const [quotationDescription, setQuotationDescription] = useState('');
    const [superAdminRemarks, setSuperAdminRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !request) return null;

    const handleSubmit = async () => {
        if (!quotationAmount || !quotationDescription.trim() || !superAdminRemarks.trim()) {
            setError('All fields (Amount, Description, Remarks) are mandatory.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await requestService.submitSuperAdminReview({
                requestId: request.id,
                quotationAmount: parseFloat(quotationAmount),
                quotationDescription: quotationDescription,
                superAdminRemarks: superAdminRemarks,
                approved: true
            });
            onSuccess();
        } catch (err) {
            console.error('Submit review failed:', err);
            setError(err.message || 'Failed to submit review');
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] w-full max-w-[600px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] flex flex-col relative my-auto animate-fadeUp overflow-hidden">

                {/* Header */}
                <div className="px-8 py-6 border-b border-[#dadce0] flex justify-between items-center bg-[#f8f9fa]">
                    <div>
                        <h2 className="text-[20px] font-['Google_Sans_Display',sans-serif] text-[#202124]">Super Admin Approval</h2>
                        <p className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368]">Request {request.requestNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#e8eaed] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[70vh]">

                    {/* Read-only Request Info */}
                    <div className="mb-6 bg-[#f8f9fa] border border-[#f1f3f4] rounded-[16px] p-5">
                        <div className="grid grid-cols-2 gap-4 mb-4 border-b border-[#dadce0] pb-4">
                            <div>
                                <label className="block text-[12px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Requester</label>
                                <div className="text-[14px] font-medium text-[#202124]">{request.requesterName}</div>
                            </div>
                            <div>
                                <label className="block text-[12px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Service Dept</label>
                                <div className="inline-block px-3 py-[4px] rounded-[50px] bg-[#e6f4ea] text-[#137333] text-[12px] font-medium">{request.serviceDepartmentName}</div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Description</label>
                            <p className="text-[14px] text-[#202124] mb-4">
                                {request.itemDescription}
                            </p>
                        </div>

                        {/* Admin Assessment Section */}
                        <div className="bg-white border border-[#1a73e8]/20 rounded-[8px] p-4 mt-2">
                            <h4 className="text-[13px] font-bold text-[#1a73e8] mb-2 uppercase tracking-wide">Admin Assessment</h4>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-[11px] text-[#5f6368] mb-1">Reviewed By</label>
                                    <div className="text-[13px] font-medium">{request.adminName || 'Admin'}</div>
                                </div>
                                <div>
                                    <label className="block text-[11px] text-[#5f6368] mb-1">Required Date</label>
                                    <div className="text-[13px] font-medium">{request.requiredDate ? formatDate(request.requiredDate) : 'N/A'}</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] text-[#5f6368] mb-1">Admin Remarks</label>
                                <div className="text-[13px] bg-[#f8f9fa] p-2 rounded text-[#3c4043]">{request.adminRemarks || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-[16px] font-['Google_Sans',sans-serif] font-medium text-[#202124] mb-4">Provide Quotation</h3>

                    {/* Interactive Review Form */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-[13px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1.5">Estimated Cost (₹) <span className="text-[#c5221f]">*</span></label>
                            <input
                                type="number"
                                value={quotationAmount}
                                onChange={(e) => setQuotationAmount(e.target.value)}
                                min="0" step="0.01"
                                placeholder="0.00"
                                className="w-full h-11 px-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8] focus:shadow-[0_0_0_3px_rgba(26,115,232,0.12)]"
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1.5">Quotation Breakdown <span className="text-[#c5221f]">*</span></label>
                            <textarea
                                rows={2}
                                value={quotationDescription}
                                onChange={(e) => setQuotationDescription(e.target.value)}
                                placeholder="e.g. Parts (₹3500), Labor (₹1500)"
                                className="w-full p-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8] focus:shadow-[0_0_0_3px_rgba(26,115,232,0.12)] resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1.5">Super Admin Remarks <span className="text-[#c5221f]">*</span></label>
                            <textarea
                                rows={3}
                                value={superAdminRemarks}
                                onChange={(e) => setSuperAdminRemarks(e.target.value)}
                                placeholder="Final approval notes or conditions."
                                className="w-full p-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8] focus:shadow-[0_0_0_3px_rgba(26,115,232,0.12)] resize-none"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-[#fce8e6] border border-[#c5221f] rounded-[8px] text-[#c5221f] text-[13px]">
                                {error}
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="px-8 py-5 border-t border-[#dadce0] bg-[#f8f9fa] flex flex-row-reverse gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-[10px] rounded-[50px] font-['Google_Sans',sans-serif] text-[14px] font-medium transition-all shadow-md flex items-center justify-center min-w-[140px] disabled:opacity-70"
                    >
                        {isSubmitting ? 'Approving...' : 'Approve & Quote'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-6 py-[10px] rounded-[50px] font-['Google_Sans',sans-serif] text-[14px] font-medium text-[#5f6368] hover:bg-[#e8eaed] transition-colors"
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default SuperAdminReviewModal;
