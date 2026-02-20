import React from 'react';

const EscalationAlerts = () => {
    return (
        <div className="bg-[#fce8e6] border border-[#f28b82] rounded-[16px] p-4 flex items-start gap-4 shadow-sm mb-6">
            <div className="w-10 h-10 bg-[#d93025] rounded-full flex items-center justify-center text-white shrink-0 mt-1">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div className="flex-1">
                <h3 className="text-[16px] font-bold text-[#d93025] mb-1">SLA Breach Alert: HVAC Maintenance (REQ-095)</h3>
                <p className="text-[14px] text-[#3c4043]">
                    This request is <span className="font-bold">2 days overdue</span>. Assigned to: <span className="font-medium">Facility Manager (Admin)</span>.
                    Immediate intervention required.
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <button className="px-4 py-2 bg-[#d93025] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#c5221f]">
                    Intervene
                </button>
                <button className="px-4 py-2 bg-white text-[#d93025] border border-[#d93025] text-[13px] font-medium rounded-[8px] hover:bg-[#fce8e6]">
                    Dismiss
                </button>
            </div>
        </div>
    );
};

export default EscalationAlerts;
