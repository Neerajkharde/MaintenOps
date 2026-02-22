import React, { useState, useEffect } from 'react';
import { quotationService } from '../../../services/materialService';
import { quotationService as qs } from '../../../services/materialService';

/**
 * VendorListsPage — Admin/SA view of aggregated vendor purchase lists.
 * Route: /admin/vendor-lists or as a tab
 */
const VendorListsPage = () => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' | 'pending'
    const [markingId, setMarkingId] = useState(null);

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

    const handleMarkPurchased = async (id) => {
        setMarkingId(id);
        try {
            await qs.markItemPurchased(id);
            setLists(prev => prev.map(l => l.id === id ? { ...l, isPurchased: true } : l));
        } catch (e) {
            console.error(e);
        } finally {
            setMarkingId(null);
        }
    };

    // Group by vendor name
    const grouped = lists.reduce((acc, item) => {
        const vendorName = item.vendor?.name || 'Unknown Vendor';
        if (!acc[vendorName]) acc[vendorName] = [];
        acc[vendorName].push(item);
        return acc;
    }, {});

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-[22px] font-['Google_Sans_Display',sans-serif] font-bold text-[#202124]">
                        Vendor Purchase Lists
                    </h1>
                    <p className="text-[14px] text-[#5f6368]">Aggregated procurement requirements grouped by vendor</p>
                </div>
                <div className="flex gap-2">
                    {['all', 'pending'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-[50px] text-[13px] font-medium transition-colors ${filter === f
                                    ? 'bg-[#1a73e8] text-white'
                                    : 'text-[#5f6368] hover:bg-[#e8eaed]'
                                }`}
                        >
                            {f === 'all' ? 'All' : 'Pending Only'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-8 h-8 border-4 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : lists.length === 0 ? (
                <div className="text-center py-20 text-[#5f6368]">
                    <div className="text-5xl mb-4">📦</div>
                    <div className="text-[16px] font-medium">No purchase lists yet</div>
                    <div className="text-[13px] mt-1">Items appear here after users approve quotations</div>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(grouped).map(([vendorName, items]) => (
                        <div key={vendorName} className="border border-[#dadce0] rounded-[16px] overflow-hidden">
                            {/* Vendor Header */}
                            <div className="bg-[#f8f9fa] px-5 py-4 flex items-center gap-3 border-b border-[#dadce0]">
                                <div className="w-9 h-9 rounded-full bg-[#e8f0fe] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-[15px] font-semibold text-[#202124]">{vendorName}</div>
                                    <div className="text-[12px] text-[#5f6368]">
                                        {items.filter(i => !i.isPurchased).length} pending item(s)
                                    </div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <table className="w-full text-[13px]">
                                <thead className="border-b border-[#f1f3f4]">
                                    <tr>
                                        <th className="px-5 py-2.5 text-left text-[#5f6368] font-medium">Material</th>
                                        <th className="px-5 py-2.5 text-right text-[#5f6368] font-medium">Qty</th>
                                        <th className="px-5 py-2.5 text-left text-[#5f6368] font-medium">Date</th>
                                        <th className="px-5 py-2.5 text-center text-[#5f6368] font-medium">Status</th>
                                        <th className="px-5 py-2.5"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item => (
                                        <tr key={item.id} className={`border-t border-[#f1f3f4] ${item.isPurchased ? 'opacity-60' : ''}`}>
                                            <td className="px-5 py-3">
                                                <div className="font-medium text-[#202124]">{item.materialName}</div>
                                                {item.specificationText && (
                                                    <div className="text-[11px] text-[#5f6368]">{item.specificationText}</div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-right font-medium">
                                                {item.totalQuantity} {item.unit}
                                            </td>
                                            <td className="px-5 py-3 text-[#5f6368]">
                                                {item.listDate ? new Date(item.listDate).toLocaleDateString('en-IN') : '—'}
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                {item.isPurchased ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[50px] bg-[#e6f4ea] text-[#137333] text-[12px] font-medium">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Purchased
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-2.5 py-1 rounded-[50px] bg-[#fff3e0] text-[#e65100] text-[12px] font-medium">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                {!item.isPurchased && (
                                                    <button
                                                        onClick={() => handleMarkPurchased(item.id)}
                                                        disabled={markingId === item.id}
                                                        className="text-[13px] text-[#1a73e8] hover:text-[#1557b0] font-medium disabled:opacity-60"
                                                    >
                                                        {markingId === item.id ? 'Marking...' : 'Mark Purchased'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VendorListsPage;
