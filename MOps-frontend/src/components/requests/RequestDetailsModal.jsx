import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { quotationService } from '../../services/materialService';

const RequestDetailsModal = ({ isOpen, onClose, request, onSuccess }) => {
    const [isApproving, setIsApproving] = useState(false);
    const [approveError, setApproveError] = useState('');
    const [fetchedMaterials, setFetchedMaterials] = useState(null); // null = not fetched yet

    // If request.materials is empty but a quotation exists, fetch materials directly
    useEffect(() => {
        if (!isOpen || !request) return;
        const hasQuotationData = request.totalEstimatedCost != null || (request.estimatedDays != null);
        const hasMaterials = request.materials && request.materials.length > 0;
        if (hasQuotationData && !hasMaterials) {
            quotationService.getQuotation(request.id)
                .then(q => setFetchedMaterials(q.materials || []))
                .catch(() => setFetchedMaterials([]));
        } else {
            setFetchedMaterials(request.materials || []);
        }
    }, [isOpen, request?.id, request?.totalEstimatedCost]);

    if (!isOpen || !request) return null;

    const status = request.status;
    const isRequestCreated = status === 'REQUEST_CREATED';
    const isQuotationAdded = status === 'QUOTATION_ADDED';
    const isQuotationApproved = status === 'QUOTATION_APPROVED';
    const isApproved = status === 'APPROVED';
    const isPendingSA = status === 'PENDING_SA_APPROVAL';
    const isVendorListApproved = status === 'VENDOR_LIST_APPROVED';
    const isItemsReady = status === 'ITEMS_READY';
    const isInProduction = status === 'IN_PRODUCTION';
    const isPaymentPending = status === 'PAYMENT_PENDING';
    const isCompleted = status === 'COMPLETED';

    const materials = fetchedMaterials ?? request.materials ?? [];
    const totalCost = request.totalEstimatedCost ?? request.quotationAmount;

    // Show quotation panel whenever any quotation data exists
    const hasQuotation = totalCost != null || materials.length > 0 || request.estimatedDays != null;

    const handleApproveQuotation = async () => {
        setIsApproving(true);
        setApproveError('');
        try {
            await quotationService.userApproveQuotation(request.id);
            setIsApproving(false);
            if (onSuccess) onSuccess();
        } catch (err) {
            setApproveError(err.message || 'Failed to approve quotation');
            setIsApproving(false);
        }
    };

    const getDeptChip = (dept) => {
        const map = {
            Electrical: 'bg-[#fce8e6] text-[#c5221f]',
            Carpentry: 'bg-[#fff8e1] text-[#f9ab00]',
            Plumbing: 'bg-[#e6f4ea] text-[#137333]',
            EM: 'bg-[#e6f4ea] text-[#137333]',
        };
        return (
            <span className={`inline-block px-3 py-[4px] rounded-[50px] text-[12px] ${map[dept] || 'bg-[#f1f3f4] text-[#5f6368]'}`}>
                {dept}
            </span>
        );
    };

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

    // Timeline steps
    // Timeline steps covering all 10 statuses
    const pastQuotationAdded = !isRequestCreated;
    const pastQuotationApproved = !isRequestCreated && !isQuotationAdded;
    const pastApproved = isApproved || isPendingSA || isVendorListApproved || isItemsReady || isInProduction || isPaymentPending || isCompleted;
    const pastListGenerated = isPendingSA || isVendorListApproved || isItemsReady || isInProduction || isPaymentPending || isCompleted;
    const pastVendorApproved = isVendorListApproved || isItemsReady || isInProduction || isPaymentPending || isCompleted;
    const pastItemsReady = isItemsReady || isInProduction || isPaymentPending || isCompleted;
    const pastInProduction = isInProduction || isPaymentPending || isCompleted;
    const pastPaymentPending = isPaymentPending || isCompleted;

    const steps = [
        { label: 'Request Created', sub: request.date, done: true },
        { label: 'Quotation Added by Admin', sub: pastQuotationAdded ? 'Materials & costs assessed' : 'Awaiting admin review', done: pastQuotationAdded },
        { label: 'Quotation Approved by SA', sub: pastQuotationApproved ? 'Ready for your review' : 'Awaiting SA sign-off', done: pastQuotationApproved, active: isQuotationApproved },
        { label: 'You Accepted the Quotation', sub: pastApproved ? 'Quotation accepted' : 'Pending your approval', done: pastApproved, active: isQuotationApproved },
        { label: 'Lists Generated', sub: pastListGenerated ? 'Material & vendor lists created' : 'Pending', done: pastListGenerated },
        { label: 'Vendor Lists Approved', sub: pastVendorApproved ? 'Procurement authorized' : 'Awaiting SA approval', done: pastVendorApproved },
        { label: 'Items Procured', sub: pastItemsReady ? '✅ All materials received' : 'Procurement in progress', done: pastItemsReady },
        { label: 'In Production', sub: pastInProduction ? 'Work in progress' : 'Pending', done: pastInProduction, active: isInProduction },
        { label: 'Payment Pending', sub: pastPaymentPending ? 'Production complete' : 'Pending', done: pastPaymentPending },
        { label: 'Completed', sub: isCompleted ? '✅ Request closed' : 'Pending', done: isCompleted },
    ];

    const progressFraction = steps.reduce((n, s) => n + (s.done ? 1 : 0), 0) - 1;
    const progressPct = Math.max(0, Math.min(100, (progressFraction / (steps.length - 1)) * 100));

    return createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[100] flex items-center justify-center p-4 overflow-y-auto pt-20">
            <div className="bg-[#f8f9fa] rounded-[24px] w-full max-w-[960px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] flex flex-col relative my-auto animate-fadeUp overflow-hidden max-h-[90vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#e8f0fe] via-white to-white px-8 py-6 border-b border-[#dadce0] flex justify-between items-center sticky top-0 z-20">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-[22px] font-bold font-['Google_Sans_Display',sans-serif] text-[#1a73e8]">{request.requestNumber || request.id}</h2>
                            {getDeptChip(request.serviceDepartmentName || request.dept)}
                            {isQuotationApproved && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[50px] bg-[#fff8e1] text-[#f9ab00] text-[12px] font-semibold animate-pulse">
                                    ✉️ Action Required
                                </span>
                            )}
                        </div>
                        <p className="text-[14px] font-medium font-['Roboto',sans-serif] text-[#3c4043]">{request.itemDescription || request.desc}</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#e8eaed] hover:text-[#202124] transition-all shadow-sm border border-transparent hover:border-[#dadce0]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* QUOTATION_APPROVED Banner — user needs to accept */}
                {isQuotationApproved && (
                    <div className="px-8 py-4 bg-[#fff8e1] border-b border-[#fde68a] flex items-center justify-between gap-4">
                        <div>
                            <div className="text-[14px] font-semibold text-[#b45309]">✉️ Your quotation is ready for review! Please check the details below.</div>
                            <div className="text-[13px] text-[#92400e]">
                                Total: <strong>₹{Number(totalCost ?? 0).toFixed(2)}</strong>
                                {request.requiredDate && <span> · Required by: <strong>{fmtDate(request.requiredDate)}</strong></span>}
                            </div>
                        </div>
                        <button onClick={handleApproveQuotation} disabled={isApproving}
                            className="flex-shrink-0 bg-[#137333] hover:bg-[#0d652d] text-white px-5 py-[9px] rounded-[50px] text-[13px] font-semibold transition-all shadow-sm disabled:opacity-70">
                            {isApproving ? 'Approving...' : '✅ Accept Quotation'}
                        </button>
                    </div>
                )}
                {approveError && (
                    <div className="px-8 py-3 bg-[#fce8e6] text-[#c5221f] text-[13px] border-b border-[#fad2cf]">{approveError}</div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-hidden p-8 flex flex-col lg:flex-row gap-6 bg-[#f8f9fa]">

                    {/* LEFT: Timeline */}
                    <div className="w-full lg:w-[38%] bg-white rounded-[20px] shadow-sm border border-[#dadce0]/60 p-6 flex-shrink-0 overflow-y-auto custom-scrollbar max-h-[300px] lg:max-h-[calc(90vh-180px)]">
                        <h3 className="text-[16px] font-['Google_Sans',sans-serif] text-[#202124] font-medium mb-7 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            Status
                        </h3>
                        <div className="relative pl-3">
                            <div className="absolute left-[23.5px] top-3 bottom-3 w-[2px] bg-[#dadce0]" />
                            <div className="absolute left-[23.5px] top-3 w-[2px] bg-[#137333] transition-all duration-700" style={{ height: `calc(${progressPct}% - 12px)` }} />
                            {steps.map((step, i) => (
                                <div key={i} className={`flex gap-4 mb-6 relative z-10 ${i === steps.length - 1 ? 'mb-0' : ''}`}>
                                    <div className={`w-6 h-6 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all
                                        ${step.done ? 'bg-[#137333] border-[#137333]' : step.active ? 'bg-[#1a73e8] border-[#1a73e8] animate-pulse' : 'border-[#dadce0] bg-white'}`}>
                                        {step.done && (
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <div className={`text-[13px] font-['Google_Sans',sans-serif] ${step.done || step.active ? 'font-medium text-[#202124]' : 'text-[#9aa0a6]'}`}>{step.label}</div>
                                        {step.sub && <div className="text-[11px] text-[#5f6368] mt-0.5">{step.sub}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Full Quotation Details */}
                    <div className="w-full bg-white rounded-[20px] shadow-sm border border-[#dadce0]/60 p-6 relative overflow-y-auto custom-scrollbar max-h-[70vh] lg:max-h-[calc(90vh-180px)] flex-1">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#1a73e8]/5 to-transparent rounded-bl-[100px] pointer-events-none" />

                        <h3 className="text-[16px] font-['Google_Sans',sans-serif] text-[#202124] font-medium mb-5 flex items-center gap-2 relative z-10">
                            <svg className="w-5 h-5 text-[#f9ab00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                            </svg>
                            Quotation Details
                        </h3>

                        {hasQuotation ? (
                            <div className="relative z-10 space-y-5">

                                {/* Summary chips */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#e8f0fe]/60 rounded-[12px] p-3 border border-[#1a73e8]/15">
                                        <div className="text-[11px] text-[#1a73e8] font-medium mb-1">Total Estimated Cost</div>
                                        <div className="text-[22px] font-bold text-[#1a73e8]">₹{Number(totalCost ?? 0).toFixed(2)}</div>
                                    </div>
                                    <div className="bg-[#f0faf3]/60 rounded-[12px] p-3 border border-[#137333]/15">
                                        <div className="text-[11px] text-[#137333] font-medium mb-1">📅 Required By</div>
                                        <div className="text-[18px] font-bold text-[#137333]">{fmtDate(request.requiredDate)}</div>
                                    </div>
                                </div>

                                {/* Full material breakdown — same columns as SA */}
                                {materials.length > 0 && (
                                    <div>
                                        <div className="text-[12px] font-semibold text-[#5f6368] mb-2 uppercase tracking-wide">Material Breakdown</div>
                                        <div className="border border-[#dadce0] rounded-[12px] overflow-auto custom-scrollbar">
                                            <table className="w-full text-[12px] min-w-[500px]">
                                                <thead className="bg-[#f8f9fa] border-b border-[#dadce0]">
                                                    <tr>
                                                        <th className="px-3 py-2.5 text-left text-[#5f6368] font-medium">Item</th>
                                                        <th className="px-3 py-2.5 text-right text-[#5f6368] font-medium">Qty</th>
                                                        <th className="px-3 py-2.5 text-right text-[#5f6368] font-medium">Unit ₹</th>
                                                        <th className="px-3 py-2.5 text-left text-[#5f6368] font-medium">Vendor</th>
                                                        <th className="px-3 py-2.5 text-right text-[#5f6368] font-medium">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {materials.map((m, i) => (
                                                        <tr key={i} className="border-t border-[#f1f3f4] hover:bg-[#fafafa]">
                                                            <td className="px-3 py-2.5">
                                                                <div className="font-medium text-[#202124]">{m.materialName}</div>
                                                                {m.specification && <div className="text-[10px] text-[#5f6368]">{m.specification}</div>}
                                                            </td>
                                                            <td className="px-3 py-2.5 text-right">{m.quantity} {m.unit}</td>
                                                            <td className="px-3 py-2.5 text-right">₹{Number(m.unitPrice ?? 0).toFixed(2)}</td>
                                                            <td className="px-3 py-2.5 text-[#5f6368] text-[11px]">{m.vendorName || '—'}</td>
                                                            <td className="px-3 py-2.5 text-right font-semibold">₹{Number(m.totalPrice ?? 0).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-[#f8f9fa] border-t-2 border-[#dadce0]">
                                                    <tr>
                                                        <td colSpan={4} className="px-3 py-2.5 text-right font-semibold text-[#5f6368]">Grand Total</td>
                                                        <td className="px-3 py-2.5 text-right font-bold text-[#1a73e8]">₹{Number(totalCost ?? 0).toFixed(2)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* SA Remarks */}
                                {request.superAdminRemarks && (
                                    <div className="bg-[#e8f0fe]/50 rounded-[10px] p-3 border border-[#1a73e8]/10">
                                        <div className="text-[11px] text-[#1a73e8] font-semibold mb-1 uppercase tracking-wide">Approval Note</div>
                                        <p className="text-[13px] text-[#3c4043]">{request.superAdminRemarks}</p>
                                    </div>
                                )}

                                {/* Authorized By */}
                                {request.superAdminName && (
                                    <div className="bg-[#fef7e0]/50 rounded-[12px] p-3 border border-[#fef0c3] flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#f9ab00] flex items-center justify-center text-white font-bold text-[15px] flex-shrink-0">
                                            {request.superAdminName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-[#ea8600] font-semibold uppercase tracking-wide">Authorized By</div>
                                            <div className="text-[14px] font-medium text-[#202124]">{request.superAdminName}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="w-16 h-16 bg-[#f1f3f4] rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-[#9aa0a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-[16px] font-['Google_Sans',sans-serif] font-medium text-[#202124] mb-2">Quotation Pending</h4>
                                <p className="text-[13px] font-['Roboto',sans-serif] text-[#5f6368] max-w-[240px]">
                                    The admin is preparing a material-based quotation. You'll be notified once it's ready.
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
