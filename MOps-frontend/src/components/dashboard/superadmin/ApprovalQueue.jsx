import React, { useState, useEffect } from 'react';
import SuperAdminReviewModal from '../../requests/SuperAdminReviewModal';
import { requestService } from '../../../services/requestService';
import { formatDate } from '../../../utils/dateUtils';

const ApprovalQueue = () => {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('Pending'); // 'Pending' or 'History'

    const fetchRequests = async () => {
        try {
            setLoading(true);
            let data = [];

            if (viewMode === 'Pending') {
                data = await requestService.getPendingSuperAdminRequests();
            } else {
                data = await requestService.getSuperAdminRequestHistory();
            }

            // Map the data
            const mappedData = data.map(req => ({
                id: req.requestNumber,
                vendor: req.serviceDepartmentName || 'Department', // Reusing vendor visual style for Department Name
                amount: viewMode === 'Pending' ? 'Quote Pending' : `₹${req.quotationAmount}`,
                req: req.itemDescription,
                date: formatDate(req.createdAt),
                isPending: req.status === 'PENDING_SA_APPROVAL',
                raw: req
            }));

            // Sort by creation date
            mappedData.sort((a, b) => new Date(b.raw.createdAt) - new Date(a.raw.createdAt));

            setRequests(mappedData);
            setError(null);
        } catch (err) {
            console.error(`Failed to load SA requests (${viewMode}):`, err);
            setError('Could not load approvals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [viewMode]);

    const handleSuccess = () => {
        setIsQuotationModalOpen(false);
        fetchRequests();
    };

    return (
        <div className="bg-white rounded-[16px] shadow-google-1 border border-[#dadce0]/50 p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[18px] font-google-sans text-[#202124]">{viewMode === 'Pending' ? 'Approval Queue' : 'Approval History'}</h3>
                {viewMode === 'Pending' && (
                    <span className="bg-[#e8f0fe] text-[#1a73e8] text-[12px] font-bold px-3 py-1 rounded-full">{requests.length} Pending</span>
                )}
            </div>

            <div className="space-y-4 flex-grow overflow-y-auto min-h-[150px] relative pr-2">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                        <div className="w-8 h-8 rounded-full border-4 border-[#e8f0fe] border-t-[#1a73e8] animate-spin"></div>
                    </div>
                )}
                {error && !loading && (
                    <div className="p-4 text-center text-[#c5221f] text-[14px]">{error}</div>
                )}
                {!loading && !error && requests.length === 0 && (
                    <div className="p-8 text-center text-[#5f6368] text-[14px] flex flex-col items-center justify-center h-full">
                        <svg className="w-12 h-12 text-[#dadce0] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {viewMode === 'Pending' ? 'All Caught Up!' : 'No History Found'}
                    </div>
                )}

                {!loading && requests.map((item, i) => (
                    <div key={i} className="border border-[#dadce0] rounded-[12px] p-4 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between mb-2">
                            <span className={`text-[14px] font-bold ${item.isPending ? 'text-[#f9ab00]' : 'text-[#137333]'}`}>{item.amount}</span>
                            <span className="text-[12px] text-[#5f6368]">{item.id}</span>
                        </div>
                        <div className="text-[14px] font-medium text-[#1a73e8] mb-1">{item.vendor}</div>
                        <div className="text-[13px] text-[#3c4043] mb-3 line-clamp-2" title={item.req}>{item.req}</div>

                        <div className="flex justify-between items-center mt-2">
                            <div className="text-[11px] text-[#5f6368]">{item.date}</div>
                            {item.isPending ? (
                                <button
                                    onClick={() => {
                                        setSelectedRequest(item.raw);
                                        setIsQuotationModalOpen(true);
                                    }}
                                    className="bg-[#1a73e8] text-white px-4 py-1.5 rounded-[6px] text-[13px] font-medium hover:bg-[#1557b0] transition-colors shadow-sm"
                                >
                                    Review & Quote
                                </button>
                            ) : (
                                <span className="text-[12px] font-medium text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded">Approved</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setViewMode(viewMode === 'Pending' ? 'History' : 'Pending')}
                className="w-full mt-4 text-[13px] font-medium text-[#1a73e8] hover:bg-[#e8f0fe] py-2 rounded transition-colors border border-transparent hover:border-[#d2e3fc]"
            >
                {viewMode === 'Pending' ? 'View Approval History' : 'View Pending Approvals'}
            </button>

            <SuperAdminReviewModal
                isOpen={isQuotationModalOpen}
                onClose={() => {
                    setIsQuotationModalOpen(false);
                    setSelectedRequest(null);
                }}
                onSuccess={handleSuccess}
                request={selectedRequest}
            />
        </div>
    );
};

export default ApprovalQueue;
