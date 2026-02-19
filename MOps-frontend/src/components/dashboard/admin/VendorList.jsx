import React, { useState } from 'react';

const VendorList = () => {
    const [expanded, setExpanded] = useState('V-001');

    const vendors = [
        {
            id: 'V-001', name: 'Apex Electricals', pending: 3, total: '$1,240',
            items: ['Switchboards (x20)', 'LED Panels (x50)', 'Copper Wire (100m)']
        },
        {
            id: 'V-002', name: 'BuildRight Supplies', pending: 1, total: '$450',
            items: ['Cement Bags (x10)']
        },
        {
            id: 'V-003', name: 'CoolTech HVAC', pending: 2, total: '$890',
            items: []
        },
    ];

    return (
        <div className="bg-white rounded-[16px] shadow-google-1 border border-[#dadce0]/50 overflow-hidden h-full">
            <div className="p-6 border-b border-[#dadce0]/50">
                <h3 className="text-[18px] font-google-sans text-[#202124]">Vendor Purchase List</h3>
                <p className="text-[13px] text-[#5f6368]">Aggregated materials pending purchase.</p>
            </div>
            <div className="divide-y divide-[#dadce0]/50">
                {vendors.map((vendor) => (
                    <div key={vendor.id} className="transition-colors hover:bg-[#f8fafe]">
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer"
                            onClick={() => setExpanded(expanded === vendor.id ? null : vendor.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#f1f3f4] flex items-center justify-center text-[#5f6368] font-bold text-[12px]">
                                    {vendor.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-[14px] font-medium text-[#202124]">{vendor.name}</div>
                                    <div className="text-[12px] text-[#5f6368]">{vendor.pending} orders pending</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[14px] font-bold text-[#1a73e8]">{vendor.total}</div>
                                <svg className={`w-4 h-4 text-[#5f6368] ml-auto transition-transform ${expanded === vendor.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Collapsible Content */}
                        {expanded === vendor.id && (
                            <div className="bg-[#f8f9fa] px-4 pb-4 pt-1 shadow-inner">
                                <ul className="space-y-1">
                                    {vendor.items.length > 0 ? vendor.items.map((item, i) => (
                                        <li key={i} className="text-[13px] text-[#5f6368] flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-[#9aa0a6]"></span>
                                            {item}
                                        </li>
                                    )) : (
                                        <li className="text-[13px] text-[#9aa0a6] italic">No details available.</li>
                                    )}
                                </ul>
                                <button className="mt-3 text-[12px] font-medium text-[#1a73e8] uppercase tracking-wide hover:underline">
                                    Generate PO
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorList;
