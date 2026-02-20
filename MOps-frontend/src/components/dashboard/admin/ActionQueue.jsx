import React from 'react';

const ActionQueue = () => {
    return (
        <div className="bg-[#1a73e8] text-white rounded-[24px] p-8 shadow-google-2 relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -ml-20 -mb-20 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="text-[14px] font-medium tracking-wide uppercase opacity-80 mb-2">Action Queue</div>
                    <h2 className="text-[32px] font-display font-medium leading-tight">Quotations to Send Today</h2>
                    <div className="mt-4 flex items-center gap-3">
                        <span className="text-[48px] font-bold">12</span>
                        <span className="text-[14px] opacity-80 max-w-[150px]">Requests awaiting your price estimation.</span>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-4 w-full md:w-[320px] border border-white/20">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                        <span className="text-[14px] font-medium">Pending Approvals</span>
                        <span className="text-[12px] bg-white text-[#1a73e8] px-2 py-0.5 rounded-full font-bold">3 Urgent</span>
                    </div>
                    <div className="space-y-3">
                        {[
                            { id: 'REQ-092', title: 'HVAC Servicing', time: '2h left' },
                            { id: 'REQ-095', title: 'Generator Fuel', time: '4h left' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <div className="text-[14px] font-medium">{item.title}</div>
                                    <div className="text-[12px] opacity-70">{item.id}</div>
                                </div>
                                <div className="text-[12px] font-medium bg-red-500/20 px-2 py-1 rounded text-red-100">{item.time}</div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 bg-white text-[#1a73e8] py-2 rounded-[8px] text-[14px] font-medium hover:bg-opacity-90 transition-all">
                        Process Queue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionQueue;
