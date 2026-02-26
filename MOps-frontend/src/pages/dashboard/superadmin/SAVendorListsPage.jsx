import React, { useState, useEffect } from 'react';
import { quotationService } from '../../../services/materialService';
import { downloadVendorListPDF } from '../../../utils/downloadUtils';

/**
 * SAVendorListsPage — Super Admin view of aggregated vendor purchase lists.
 * Groups all materials across approved requests by vendor.
 * Route: /super-admin/vendor-lists
 */
const SAVendorListsPage = () => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedVendor, setExpandedVendor] = useState(null);

    const fetchLists = async () => {
        setLoading(true);
        try {
            const data = await quotationService.getVendorLists(filter === 'pending');
            setLists(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLists(); }, [filter]);

    // Group by vendor name
    const grouped = lists.reduce((acc, item) => {
        const vendorName = item.vendor?.name || item.vendorName || 'Unknown Vendor';
        if (!acc[vendorName]) acc[vendorName] = { items: [], totalCost: 0, pending: 0 };
        acc[vendorName].items.push(item);
        acc[vendorName].totalCost += Number(item.totalPrice ?? item.estimatedCost ?? 0);
        if (!item.isPurchased && item.status !== 'PROCURED') acc[vendorName].pending++;
        return acc;
    }, {});

    const vendorEntries = Object.entries(grouped).sort((a, b) => b[1].pending - a[1].pending);

    return (
        <div className="max-w-6xl mx-auto px-6 py-8 animate-fadeUp">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-bold text-[#202124] tracking-tight mb-1">
                        Vendor Purchase Lists
                    </h1>
                    <p className="text-[14px] text-[#5f6368]">
                        Aggregated procurement requirements across all approved requests, grouped by vendor.
                    </p>
                </div>
                <div className="flex gap-2">
                    {['all', 'pending'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${filter === f
                                ? 'bg-[#1a73e8] text-white shadow-sm'
                                : 'text-[#5f6368] hover:bg-[#e8eaed] border border-[#dadce0]'
                                }`}
                        >
                            {f === 'all' ? 'All Items' : 'Pending Only'}
                        </button>
                    ))}
                    <button
                        onClick={fetchLists}
                        className="px-4 py-2 rounded-full text-[13px] font-medium text-[#5f6368] hover:bg-[#e8eaed] border border-[#dadce0] transition-colors"
                    >
                        <svg className={`w-4 h-4 inline mr-1 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Vendors', value: vendorEntries.length, icon: '🏢', bg: 'bg-[#e8f0fe]', color: 'text-[#1a73e8]' },
                    { label: 'Total Items', value: lists.length, icon: '📦', bg: 'bg-[#fef7e0]', color: 'text-[#f9ab00]' },
                    { label: 'Pending', value: lists.filter(i => !i.isPurchased && i.status !== 'PROCURED').length, icon: '⏳', bg: 'bg-[#fff3e0]', color: 'text-[#e65100]' },
                    { label: 'Procured', value: lists.filter(i => i.isPurchased || i.status === 'PROCURED').length, icon: '✅', bg: 'bg-[#e6f4ea]', color: 'text-[#137333]' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 border border-[#dadce0]/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center text-[16px]`}>{s.icon}</span>
                            <div className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider">{s.label}</div>
                        </div>
                        <div className={`text-[28px] font-bold ${s.color}`}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : vendorEntries.length === 0 ? (
                <div className="text-center py-20 bg-[#f8f9fa] rounded-2xl border border-dashed border-[#dadce0]">
                    <div className="text-5xl mb-4">📦</div>
                    <div className="text-[16px] font-bold text-[#202124] mb-1">No purchase lists yet</div>
                    <div className="text-[13px] text-[#5f6368]">Lists appear here after admins generate vendor purchase lists</div>
                </div>
            ) : (
                <div className="space-y-5">
                    {vendorEntries.map(([vendorName, data]) => {
                        const isExpanded = expandedVendor === vendorName;
                        return (
                            <div key={vendorName} className="bg-white border border-[#dadce0]/60 rounded-2xl shadow-sm overflow-hidden transition-all">
                                {/* Vendor Header */}
                                <div
                                    className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-[#f8f9fa] transition-colors"
                                    onClick={() => setExpandedVendor(isExpanded ? null : vendorName)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] font-bold text-[15px]">
                                            {vendorName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-[16px] font-semibold text-[#202124]">{vendorName}</div>
                                            <div className="flex items-center gap-3 text-[12px] text-[#5f6368]">
                                                <span>{data.items.length} items</span>
                                                <span>·</span>
                                                <span className="font-medium text-[#1a73e8]">₹{data.totalCost.toLocaleString('en-IN')}</span>
                                                {data.pending > 0 && (
                                                    <>
                                                        <span>·</span>
                                                        <span className="text-[#e65100] font-medium">{data.pending} pending</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); downloadVendorListPDF(vendorName, data.items); }}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-[#1a73e8] hover:bg-[#e8f0fe] transition-colors border border-[#1a73e8]/20"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </button>
                                        <svg className={`w-5 h-5 text-[#5f6368] transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Expanded Material Table */}
                                {isExpanded && (
                                    <div className="border-t border-[#dadce0]">
                                        <table className="w-full text-[13px]">
                                            <thead className="bg-[#f1f3f4]">
                                                <tr>
                                                    <th className="px-6 py-2.5 text-left text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">#</th>
                                                    <th className="px-4 py-2.5 text-left text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Material</th>
                                                    <th className="px-4 py-2.5 text-right text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Qty</th>
                                                    <th className="px-4 py-2.5 text-left text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Request</th>
                                                    <th className="px-4 py-2.5 text-right text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Rate</th>
                                                    <th className="px-4 py-2.5 text-right text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Total</th>
                                                    <th className="px-4 py-2.5 text-center text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#f1f3f4]">
                                                {data.items.map((item, i) => (
                                                    <tr key={item.id || i} className={`hover:bg-[#f8f9fa] ${(item.isPurchased || item.status === 'PROCURED') ? 'opacity-60' : ''}`}>
                                                        <td className="px-6 py-3 text-[#5f6368]">{i + 1}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="font-medium text-[#202124]">{item.materialName || item.name}</div>
                                                            {item.specificationText && (
                                                                <div className="text-[11px] text-[#5f6368]">{item.specificationText}</div>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-medium">{item.totalQuantity ?? item.quantity} {item.unit || ''}</td>
                                                        <td className="px-4 py-3 text-[#5f6368]">{item.requestNumber || item.requestId || '—'}</td>
                                                        <td className="px-4 py-3 text-right">₹{Number(item.ratePerUnit ?? item.unitPrice ?? 0).toLocaleString('en-IN')}</td>
                                                        <td className="px-4 py-3 text-right font-semibold">₹{Number(item.totalPrice ?? item.estimatedCost ?? 0).toLocaleString('en-IN')}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            {(item.isPurchased || item.status === 'PROCURED') ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[11px] font-medium">
                                                                    ✓ Procured
                                                                </span>
                                                            ) : (
                                                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#fff3e0] text-[#e65100] text-[11px] font-medium">
                                                                    Pending
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-[#e8f0fe]">
                                                <tr>
                                                    <td colSpan="5" className="px-4 py-3 text-right text-[13px] font-bold text-[#202124]">Vendor Total</td>
                                                    <td className="px-4 py-3 text-right text-[15px] font-bold text-[#1a73e8]">₹{data.totalCost.toLocaleString('en-IN')}</td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SAVendorListsPage;
