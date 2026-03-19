import React, { useState, useEffect } from 'react';
import { quotationService } from '../../services/materialService';

const X = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Save = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const Info = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const NegotiationModal = ({ isOpen, onClose, request, onNegotiated }) => {
  const [items, setItems] = useState([]);
  const [overallNote, setOverallNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && request?.id) {
      fetchQuotation();
    }
  }, [isOpen, request]);

  const fetchQuotation = async () => {
    setLoading(true);
    try {
      const data = await quotationService.getQuotation(request.id);
      setItems(data.materials.map(m => ({
        ...m,
        negotiatedQuantity: m.negotiationQuantity || m.quantity,
        negotiationReason: m.negotiationReason || ''
      })));
      setOverallNote(request.negotiationNote || '');
    } catch (error) {
      console.error('Error fetching quotation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id, val) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, negotiatedQuantity: val } : item
    ));
  };

  const handleReasonChange = (id, val) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, negotiationReason: val } : item
    ));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        overallNote,
        items: items.map(item => ({
          materialId: item.id,
          quantity: item.negotiatedQuantity,
          reason: item.negotiationReason
        }))
      };
      await quotationService.negotiateQuotation(request.id, payload);
      onNegotiated();
      onClose();
    } catch (error) {
      console.error('Error submitting negotiation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-orange-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Request Negotiation</h2>
            <p className="text-sm text-gray-500 mt-1">Request modifications to the quotation for {request.requestNumber}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-orange-100 rounded-full transition-colors text-gray-400 hover:text-orange-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4">Loading material list...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Note Section */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                <Info className="text-blue-500 flex-shrink-0" size={20} />
                <p className="text-sm text-blue-800">
                  You can request a change in quantities for specific items. Please provide a valid reason for each change to help the admin understand your requirements.
                </p>
              </div>

              {/* Material Table */}
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Material / Specification</th>
                      <th className="px-6 py-4 font-semibold w-32 text-center">Current Qty</th>
                      <th className="px-6 py-4 font-semibold w-40 text-center">Negotiated Qty</th>
                      <th className="px-6 py-4 font-semibold">Reason for Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{item.materialName}</div>
                          {item.specification && (
                            <div className="text-sm text-gray-500 mt-0.5">{item.specification}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600 font-medium">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.negotiatedQuantity}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <textarea
                            value={item.negotiationReason}
                            onChange={(e) => handleReasonChange(item.id, e.target.value)}
                            placeholder="Why do you need this change?"
                            rows="1"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none overflow-hidden"
                            onInput={(e) => {
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                          ></textarea>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Overall Note */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Overall Negotiation Note (Optional)</label>
                <textarea
                  value={overallNote}
                  onChange={(e) => setOverallNote(e.target.value)}
                  placeholder="Add any additional comments for the admin..."
                  className="w-full h-32 px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || loading}
            className="px-8 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 disabled:opacity-50 disabled:translate-y-0"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <Save size={20} />
                Submit Negotiation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NegotiationModal;
