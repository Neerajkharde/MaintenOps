import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestService } from '../../../services/requestService';
import { quotationService } from '../../../services/materialService';
import MaterialPicker from '../../../components/requests/MaterialPicker';

/**
 * CreateQuotationPage — Admin page for building a structured quotation.
 * Route: /admin/create-quotation/:requestId
 */
const CreateQuotationPage = () => {
    const { requestId } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] = useState(null);
    const [loadingRequest, setLoadingRequest] = useState(true);

    const [materials, setMaterials] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [description, setDescription] = useState('');
    const [estimatedDays, setEstimatedDays] = useState(7);
    const [quotationNotes, setQuotationNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Fetch request details
        fetch(`/api/request/admin/${requestId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
            },
            credentials: 'include',
        })
            .then(r => r.json())
            .then(setRequest)
            .catch(console.error)
            .finally(() => setLoadingRequest(false));
    }, [requestId]);

    const handleMaterialsChange = (items, total, desc) => {
        setMaterials(items);
        setTotalCost(total);
        setDescription(desc);
    };

    const handleSubmit = async () => {
        if (materials.length === 0) {
            setError('Please add at least one material to the quotation.');
            return;
        }
        if (!estimatedDays || estimatedDays < 1) {
            setError('Please enter a valid estimated completion time.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await quotationService.createQuotation({
                requestId: Number(requestId),
                materials: materials.map(m => ({
                    materialId: m.materialId,
                    specificationId: m.specificationId || null,
                    quantity: m.quantity,
                    vendorId: m.vendorId,
                    unitPrice: m.unitPrice,
                })),
                estimatedDays: Number(estimatedDays),
                quotationNotes: quotationNotes || null,
            });

            setSuccess(true);
            // Navigate back to review modal after short delay to show success state
            setTimeout(() => navigate(`/admin/queue?openReview=${requestId}`), 1000);
        } catch (err) {
            setError(err.message || 'Failed to create quotation.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingRequest) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">

            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate(`/admin/queue?openReview=${requestId}`)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#e8eaed] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-[22px] font-['Google_Sans_Display',sans-serif] font-bold text-[#202124]">
                        Create Quotation
                    </h1>
                    <p className="text-[14px] text-[#5f6368]">
                        {request ? `Request ${request.requestNumber} — ${request.requesterName}` : `Request #${requestId}`}
                    </p>
                </div>
            </div>

            {/* Request Summary Card */}
            {request && (
                <div className="mb-6 bg-[#f8f9fa] border border-[#f1f3f4] rounded-[16px] p-5">
                    <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                            <div className="text-[11px] text-[#5f6368] mb-1">Service</div>
                            <div className="inline-block px-2 py-[3px] rounded-[50px] bg-[#e6f4ea] text-[#137333] text-[12px] font-medium">
                                {request.serviceDepartmentName}
                            </div>
                        </div>
                        <div>
                            <div className="text-[11px] text-[#5f6368] mb-1">Department</div>
                            <div className="text-[13px] font-medium text-[#202124]">{request.organizationDepartmentName}</div>
                        </div>
                        <div>
                            <div className="text-[11px] text-[#5f6368] mb-1">Required By</div>
                            <div className="text-[13px] font-medium text-[#202124]">
                                {request.requiredDate ? new Date(request.requiredDate).toLocaleDateString('en-IN') : 'Not set'}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-[11px] text-[#5f6368] mb-1">Work Description</div>
                        <p className="text-[13px] text-[#3c4043] bg-white border border-[#dadce0] rounded-[8px] p-3 leading-relaxed">
                            {request.itemDescription}
                        </p>
                    </div>
                </div>
            )}

            {/* Material Picker */}
            <div className="mb-6">
                <h2 className="text-[16px] font-['Google_Sans',sans-serif] font-semibold text-[#202124] mb-4">
                    Select Materials
                </h2>
                <MaterialPicker onMaterialsChange={handleMaterialsChange} />
            </div>

            {/* Quotation Details */}
            <div className="border border-[#dadce0] rounded-[16px] p-5 space-y-4">
                <h2 className="text-[16px] font-['Google_Sans',sans-serif] font-semibold text-[#202124]">
                    Quotation Details
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[13px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1.5">
                            Estimated Completion Time (days) <span className="text-[#c5221f]">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={estimatedDays}
                            onChange={e => setEstimatedDays(e.target.value)}
                            className="w-full h-10 px-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8]"
                        />
                    </div>

                    <div className="flex items-end">
                        <div className="bg-[#e8f0fe] rounded-[12px] px-5 py-3 w-full">
                            <div className="text-[12px] text-[#1a73e8] mb-1">Total Estimated Cost</div>
                            <div className="text-[22px] font-bold text-[#1a73e8]">₹{totalCost.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[13px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1.5">
                        Internal Admin Notes <span className="text-[11px] text-[#80868b]">(not visible to requester)</span>
                    </label>
                    <textarea
                        value={quotationNotes}
                        onChange={e => setQuotationNotes(e.target.value)}
                        rows={3}
                        placeholder="Optional notes for SA..."
                        className="w-full p-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8] resize-none"
                    />
                </div>

                {/* Auto-generated description */}
                {description && (
                    <div className="bg-[#f8f9fa] border border-[#f1f3f4] rounded-[8px] p-3">
                        <div className="text-[12px] text-[#5f6368] mb-1 font-medium">Auto-Generated Description</div>
                        <p className="text-[13px] text-[#3c4043]">{description}</p>
                    </div>
                )}

                {error && (
                    <div className="px-4 py-3 bg-[#fce8e6] border border-[#fad2cf] rounded-[8px] text-[#c5221f] text-[13px]">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="px-4 py-3 bg-[#e6f4ea] border border-[#ceead6] rounded-[8px] text-[#137333] text-[13px] flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Quotation saved! Returning to review form...
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    {/* Save quotation to DB (does NOT change status) */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || materials.length === 0 || success}
                        className="px-6 py-[10px] rounded-[50px] text-[14px] font-['Google_Sans',sans-serif] font-medium bg-[#1a73e8] hover:bg-[#1557b0] text-white transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        {isSubmitting ? 'Saving...' : 'Save Quotation'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuotationPage;
