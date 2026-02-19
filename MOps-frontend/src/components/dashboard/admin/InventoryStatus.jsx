import React from 'react';

const InventoryStatus = () => {
    const items = [
        { name: 'LED Bulbs (9W)', stock: 12, max: 100, status: 'Low', color: 'bg-[#f9ab00]' },
        { name: 'A4 Paper Rims', stock: 0, max: 50, status: 'Out', color: 'bg-[#d93025]' },
        { name: 'Sanitizer (5L)', stock: 45, max: 60, status: 'Healthy', color: 'bg-[#188038]' },
    ];

    return (
        <div className="bg-white rounded-[16px] shadow-google-1 border border-[#dadce0]/50 p-6 h-full">
            <h3 className="text-[18px] font-google-sans text-[#202124] mb-4">Godown Inventory</h3>
            <div className="space-y-6">
                {items.map((item, index) => {
                    const percentage = (item.stock / item.max) * 100;
                    return (
                        <div key={index}>
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[14px] font-medium text-[#3c4043]">{item.name}</span>
                                <span className={`text-[12px] font-bold px-2 py-0.5 rounded ${item.status === 'Out' ? 'bg-red-50 text-red-600' :
                                        item.status === 'Low' ? 'bg-amber-50 text-amber-600' :
                                            'bg-green-50 text-green-600'
                                    }`}>
                                    {item.stock}/{item.max}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-[#f1f3f4] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${item.color}`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button className="mt-6 w-full py-2 border border-[#dadce0] rounded-[8px] text-[14px] font-medium text-[#5f6368] hover:bg-[#f1f3f4] transition-colors">
                View All Inventory
            </button>
        </div>
    );
};

export default InventoryStatus;
