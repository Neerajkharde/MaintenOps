import React, { useState, useEffect } from 'react';
import { requestService } from '../../../services/requestService';
import AdminReviewModal from '../../requests/AdminReviewModal';
import { formatDate } from '../../../utils/dateUtils';

const ActiveRequests = () => {
    const [filter, setFilter] = useState('Pending'); // Default to Pending
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tabs = ['Pending', 'Completed', 'All'];

    const fetchRequests = async () => {
        try {
            setLoading(true);

            let data = [];
            if (filter === 'Pending') {
                data = await requestService.getPendingAdminRequests();
            } else if (filter === 'Completed') {
                data = await requestService.getAdminRequestHistory();
            } else if (filter === 'All') {
                const [pending, history] = await Promise.all([
                    requestService.getPendingAdminRequests(),
                    requestService.getAdminRequestHistory()
                ]);
                data = [...pending, ...history];
            }

            // Map the data to fit the table layout
            const mappedData = data.map(req => ({
                id: req.requestNumber,
                desc: req.itemDescription,
                requester: req.requesterName,
                dept: req.organizationDepartmentName,
                stage: req.status === 'SUBMITTED' ? 'Pending Review' : req.status.replace(/_/g, ' '),
                date: formatDate(req.createdAt),
                isPending: req.status === 'SUBMITTED',
                raw: req
            }));

            // Sort newest first
            mappedData.sort((a, b) => new Date(b.raw.createdAt) - new Date(a.raw.createdAt));

            // Remove duplicates if in 'All' view
            const uniqueData = Array.from(new Map(mappedData.map(item => [item.id, item])).values());

            setRequests(uniqueData);
            setError(null);
        } catch (err) {
            console.error('Failed to load admin requests:', err);
            setError('Could not load requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filter]); // Re-fetch when tab changes

    const openReviewModal = (request) => {
        setSelectedRequest(request.raw);
        setIsModalOpen(true);
    };

    const handleReviewSuccess = () => {
        setIsModalOpen(false);
        fetchRequests(); // Refresh the list
    };

    return (
        <div className="bg-white rounded-[16px] shadow-google-1 border border-[#dadce0]/50 overflow-hidden col-span-2">
            <div className="p-6 border-b border-[#dadce0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-[18px] font-google-sans text-[#202124]">Admin Request Feed</h3>

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

            <div className="overflow-x-auto min-h-[200px] relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                        <div className="w-8 h-8 rounded-full border-4 border-[#e8f0fe] border-t-[#1a73e8] animate-spin"></div>
                    </div>
                )}
                {error && !loading && (
                    <div className="p-8 text-center text-[#c5221f] text-[14px]">{error}</div>
                )}
                {!loading && !error && requests.length === 0 && (
                    <div className="p-8 text-center text-[#5f6368] text-[14px]">No requests found for this filter.</div>
                )}

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f8fafe] border-b border-[#dadce0]">
                            <th className="py-3 px-6 text-[12px] font-medium text-[#5f6368] uppercase">Request ID</th>
                            <th className="py-3 px-6 text-[12px] font-medium text-[#5f6368] uppercase">Description</th>
                            <th className="py-3 px-6 text-[12px] font-medium text-[#5f6368] uppercase">Dept</th>
                            <th className="py-3 px-6 text-[12px] font-medium text-[#5f6368] uppercase">Stage</th>
                            <th className="py-3 px-6 text-[12px] font-medium text-[#5f6368] uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req, i) => (
                            <tr key={i} className="hover:bg-[#f1f3f4] border-b border-[#dadce0]/50 last:border-0 transition-colors">
                                <td className="py-4 px-6 text-[14px] font-medium text-[#1a73e8]">{req.id}</td>
                                <td className="py-4 px-6">
                                    <div className="text-[14px] text-[#202124] font-medium max-w-[300px] truncate" title={req.desc}>{req.desc}</div>
                                    <div className="text-[12px] text-[#5f6368]">by {req.requester} • {req.date}</div>
                                </td>
                                <td className="py-4 px-6 text-[13px] text-[#5f6368]">{req.dept}</td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium ${req.isPending ? 'bg-[#fef9e7] text-[#f9ab00]' : 'bg-[#e6f4ea] text-[#137333]'}`}>
                                        {req.stage}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    {req.isPending ? (
                                        <button
                                            onClick={() => openReviewModal(req)}
                                            className="text-[#1a73e8] hover:bg-[#e8f0fe] px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors border border-[#1a73e8]"
                                        >
                                            Review
                                        </button>
                                    ) : (
                                        <span className="text-[13px] text-[#5f6368] italic py-1.5">Processed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedRequest && (
                <AdminReviewModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    request={selectedRequest}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </div>
    );
};

export default ActiveRequests;
