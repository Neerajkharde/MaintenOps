import React, { useState } from 'react';

const ActiveRequests = () => {
    const [filter, setFilter] = useState('All');
    const tabs = ['All', 'Pending', 'In Progress', 'Completed'];

    const requests = [
        { id: 'REQ-092', desc: 'HVAC Servicing', requester: 'John Doe', loc: 'Conf Room B', stage: 'Quotation', date: 'Oct 23' },
        { id: 'REQ-095', desc: 'Generator Fuel', requester: 'Admin', loc: 'Basement', stage: 'Approval', date: 'Oct 24' },
        { id: 'REQ-088', desc: 'Lobby Sensor', requester: 'Security', loc: 'Lobby', stage: 'Sourced', date: 'Oct 20' },
        { id: 'REQ-099', desc: 'Cafeteria Sink', requester: 'Sarah Lee', loc: 'Kitchen', stage: 'Pending', date: 'Oct 25' },
    ];

    return (
        <div className="bg-white rounded-[16px] shadow-google-1 border border-[#dadce0]/50 overflow-hidden col-span-2">
            <div className="p-6 border-b border-[#dadce0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-[18px] font-google-sans text-[#202124]">Active Requests</h3>

                {/* Filter Tabs */}
                <div className="flex bg-[#f1f3f4] p-1 rounded-full">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${filter === tab
                                    ? 'bg-white text-[#1a73e8] shadow-sm'
                                    : 'text-[#5f6368] hover:text-[#202124]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f8fafe] border-b border-[#dadce0]">
                            <th className="py-3 px-6 text-[12px] font-medium text-[#5f6368] uppercase">Request ID</th>
                            <th className="py-3 px-6 text-[12px] font-medium text-[#5f6368] uppercase">Description</th>
                            <th className="py-3 px-6 text-[12px] font-medium text-[#5f6368] uppercase">Loc</th>
                            <th className="py-3 px-6 text-[12px] font-medium text-[#5f6368] uppercase">Stage</th>
                            <th className="py-3 px-6 text-[12px] font-medium text-[#5f6368] uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req, i) => (
                            <tr key={i} className="hover:bg-[#f1f3f4] border-b border-[#dadce0]/50 last:border-0 transition-colors">
                                <td className="py-4 px-6 text-[14px] font-medium text-[#1a73e8]">{req.id}</td>
                                <div className="py-4 px-6">
                                    <div className="text-[14px] text-[#202124] font-medium">{req.desc}</div>
                                    <div className="text-[12px] text-[#5f6368]">by {req.requester} • {req.date}</div>
                                </div>
                                <td className="py-4 px-6 text-[13px] text-[#5f6368]">{req.loc}</td>
                                <td className="py-4 px-6">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium bg-blue-50 text-blue-700">
                                        {req.stage}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button className="text-[#5f6368] hover:bg-[#e8f0fe] p-2 rounded-full transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveRequests;
