import { get, post, put } from './api';

const REQUESTS_API_URL = '/api/request';

/**
 * Service handling all request-related API calls
 */
export const requestService = {
    /**
     * Create a new maintenance request
     * @param {Object} requestData - Must match RequestRequestDto format
     * @returns {Promise<Object>} The created RequestResponseDto
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
     * @returns {Promise<Array>} List of RequestResponseDto
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
     * @param {number} id - Request ID
     * @returns {Promise<Object>} RequestResponseDto
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
     * Get pending requests for Admin review (SUBMITTED status)
     * @returns {Promise<Array>} List of RequestResponseDto
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
     * @param {Object} reviewData - { requestId, requiredDate, adminRemarks, approved }
     * @returns {Promise<Object>} RequestResponseDto
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
     * Get pending requests for Super Admin review (PENDING_SA_APPROVAL status)
     * @returns {Promise<Array>} List of RequestResponseDto
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
     * Submit Super Admin review (quotation) for a request
     * @param {Object} reviewData - { requestId, quotationAmount, quotationDescription, superAdminRemarks, approved }
     * @returns {Promise<Object>} RequestResponseDto
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
     * Get request history for the logged-in Admin (requests they reviewed)
     * @returns {Promise<Array>} List of RequestResponseDto
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
     * Get request history for the logged-in Super Admin (requests they reviewed/quoted)
     * @returns {Promise<Array>} List of RequestResponseDto
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
    }
};
