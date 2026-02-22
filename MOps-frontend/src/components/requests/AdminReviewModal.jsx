import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';

const AdminReviewModal = ({ isOpen, onClose, request, onSuccess }) => {
    const navigate = useNavigate();
    const [adminRemarks, setAdminRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Auto-compute requiredDate = today + estimatedDays
    // estimatedDays comes from the quotation the admin already created
    const computeRequiredDate = (estimatedDays) => {
        if (!estimatedDays) return '';
        const d = new Date();
        d.setDate(d.getDate() + Number(estimatedDays));
        return d.toISOString().split('T')[0];
    };

    const [requiredDate, setRequiredDate] = useState(() => computeRequiredDate(request?.estimatedDays));

    // Re-compute when request changes (e.g. admin comes back after creating quotation)
    useEffect(() => {
        if (request?.estimatedDays) {
            setRequiredDate(computeRequiredDate(request.estimatedDays));
        }
    }, [request?.estimatedDays]);

    if (!isOpen || !request) return null;

    const hasQuotation = !!request.estimatedDays;

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

                    {/* Request Info */}
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

                    {/* Quotation Summary (if admin already created one) */}
                    {hasQuotation && (
                        <div className="mb-5 p-4 bg-[#e6f4ea] border border-[#ceead6] rounded-[12px]">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-[#137333]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-[13px] font-semibold text-[#137333]">Quotation created</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <div className="text-[11px] text-[#5f6368]">Total Cost</div>
                                    <div className="text-[14px] font-bold text-[#137333]">
                                        ₹{Number(request.totalEstimatedCost || 0).toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-[#5f6368]">Completion Time</div>
                                    <div className="text-[14px] font-bold text-[#137333]">{request.estimatedDays} days</div>
                                </div>
                            </div>
                            <div className="mt-2 text-[12px] text-[#137333]">
                                Required date auto-set to <strong>{requiredDate}</strong> (today + {request.estimatedDays} days)
                            </div>
                        </div>
                    )}

                    <h3 className="text-[16px] font-['Google_Sans',sans-serif] font-medium text-[#202124] mb-4">Your Assessment</h3>

                    <div className="space-y-5">
                        {/* Required Date */}
                        <div>
                            <label className="block text-[13px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1.5">
                                Required Date <span className="text-[#c5221f]">*</span>
                                {hasQuotation && (
                                    <span className="ml-2 text-[11px] text-[#1a73e8] font-normal">Auto-calculated from quotation</span>
                                )}
                            </label>
                            <input
                                type="date"
                                value={requiredDate}
                                onChange={(e) => setRequiredDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full h-11 px-3 border-[1.5px] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8] focus:shadow-[0_0_0_3px_rgba(26,115,232,0.12)] ${hasQuotation ? 'border-[#ceead6] bg-[#f0faf3]' : 'border-[#dadce0]'}`}
                            />
                        </div>

                        {/* Admin Remarks */}
                        <div>
                            <label className="block text-[13px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1.5">
                                Admin Remarks <span className="text-[#c5221f]">*</span>
                            </label>
                            <textarea
                                rows={4}
                                value={adminRemarks}
                                onChange={(e) => setAdminRemarks(e.target.value)}
                                placeholder="Enter feasibility assessment, team availability, etc."
                                className="w-full p-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8] focus:shadow-[0_0_0_3px_rgba(26,115,232,0.12)] resize-none"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-[#fce8e6] border border-[#c5221f] rounded-[8px] text-[#c5221f] text-[13px]">{error}</div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-5 border-t border-[#dadce0] bg-[#f8f9fa] flex flex-row-reverse gap-3">
                    {/* Submit is primary only if quotation is created */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !hasQuotation}
                        title={!hasQuotation ? 'Please create a quotation first' : ''}
                        className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-[10px] rounded-[50px] font-['Google_Sans',sans-serif] text-[14px] font-medium transition-all shadow-md flex items-center justify-center min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            navigate(`/admin/create-quotation/${request.id}`);
                        }}
                        className={`px-6 py-[10px] rounded-[50px] font-['Google_Sans',sans-serif] text-[14px] font-medium transition-colors flex items-center gap-2 ${hasQuotation ? 'bg-[#f0faf3] text-[#137333] hover:bg-[#ceead6]' : 'bg-[#1a73e8] text-white hover:bg-[#1557b0] shadow-md'}`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {hasQuotation ? 'Edit Quotation' : 'Create Quotation'}
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
