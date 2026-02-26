import React, { useState, useEffect } from 'react';
import { quotationService } from '../../services/materialService';
import { downloadQuotationPDF } from '../../utils/downloadUtils';
import { formatDate } from '../../utils/dateUtils';

/**
 * SARequestDetailModal — Full detail slide-over for Super Admin.
 * Shows request metadata, material list table, total cost,
 * and a "Download Quotation" button.
 */
const SARequestDetailModal = ({ isOpen, onClose, request }) => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !request) return;
        let cancelled = false;
        setLoading(true);
        quotationService.getQuotation(request.id)
            .then(data => {
                if (!cancelled) {
                    // data may be the quotation itself or contain .materials
                    const mats = Array.isArray(data) ? data : (data.materials || data.requestMaterials || []);
                    setMaterials(mats);
                }
            })
            .catch(() => { if (!cancelled) setMaterials(request.materials || []); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [isOpen, request]);

    if (!isOpen || !request) return null;

    const totalCost = request.totalEstimatedCost ?? materials.reduce((s, m) => s + Number(m.totalPrice ?? m.estimatedCost ?? 0), 0);
    const statusLabel = (request.status || '').replace(/_/g, ' ');

    const statusColors = {
        REQUEST_CREATED: 'bg-blue-100 text-blue-800',
        QUOTATION_ADDED: 'bg-amber-100 text-amber-800',
        QUOTATION_APPROVED: 'bg-emerald-100 text-emerald-800',
        APPROVED: 'bg-green-100 text-green-800',
        PENDING_SA_APPROVAL: 'bg-orange-100 text-orange-800',
        VENDOR_LIST_APPROVED: 'bg-indigo-100 text-indigo-800',
        ITEMS_READY: 'bg-purple-100 text-purple-800',
        IN_PRODUCTION: 'bg-yellow-100 text-yellow-800',
        PAYMENT_PENDING: 'bg-red-100 text-red-800',
        COMPLETED: 'bg-green-200 text-green-900',
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity" onClick={onClose} />

            {/* Slide-over panel */}
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-[720px] bg-white shadow-2xl z-[100] flex flex-col animate-slideInRight overflow-hidden">

                {/* Header */}
                <div className="flex-shrink-0 px-8 py-6 border-b border-[#dadce0] bg-[#f8f9fa]">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <span className="text-[12px] font-bold text-[#5f6368] tracking-wider uppercase">#{request.requestNumber || request.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${statusColors[request.status] || 'bg-gray-100 text-gray-600'}`}>
                                {statusLabel}
                            </span>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-[#dadce0] flex items-center justify-center transition-colors">
                            <svg className="w-5 h-5 text-[#5f6368]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <h2 className="text-[20px] font-bold text-[#202124] leading-snug mb-1">{request.itemDescription}</h2>
                    <div className="text-[13px] text-[#5f6368]">
                        {request.requesterName} · {request.organizationDepartmentName} · {request.serviceDepartmentName}
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Cost', value: `₹${Number(totalCost || 0).toLocaleString('en-IN')}`, color: 'text-[#1a73e8]' },
                            { label: 'Materials', value: materials.length, color: 'text-[#202124]' },
                            { label: 'Created', value: formatDate(request.createdAt || request.date), color: 'text-[#202124]' },
                            { label: 'Required By', value: formatDate(request.requiredDate) || '—', color: 'text-[#202124]' },
                        ].map((s, i) => (
                            <div key={i} className="bg-[#f8f9fa] rounded-xl p-4 border border-[#dadce0]/50">
                                <div className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider mb-1">{s.label}</div>
                                <div className={`text-[18px] font-bold ${s.color}`}>{s.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    {request.itemDescription && (
                        <div>
                            <h3 className="text-[13px] font-bold text-[#5f6368] uppercase tracking-wider mb-2">Description</h3>
                            <p className="text-[14px] text-[#3c4043] leading-relaxed bg-[#f8f9fa] rounded-lg p-4 border border-[#dadce0]/50">
                                {request.itemDescription}
                            </p>
                        </div>
                    )}

                    {/* Admin / SA Remarks */}
                    {(request.adminRemarks || request.superAdminRemarks) && (
                        <div className="space-y-3">
                            {request.adminRemarks && (
                                <div className="bg-[#e8f0fe] rounded-lg p-4 border border-[#1a73e8]/10">
                                    <div className="text-[10px] font-bold text-[#1a73e8] uppercase tracking-wider mb-1">Admin Remarks</div>
                                    <p className="text-[13px] text-[#202124]">{request.adminRemarks}</p>
                                </div>
                            )}
                            {request.superAdminRemarks && (
                                <div className="bg-[#fef7e0] rounded-lg p-4 border border-[#f9ab00]/10">
                                    <div className="text-[10px] font-bold text-[#f9ab00] uppercase tracking-wider mb-1">Super Admin Remarks</div>
                                    <p className="text-[13px] text-[#202124]">{request.superAdminRemarks}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Material Table */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[13px] font-bold text-[#5f6368] uppercase tracking-wider">Material List</h3>
                            <span className="text-[12px] text-[#5f6368]">{materials.length} items</span>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-4 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : materials.length === 0 ? (
                            <div className="text-center py-12 text-[#5f6368] bg-[#f8f9fa] rounded-xl border border-dashed border-[#dadce0]">
                                <div className="text-3xl mb-2">📋</div>
                                <div className="text-[14px] font-medium">No materials found</div>
                                <div className="text-[12px]">Quotation may not have been created yet</div>
                            </div>
                        ) : (
                            <div className="border border-[#dadce0] rounded-xl overflow-hidden">
                                <table className="w-full text-[13px]">
                                    <thead className="bg-[#f1f3f4]">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">#</th>
                                            <th className="px-4 py-3 text-left text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Material</th>
                                            <th className="px-4 py-3 text-right text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Qty</th>
                                            <th className="px-4 py-3 text-left text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Vendor</th>
                                            <th className="px-4 py-3 text-right text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Rate</th>
                                            <th className="px-4 py-3 text-right text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Total</th>
                                            <th className="px-4 py-3 text-center text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f1f3f4]">
                                        {materials.map((m, i) => (
                                            <tr key={m.id || i} className="hover:bg-[#f8f9fa] transition-colors">
                                                <td className="px-4 py-3 text-[#5f6368]">{i + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-[#202124]">{m.materialName || m.name}</div>
                                                    {(m.specificationText || m.specification) && (
                                                        <div className="text-[11px] text-[#5f6368]">{m.specificationText || m.specification}</div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium">{m.quantity} {m.unit || ''}</td>
                                                <td className="px-4 py-3 text-[#3c4043]">{m.vendorName || m.vendor?.name || '—'}</td>
                                                <td className="px-4 py-3 text-right">₹{Number(m.unitPrice ?? m.ratePerUnit ?? 0).toLocaleString('en-IN')}</td>
                                                <td className="px-4 py-3 text-right font-semibold">₹{Number(m.totalPrice ?? m.estimatedCost ?? 0).toLocaleString('en-IN')}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {m.status === 'PROCURED' ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[11px] font-medium">✓ Procured</span>
                                                    ) : (
                                                        <span className="inline-flex px-2 py-0.5 rounded-full bg-[#fff3e0] text-[#e65100] text-[11px] font-medium">Pending</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-[#e8f0fe]">
                                        <tr>
                                            <td colSpan="5" className="px-4 py-3 text-right text-[13px] font-bold text-[#202124]">Grand Total</td>
                                            <td className="px-4 py-3 text-right text-[15px] font-bold text-[#1a73e8]">₹{Number(totalCost || 0).toLocaleString('en-IN')}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 px-8 py-5 border-t border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg text-[14px] font-medium text-[#5f6368] hover:bg-[#e8eaed] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => downloadQuotationPDF(request, materials)}
                        disabled={materials.length === 0}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#1a73e8] text-white text-[14px] font-medium hover:bg-[#1557b0] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Quotation
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
            `}</style>
        </>
    );
};

export default SARequestDetailModal;
