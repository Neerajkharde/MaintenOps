import { get, post } from './api';

/**
 * Service for material search and details (used by MaterialPicker)
 */
export const materialService = {
    /**
     * Search materials by name or get all active materials
     * @param {string} query - Optional search term
     * @returns {Promise<Array>} List of MaterialSearchDTO
     */
    searchMaterials: async (query = '') => {
        const url = query
            ? `/api/materials/search?query=${encodeURIComponent(query)}`
            : '/api/materials/search';
        const response = await get(url);
        if (!response.ok) throw new Error('Failed to fetch materials');
        return response.json();
    },

    /**
     * Get all active materials
     * @returns {Promise<Array>} List of MaterialSearchDTO
     */
    getAllMaterials: async () => {
        const response = await get('/api/materials');
        if (!response.ok) throw new Error('Failed to fetch materials');
        return response.json();
    },

    /**
     * Create a new material (Admin only)
     * @param {Object} payload - MaterialRequestDTO
     */
    createMaterial: async (payload) => {
        const response = await post('/api/materials', payload);
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to create material');
        }
        return response.json();
    },

    /**
     * Update an existing material (Admin only)
     * @param {number} id
     * @param {Object} payload - MaterialRequestDTO
     */
    updateMaterial: async (id, payload) => {
        const response = await fetch(`/api/materials/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to update material');
        }
        return response.json();
    },

    /**
     * Delete (deactivate) a material (Admin only)
     * @param {number} id
     */
    deleteMaterial: async (id) => {
        const response = await fetch(`/api/materials/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete material');
    },

    /**
     * Get full material details (specs, vendors, last rate)
     * @param {number} materialId
     * @returns {Promise<Object>} MaterialSearchDTO
     */
    getMaterialDetails: async (materialId) => {
        const response = await get(`/api/materials/${materialId}`);
        if (!response.ok) throw new Error('Failed to fetch material details');
        return response.json();
    },
};

/**
 * Vendor-related service calls
 */
export const vendorService = {
    /**
     * Get all active vendors
     */
    getAllVendors: async () => {
        const response = await get('/api/vendors');
        if (!response.ok) throw new Error('Failed to fetch vendors');
        return response.json();
    }
};

/**
 * Quotation-related service calls
 */
export const quotationService = {
    /**
     * Create a structured quotation using material picker selections
     * @param {Object} payload - QuotationRequestDTO
     */
    createQuotation: async (payload) => {
        const response = await post('/api/quotations/create', payload);
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to create quotation');
        }
        return response.json();
    },

    /**
     * Get quotation details (material breakdown) for a request
     * @param {number} requestId
     */
    getQuotation: async (requestId) => {
        const response = await get(`/api/quotations/${requestId}`);
        if (!response.ok) throw new Error('Failed to fetch quotation');
        return response.json();
    },

    /**
     * Check inventory status for a request's materials
     * @param {number} requestId
     */
    checkInventory: async (requestId) => {
        const response = await get(`/api/quotations/${requestId}/inventory-check`);
        if (!response.ok) throw new Error('Failed to check inventory');
        return response.json();
    },

    /**
     * Get all vendor purchase lists
     * @param {boolean} unpurchasedOnly - Filter to pending items only
     */
    getVendorLists: async (unpurchasedOnly = false) => {
        const url = `/api/quotations/vendor-lists${unpurchasedOnly ? '?unpurchasedOnly=true' : ''}`;
        const response = await get(url);
        if (!response.ok) throw new Error('Failed to fetch vendor lists');
        return response.json();
    },

    /**
     * Mark a vendor purchase list item as purchased
     * @param {number} id
     */
    markItemPurchased: async (id) => {
        const response = await fetch(`/api/quotations/vendor-lists/${id}/mark-purchased`, { method: 'PUT' });
        if (!response.ok) throw new Error('Failed to mark item as purchased');
    },

    /**
     * User approves the quotation (QUOTATION_APPROVED → APPROVED)
     * @param {number} requestId
     */
    userApproveQuotation: async (requestId) => {
        const response = await post(`/api/request/${requestId}/approve-quotation`, {});
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to approve quotation');
        }
        return response.json();
    },

    /**
     * Generate vendor purchase list (APPROVED → PENDING_SA_APPROVAL)
     * @param {number} requestId
     */
    generateVendorList: async (requestId) => {
        const response = await post(`/api/admin/requests/${requestId}/generate-lists`, {});
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to generate vendor list');
        }
        return response.json();
    },

    /**
     * Submit negotiation request (QUOTATION_APPROVED → NEGOTIATION_PENDING)
     * @param {number} requestId
     * @param {Object} payload - NegotiationRequestDto
     */
    negotiateQuotation: async (requestId, payload) => {
        const response = await post(`/api/request/${requestId}/negotiate`, payload);
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to submit negotiation');
        }
        return response.json();
    },
};
