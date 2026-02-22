import React, { useState } from 'react';

const VendorList = () => {
    const [expanded, setExpanded] = useState('V-001');

    const vendors = [
        {
            id: 'V-001', name: 'Apex Electricals', pending: 3, total: '₹45,240',
            items: ['Switchboards (x20)', 'LED Panels (x50)', 'Copper Wire (100m)']
        },
        {
            id: 'V-002', name: 'BuildRight Supplies', pending: 1, total: '₹12,450',
            items: ['Cement Bags (x10)']
        },
        {
            id: 'V-003', name: 'CoolTech HVAC', pending: 2, total: '₹8,900',
            items: []
        },
    ];

    return (
        <div className="google-card border-outline/30 bg-white h-full overflow-hidden">
            <div className="p-6 border-b border-outline/10 bg-surface-variant/10">
                <h3 className="text-[17px] font-display font-medium text-on-surface">Vendor Fulfillment</h3>
                <p className="text-[13px] text-on-surface-variant font-ui">Consolidated procurement pipeline.</p>
            </div>
            <div className="divide-y divide-outline/10">
                {vendors.map((vendor) => (
                    <div key={vendor.id} className="transition-all hover:bg-primary-container/10">
                        <div
                            className="p-5 flex items-center justify-between cursor-pointer"
                            onClick={() => setExpanded(expanded === vendor.id ? null : vendor.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold text-[14px]">
                                    {vendor.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-[14px] font-medium font-ui text-on-surface">{vendor.name}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-warning"></div>
                                        <div className="text-[12px] text-on-surface-variant font-ui">{vendor.pending} line items</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-4">
                                <div>
                                    <div className="text-[14px] font-bold text-primary font-ui">{vendor.total}</div>
                                    <div className="text-[11px] text-on-surface-variant font-ui uppercase">Est. Total</div>
                                </div>
                                <svg className={`w-5 h-5 text-on-surface-variant transition-transform duration-300 ${expanded === vendor.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Collapsible Content */}
                        {expanded === vendor.id && (
                            <div className="bg-surface-variant/10 px-6 pb-6 pt-2 animate-fadeDown">
                                <ul className="space-y-2 mb-4">
                                    {vendor.items.length > 0 ? vendor.items.map((item, i) => (
                                        <li key={i} className="text-[13px] text-on-surface font-body flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-outline/40"></div>
                                            {item}
                                        </li>
                                    )) : (
                                        <li className="text-[13px] text-on-surface-variant italic font-ui">No line items specified.</li>
                                    )}
                                </ul>
                                <div className="flex gap-2">
                                    <button className="px-4 py-1.5 bg-primary text-white rounded-md text-[12px] font-bold font-ui uppercase tracking-wide hover:shadow-md transition-all active:scale-95">
                                        Authorize Purchase
                                    </button>
                                    <button className="px-4 py-1.5 bg-white border border-outline/30 text-on-surface-variant rounded-md text-[12px] font-bold font-ui uppercase tracking-wide hover:bg-surface-variant transition-all">
                                        Audit Draft
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorList;
