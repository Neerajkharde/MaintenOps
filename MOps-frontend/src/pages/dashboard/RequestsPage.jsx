import React, { useState } from 'react';
import { useRequests } from '../../context/RequestContext';
import RequestDetailsModal from '../../components/requests/RequestDetailsModal';

const RequestsPage = () => {
    const { requests } = useRequests();
    const [selectedRequest, setSelectedRequest] = useState(null);

    const getStatusChip = (status) => {
        switch (status) {
            case 'SUBMITTED': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#e8f0fe] text-[#1a73e8] border border-[#1a73e8] text-[11px] font-medium uppercase tracking-wide">SUBMITTED</span>;
            case 'PENDING_SA_APPROVAL': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#fef9e7] text-[#f9ab00] border border-[#f9ab00] text-[11px] font-medium uppercase tracking-wide">AWAITING SA</span>;
            case 'APPROVED': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#e6f4ea] text-[#137333] border border-[#137333] text-[11px] font-medium uppercase tracking-wide">APPROVED</span>;
            default: return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#f1f3f4] text-[#5f6368] text-[11px] font-medium uppercase tracking-wide">{status}</span>;
        }
    };

    const getDeptChip = (dept) => {
        switch (dept) {
            case 'Electrical': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#fce8e6] text-[#c5221f] text-[12px]">Electrical</span>;
            case 'Carpentry': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#fff8e1] text-[#f9ab00] text-[12px]">Carpentry</span>;
            case 'Plumbing': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#e6f4ea] text-[#137333] text-[12px]">Plumbing</span>;
            case 'Estate Management': return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#e6f4ea] text-[#137333] text-[12px]">Estate Mgt</span>;
            default: return <span className="inline-block px-3 py-[4px] rounded-[50px] bg-[#f1f3f4] text-[#5f6368] text-[12px]">{dept}</span>;
        }
    };

    return (
        <div className="relative pb-24 animate-fadeUp">
            <div className="mb-6">
                <h1 className="text-[28px] text-[#202124] mb-1 font-['Google_Sans_Display',sans-serif]">My Requests</h1>
                <p className="text-[14px] text-[#5f6368] font-['Roboto',sans-serif]">View and track all your previous and active maintenance requests.</p>
            </div>

            <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#dadce0]">
                    <h3 className="text-[16px] font-['Google_Sans',sans-serif] font-medium text-[#202124]">All Requests</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-[#f8f9fa]">
                                <th className="px-6 py-3 text-[12px] font-medium font-['Roboto',sans-serif] text-[#5f6368] uppercase tracking-[0.5px]">Request No.</th>
                                <th className="px-6 py-3 text-[12px] font-medium font-['Roboto',sans-serif] text-[#5f6368] uppercase tracking-[0.5px]">Department</th>
                                <th className="px-6 py-3 text-[12px] font-medium font-['Roboto',sans-serif] text-[#5f6368] uppercase tracking-[0.5px]">Description</th>
                                <th className="px-6 py-3 text-[12px] font-medium font-['Roboto',sans-serif] text-[#5f6368] uppercase tracking-[0.5px]">Submitted</th>
                                <th className="px-6 py-3 text-[12px] font-medium font-['Roboto',sans-serif] text-[#5f6368] uppercase tracking-[0.5px]">Status</th>
                                <th className="px-6 py-3 text-[12px] font-medium font-['Roboto',sans-serif] text-[#5f6368] uppercase tracking-[0.5px]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req, i) => (
                                <tr key={i} className="hover:bg-[#f8f9fa] transition-colors border-b border-[#f1f3f4] last:border-0 group cursor-pointer">
                                    <td className="px-6 py-4 text-[13px] font-medium font-['Roboto',sans-serif] text-[#1a73e8]">{req.id}</td>
                                    <td className="px-6 py-4">{getDeptChip(req.dept)}</td>
                                    <td className="px-6 py-4 text-[13px] font-['Roboto',sans-serif] text-[#202124] max-w-[200px] truncate" title={req.desc}>{req.desc}</td>
                                    <td className="px-6 py-4 text-[13px] font-['Roboto',sans-serif] text-[#5f6368]">{req.date}</td>
                                    <td className="px-6 py-4">{getStatusChip(req.status)}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedRequest(req)}
                                            className="px-4 py-[6px] rounded-[50px] border border-[#dadce0] text-[13px] font-['Google_Sans',sans-serif] text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-[#5f6368] font-['Roboto',sans-serif]">No requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RequestDetailsModal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                request={selectedRequest}
            />
        </div>
    );
};

export default RequestsPage;
