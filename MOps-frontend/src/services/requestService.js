import { get, post, put } from './api';

const REQUESTS_API_URL = '/api/request';

/**
 * Service handling all request-related API calls
 */
export const requestService = {
    // ==================== Phase 1: Request & Quotation ====================

    /**
     * Create a new maintenance request
     */
    createRequest: async (requestData) => {
        try {
            const response = await post(REQUESTS_API_URL, requestData);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create request');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error creating request:', error);
            throw error;
        }
    },

    /**
     * Get all requests for the logged-in user
     */
    getMyRequests: async () => {
        try {
            const response = await get(`${REQUESTS_API_URL}/my`);
            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error fetching user requests:', error);
            throw error;
        }
    },

    /**
     * Get a specific request by ID
     */
    getRequestById: async (id) => {
        try {
            const response = await get(`${REQUESTS_API_URL}/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch request details');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error fetching request details:', error);
            throw error;
        }
    },

    /**
     * Get pending requests for Admin review (REQUEST_CREATED status)
     */
    getPendingAdminRequests: async () => {
        try {
            const response = await get(`/api/admin/requests/pending-review`);
            if (!response.ok) {
                throw new Error('Failed to fetch pending admin requests');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error fetching pending admin requests:', error);
            throw error;
        }
    },

    /**
     * Submit Admin review for a request
     * Status: REQUEST_CREATED → QUOTATION_ADDED
     */
    submitAdminReview: async (reviewData) => {
        try {
            const response = await put(`/api/admin/requests/review`, reviewData);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to submit admin review');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error submitting admin review:', error);
            throw error;
        }
    },

    /**
     * Get pending requests for Super Admin review (QUOTATION_ADDED status)
     */
    getPendingSuperAdminRequests: async () => {
        try {
            const response = await get(`/api/super-admin/requests/pending-review`);
            if (!response.ok) {
                throw new Error('Failed to fetch pending super admin requests');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error fetching pending super admin requests:', error);
            throw error;
        }
    },

    /**
     * Submit Super Admin review (quotation approval)
     * Status: QUOTATION_ADDED → QUOTATION_APPROVED
     */
    submitSuperAdminReview: async (reviewData) => {
        try {
            const response = await put(`/api/super-admin/requests/review`, reviewData);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to submit super admin review');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error submitting super admin review:', error);
            throw error;
        }
    },

    /**
     * User accepts the quotation
     * Status: QUOTATION_APPROVED → APPROVED
     */
    approveQuotation: async (requestId) => {
        try {
            const response = await post(`${REQUESTS_API_URL}/${requestId}/approve-quotation`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to approve quotation');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error approving quotation:', error);
            throw error;
        }
    },

    // ==================== History ====================

    /**
     * Get request history for the logged-in Admin
     */
    getAdminRequestHistory: async () => {
        try {
            const response = await get(`/api/admin/requests/history`);
            if (!response.ok) {
                throw new Error('Failed to fetch admin request history');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error fetching admin request history:', error);
            throw error;
        }
    },

    /**
     * Get request history for the logged-in Super Admin
     */
    getSuperAdminRequestHistory: async () => {
        try {
            const response = await get(`/api/super-admin/requests/history`);
            if (!response.ok) {
                throw new Error('Failed to fetch super admin request history');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error fetching super admin request history:', error);
            throw error;
        }
    },

    // ==================== Phase 2: List Preparation ====================

    /**
     * Get all APPROVED requests (ready for list generation)
     */
    getApprovedRequests: async () => {
        try {
            const response = await get(`/api/admin/requests/approved`);
            if (!response.ok) {
                throw new Error('Failed to fetch approved requests');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error fetching approved requests:', error);
            throw error;
        }
    },

    /**
     * Generate User Material List + Vendor Lists for a request
     * Status: APPROVED → PENDING_SA_APPROVAL
     */
    generateLists: async (requestId) => {
        try {
            const response = await post(`/api/admin/requests/${requestId}/generate-lists`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to generate lists');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error generating lists:', error);
            throw error;
        }
    },

    /**
     * Get requests pending vendor list approval (for Super Admin)
     */
    getPendingListApproval: async () => {
        try {
            const response = await get(`/api/super-admin/requests/pending-list-approval`);
            if (!response.ok) {
                throw new Error('Failed to fetch requests pending list approval');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error fetching pending list approval:', error);
            throw error;
        }
    },

    /**
     * Super Admin approves vendor lists
     * Status: PENDING_SA_APPROVAL → VENDOR_LIST_APPROVED
     */
    approveVendorLists: async (requestId) => {
        try {
            const response = await post(`/api/super-admin/requests/${requestId}/approve-vendor-lists`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to approve vendor lists');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error approving vendor lists:', error);
            throw error;
        }
    },

    // ==================== Phase 3: Procurement ====================

    /**
     * Mark a single material item as PROCURED
     * When all items are procured, request auto-transitions to ITEMS_READY
     */
    markItemProcured: async (materialId) => {
        try {
            const response = await put(`/api/admin/requests/materials/${materialId}/mark-procured`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to mark item as procured');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error marking item as procured:', error);
            throw error;
        }
    },

    /**
     * Get all requests with ITEMS_READY status (Super Admin monitoring)
     */
    getItemsReadyRequests: async () => {
        try {
            const response = await get(`/api/super-admin/requests/items-ready`);
            if (!response.ok) {
                throw new Error('Failed to fetch items ready requests');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error fetching items ready requests:', error);
            throw error;
        }
    },

    /**
     * Get all requests with IN_PRODUCTION status (Super Admin monitoring)
     */
    getInProductionRequests: async () => {
        try {
            const response = await get(`/api/super-admin/requests/in-production`);
            if (!response.ok) {
                throw new Error('Failed to fetch in-production requests');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error fetching in-production requests:', error);
            throw error;
        }
    },

    // ==================== Phase 4: Production ====================

    /**
     * Start production for a request
     * Status: ITEMS_READY → IN_PRODUCTION
     */
    startProduction: async (requestId) => {
        try {
            const response = await post(`/api/admin/requests/${requestId}/start-production`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to start production');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error starting production:', error);
            throw error;
        }
    },

    /**
     * Complete production for a request
     * Status: IN_PRODUCTION → PAYMENT_PENDING
     */
    completeProduction: async (requestId) => {
        try {
            const response = await post(`/api/admin/requests/${requestId}/complete-production`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to complete production');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error completing production:', error);
            throw error;
        }
    },

    // ==================== Phase 5: Payment & Closure ====================

    /**
     * Confirm payment received, close the request
     * Status: PAYMENT_PENDING → COMPLETED
     */
    confirmPayment: async (requestId) => {
        try {
            const response = await post(`/api/admin/requests/${requestId}/confirm-payment`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to confirm payment');
            }
            return await response.json();
        } catch (error) {
            console.error('[RequestService] Error confirming payment:', error);
            throw error;
        }
    },
};
