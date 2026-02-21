import React, { createContext, useState, useContext } from 'react';

const RequestContext = createContext();

export const useRequests = () => useContext(RequestContext);

export const RequestProvider = ({ children }) => {
    const [requests, setRequests] = useState([
        {
            id: 'REQ-2026-001',
            dept: 'Electrical',
            desc: 'Fix broken AC in Conference Room A',
            date: 'Feb 20, 2026',
            status: 'PENDING_SA_APPROVAL',
            requesterName: 'jane_doe',
            createdAt: '2026-02-20T10:30:00Z',
            adminRemarks: 'Feasible to complete. Electrical team available.',
            adminName: 'admin_user',
            adminReviewedAt: '2026-02-21T11:00:00Z',
            requiredDate: '2026-03-15T18:00:00Z'
        },
        {
            id: 'REQ-2026-002',
            dept: 'Carpentry',
            desc: 'Repair broken desk in Section B',
            date: 'Feb 19, 2026',
            status: 'SUBMITTED',
            requesterName: 'john_doe',
            createdAt: '2026-02-19T09:15:00Z'
        },
        {
            id: 'REQ-2026-003',
            dept: 'Plumbing',
            desc: 'Leaking pipe in main restroom',
            date: 'Feb 18, 2026',
            status: 'APPROVED',
            requesterName: 'mike_smith',
            createdAt: '2026-02-18T14:20:00Z',
            adminRemarks: 'Plumbing team available tomorrow.',
            adminName: 'admin_user',
            adminReviewedAt: '2026-02-18T16:00:00Z',
            requiredDate: '2026-02-21T18:00:00Z',
            quotationAmount: 5000.00,
            quotationDescription: 'Parts: Pipe (₹3500), Labor (₹1500)',
            superAdminRemarks: 'Approved for execution.',
            superAdminName: 'super_admin_user',
            superAdminReviewedAt: '2026-02-19T10:30:00Z'
        },
    ]);

    const activeRequests = requests.filter(req => req.status !== 'COMPLETED');
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(req => req.status === 'PENDING_SA_APPROVAL').length;
    const completedRequests = requests.filter(req => req.status === 'COMPLETED').length;

    const addRequest = (newRequest) => {
        setRequests(prev => [newRequest, ...prev]);
    };

    return (
        <RequestContext.Provider value={{
            requests,
            activeRequests,
            addRequest,
            stats: { total: totalRequests, active: activeRequests.length, pending: pendingRequests, completed: completedRequests }
        }}>
            {children}
        </RequestContext.Provider>
    );
};
