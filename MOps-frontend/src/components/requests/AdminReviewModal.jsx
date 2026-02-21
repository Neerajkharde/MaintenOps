import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { requestService } from '../../services/requestService';
import { formatDate } from '../../utils/dateUtils';

const AdminReviewModal = ({ isOpen, onClose, request, onSuccess }) => {
    const [requiredDate, setRequiredDate] = useState('');
    const [adminRemarks, setAdminRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !request) return null;

    const handleSubmit = async () => {
        if (!requiredDate || !adminRemarks.trim()) {
            setError('Both Required Date and Remarks are mandatory.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await requestService.submitAdminReview({
                requestId: request.id,
                requiredDate: new Date(requiredDate).toISOString(),
                adminRemarks: adminRemarks,
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
                        <h2 className="text-[20px] font-['Google_Sans_Display',sans-serif] text-[#202124]">Admin Review</h2>
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
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[12px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Requester</label>
                                <div className="text-[14px] font-medium text-[#202124]">{request.requesterName}</div>
                            </div>
                            <div>
                                <label className="block text-[12px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Mobile No</label>
                                <div className="text-[14px] font-medium text-[#202124]">{request.mobileNumber}</div>
                            </div>
                            <div>
                                <label className="block text-[12px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Service Dept</label>
                                <div className="inline-block px-3 py-[4px] rounded-[50px] bg-[#e6f4ea] text-[#137333] text-[12px] font-medium">{request.serviceDepartmentName}</div>
                            </div>
                            <div>
                                <label className="block text-[12px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Created At</label>
                                <div className="text-[14px] font-medium text-[#202124]">{new Date(request.createdAt).toLocaleString()}</div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-['Roboto',sans-serif] text-[#5f6368] mb-1">Description</label>
                            <p className="text-[14px] text-[#202124] p-3 bg-white rounded-[8px] border border-[#dadce0] leading-relaxed">
                                {request.itemDescription}
                            </p>
                        </div>

                        {request.urgencyRequested && (
                            <div className="mt-4 p-3 bg-[#fce8e6] rounded-[8px] border border-[#fad2cf]">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-4 h-4 text-[#c5221f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span className="text-[13px] font-bold text-[#c5221f]">Urgent Request</span>
                                </div>
                                <p className="text-[13px] text-[#c5221f] ml-6">{request.urgencyReason}</p>
                            </div>
                        )}
                    </div>

                    <h3 className="text-[16px] font-['Google_Sans',sans-serif] font-medium text-[#202124] mb-4">Your Assessment</h3>

                    {/* Interactive Review Form */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-[13px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1.5">Required Date <span className="text-[#c5221f]">*</span></label>
                            <input
                                type="date"
                                value={requiredDate}
                                onChange={(e) => setRequiredDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full h-11 px-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8] focus:shadow-[0_0_0_3px_rgba(26,115,232,0.12)]"
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1.5">Admin Remarks <span className="text-[#c5221f]">*</span></label>
                            <textarea
                                rows={4}
                                value={adminRemarks}
                                onChange={(e) => setAdminRemarks(e.target.value)}
                                placeholder="Enter feasibility assessment, team availability, etc."
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
                        {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
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

export default AdminReviewModal;
