import React from 'react';

const ApprovalQueue = () => {
    const approvals = [
        { id: 'QT-2024-88', vendor: 'Apex Electricals', amount: '$4,200', req: 'Generate Set Replacement' },
        { id: 'QT-2024-91', vendor: 'CoolTech HVAC', amount: '$1,800', req: 'Annual Maintenance Contract' },
    ];

    return (
        <div className="bg-white rounded-[16px] shadow-google-1 border border-[#dadce0]/50 p-6 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[18px] font-google-sans text-[#202124]">Approval Queue</h3>
                <span className="bg-[#e8f0fe] text-[#1a73e8] text-[12px] font-bold px-2 py-1 rounded-full">2 Pending</span>
            </div>

            <div className="space-y-4">
                {approvals.map((item, i) => (
                    <div key={i} className="border border-[#dadce0] rounded-[12px] p-4 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between mb-2">
                            <span className="text-[14px] font-bold text-[#202124]">{item.amount}</span>
                            <span className="text-[12px] text-[#5f6368]">{item.id}</span>
                        </div>
                        <div className="text-[14px] font-medium text-[#1a73e8] mb-1">{item.vendor}</div>
                        <div className="text-[13px] text-[#3c4043] mb-4">{item.req}</div>

                        <div className="flex gap-2">
                            <button className="flex-1 bg-[#1a73e8] text-white py-1.5 rounded-[6px] text-[13px] font-medium hover:bg-[#1557b0]">Approve</button>
                            <button className="flex-1 bg-white border border-[#dadce0] text-[#5f6368] py-1.5 rounded-[6px] text-[13px] font-medium hover:bg-[#f1f3f4]">Reject</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 text-[13px] font-medium text-[#1a73e8] hover:bg-[#e8f0fe] py-2 rounded transition-colors">
                View History
            </button>
        </div>
    );
};

export default ApprovalQueue;
