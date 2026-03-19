import React, { useState, useEffect } from 'react';
import { materialService, vendorService } from '../../services/materialService';

/**
 * MaterialPicker — lets admin select materials with specs, all vendors, price, and quantity.
 * Calls onMaterialsChange whenever the selected list changes.
 */
const MaterialPicker = ({ onMaterialsChange, initialItems = [] }) => {
    const [allMaterials, setAllMaterials] = useState([]);
    const [allVendors, setAllVendors] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Track if we've initialized the items from prop
    const [hasInitialized, setHasInitialized] = useState(false);

    // Current row being built
    const [currentItem, setCurrentItem] = useState({
        materialId: 0,
        specificationId: 0,
        quantity: '',
        vendorId: 0,
        unitPrice: '',
    });

    useEffect(() => {
        if (!hasInitialized && initialItems && initialItems.length > 0 && allMaterials.length > 0 && allVendors.length > 0) {
            const mapped = initialItems.map(item => {
                const mat = allMaterials.find(m => m.materialId === item.materialId);
                const spec = mat?.specifications.find(s => s.id === item.specificationId);
                const vend = allVendors.find(v => v.id === item.vendorId);

                return {
                    materialId: item.materialId,
                    specificationId: item.specificationId,
                    materialName: item.materialName || mat?.materialName || 'Unknown',
                    specification: item.specification || spec?.specification || '',
                    quantity: Number(item.quantity),
                    vendorId: item.vendorId,
                    vendorName: item.vendorName || vend?.name || 'Unknown',
                    unitPrice: Number(item.unitPrice),
                    total: Number(item.quantity) * Number(item.unitPrice),
                    // Include negotiation info if present
                    negotiationQuantity: item.negotiationQuantity,
                    negotiationReason: item.negotiationReason
                };
            });
            setSelectedItems(mapped);
            setHasInitialized(true);
        }
    }, [initialItems, hasInitialized, allMaterials, allVendors]);
    const [selectedMaterialDetails, setSelectedMaterialDetails] = useState(null);
    const [addError, setAddError] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    // Load data on mount
    useEffect(() => {
        setLoading(true);
        Promise.all([
            materialService.getAllMaterials(),
            vendorService.getAllVendors()
        ]).then(([mats, vends]) => {
            setAllMaterials(mats);
            setAllVendors(vends);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    // Notify parent whenever selectedItems changes
    useEffect(() => {
        const totalCost = selectedItems.reduce((sum, i) => sum + i.total, 0);
        const description = selectedItems
            .map(i => `${i.materialName}${i.specification ? ` (${i.specification})` : ''} x${i.quantity}`)
            .join(', ');
        onMaterialsChange(selectedItems, totalCost, description);
    }, [selectedItems]);

    const handleMaterialChange = async (materialId, isInitialLoad = false) => {
        if (!isInitialLoad) {
            setCurrentItem({ materialId, specificationId: 0, quantity: '', vendorId: 0, unitPrice: '' });
        }
        setSelectedMaterialDetails(null);
        setAddError('');
        if (!materialId) return;

        setLoading(true);
        try {
            const details = await materialService.getMaterialDetails(materialId);
            setSelectedMaterialDetails(details);
            
            // Auto-fill last purchase rate if available
            if (details.lastPurchaseRate) {
                setCurrentItem(prev => ({ ...prev, materialId, unitPrice: String(details.lastPurchaseRate) }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSpecChange = async (specId) => {
        setCurrentItem(prev => ({ ...prev, specificationId: specId }));
    };

    const handleAddItem = () => {
        const { materialId, quantity, vendorId, unitPrice } = currentItem;
        if (!materialId || !quantity || !vendorId || !unitPrice) {
            setAddError('Please fill in all required fields (Material, Quantity, Vendor, Rate).');
            return;
        }
        const qty = parseFloat(quantity);
        const price = parseFloat(unitPrice);
        if (isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) {
            setAddError('Quantity and Rate must be positive numbers.');
            return;
        }
        setAddError('');

        const material = allMaterials.find(m => m.materialId === materialId);
        const spec = selectedMaterialDetails?.specifications?.find(s => s.id === currentItem.specificationId);
        const vendor = allVendors.find(v => v.id === vendorId);

        const newItem = {
            materialId,
            materialName: material?.materialName || '',
            specificationId: currentItem.specificationId || null,
            specification: spec?.specification || '',
            quantity: qty,
            unit: material?.defaultUnit || '',
            unitPrice: price,
            vendorId,
            vendorName: vendor?.name || '',
            total: qty * price,
        };

        if (editingIndex !== null) {
            setSelectedItems(prev => {
                const updated = [...prev];
                updated[editingIndex] = newItem;
                return updated;
            });
            setEditingIndex(null);
        } else {
            setSelectedItems(prev => [...prev, newItem]);
        }

        // Reset form
        setCurrentItem({ materialId: 0, specificationId: 0, quantity: '', vendorId: 0, unitPrice: '' });
        setSelectedMaterialDetails(null);
    };

    const handleEditItem = (index) => {
        const item = selectedItems[index];
        setEditingIndex(index);
        
        // Load details for the form
        setCurrentItem({
            materialId: item.materialId,
            specificationId: item.specificationId || 0,
            quantity: String(item.quantity),
            vendorId: item.vendorId,
            unitPrice: String(item.unitPrice),
        });

        // Fetch material details for specs
        handleMaterialChange(item.materialId, true).then(() => {
            setCurrentItem(prev => ({ ...prev, specificationId: item.specificationId || 0 }));
        });
    };

    const handleRemoveItem = (index) => {
        setSelectedItems(prev => prev.filter((_, i) => i !== index));
    };

    const grandTotal = selectedItems.reduce((s, i) => s + i.total, 0);

    return (
        <div className="space-y-5">

            {/* ── Add Material Form ──────────────────────────────────────────── */}
            <div className="border border-[#dadce0] rounded-[16px] p-5 bg-[#f8f9fa] space-y-4">
                <h3 className="text-[15px] font-['Google_Sans',sans-serif] font-semibold text-[#202124]">
                    {editingIndex !== null ? 'Edit Material Item' : 'Add Material'}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Material selection */}
                    <div className="col-span-2">
                        <label className="block text-[12px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1">
                            Select Material <span className="text-[#c5221f]">*</span>
                        </label>
                        <select
                            value={currentItem.materialId}
                            onChange={e => handleMaterialChange(Number(e.target.value))}
                            className="w-full h-10 px-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8] bg-white transition-all"
                        >
                            <option value={0}>Choose a material...</option>
                            {allMaterials.map(m => (
                                <option key={m.materialId} value={m.materialId}>
                                    {m.materialName} ({m.defaultUnit})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Specification */}
                    {selectedMaterialDetails?.specifications?.length > 0 && (
                        <div>
                            <label className="block text-[12px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1">
                                Specification
                            </label>
                            <select
                                value={currentItem.specificationId}
                                onChange={e => handleSpecChange(Number(e.target.value))}
                                className="w-full h-10 px-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8] bg-white"
                            >
                                <option value={0}>Select spec</option>
                                {selectedMaterialDetails.specifications.map(s => (
                                    <option key={s.id} value={s.id}>{s.specification}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Quantity */}
                    <div>
                        <label className="block text-[12px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1">
                            Quantity{selectedMaterialDetails ? ` (${selectedMaterialDetails.defaultUnit})` : ''} <span className="text-[#c5221f]">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={currentItem.quantity}
                            onChange={e => setCurrentItem(prev => ({ ...prev, quantity: e.target.value }))}
                            placeholder="0"
                            className="w-full h-10 px-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8]"
                        />
                    </div>

                    {/* Vendor Choice - Any vendor from database */}
                    <div>
                        <label className="block text-[12px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1">
                            Choose Vendor <span className="text-[#c5221f]">*</span>
                        </label>
                        <select
                            value={currentItem.vendorId}
                            onChange={e => setCurrentItem(prev => ({ ...prev, vendorId: Number(e.target.value) }))}
                            className="w-full h-10 px-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8] bg-white transition-all shadow-sm"
                        >
                            <option value={0}>Select any vendor...</option>
                            {allVendors.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rate / Unit Price */}
                    <div>
                        <label className="block text-[12px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1">
                            Rate (₹) <span className="text-[#c5221f]">*</span>
                            {selectedMaterialDetails?.lastPurchaseRate && (
                                <span className="text-[11px] text-[#1a73e8] ml-2">
                                    Db Sug.: ₹{selectedMaterialDetails.lastPurchaseRate}
                                </span>
                            )}
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={currentItem.unitPrice}
                            onChange={e => setCurrentItem(prev => ({ ...prev, unitPrice: e.target.value }))}
                            placeholder="0.00"
                            className="w-full h-10 px-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8]"
                        />
                    </div>

                    {/* Item total preview */}
                    {currentItem.quantity > 0 && currentItem.unitPrice > 0 && (
                        <div className="flex items-end">
                            <div className="flex items-center gap-2 bg-[#6366f1]/5 border border-[#6366f1]/10 rounded-[8px] px-4 h-10 w-full">
                                <span className="text-[12px] text-[#6366f1]/70">Line total:</span>
                                <span className="text-[14px] font-bold text-[#6366f1]">
                                    ₹{(parseFloat(currentItem.quantity) * parseFloat(currentItem.unitPrice)).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {addError && (
                    <div className="px-3 py-2 bg-[#fce8e6] border border-[#fad2cf] rounded-[8px] text-[13px] text-[#c5221f]">
                        {addError}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleAddItem}
                        disabled={loading}
                        className={`flex items-center gap-2 px-5 py-2 rounded-[50px] text-[14px] font-['Google_Sans',sans-serif] font-medium transition-colors disabled:opacity-60 ${editingIndex !== null ? 'bg-[#1e8e3e] hover:bg-[#188038] text-white' : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white'}`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={editingIndex !== null ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                        </svg>
                        {editingIndex !== null ? 'Update Item' : 'Add to Quotation'}
                    </button>

                    {editingIndex !== null && (
                        <button
                            onClick={() => {
                                setEditingIndex(null);
                                setCurrentItem({ materialId: 0, specificationId: 0, quantity: '', vendorId: 0, unitPrice: '' });
                                setSelectedMaterialDetails(null);
                            }}
                            className="text-[13px] text-[#5f6368] hover:text-[#202124] hover:underline font-medium"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </div>

            {/* ── Selected Items Table ───────────────────────────────────────── */}
            {selectedItems.length > 0 && (
                <div className="border border-[#dadce0] rounded-[16px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px]">
                            <thead className="bg-[#f8f9fa] border-b border-[#dadce0]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[#5f6368] font-medium">Material</th>
                                    <th className="px-4 py-3 text-left text-[#5f6368] font-medium">Spec</th>
                                    <th className="px-4 py-3 text-right text-[#5f6368] font-medium">Qty</th>
                                    <th className="px-4 py-3 text-right text-[#5f6368] font-medium">Rate (₹)</th>
                                    <th className="px-4 py-3 text-left text-[#5f6368] font-medium">Vendor</th>
                                    <th className="px-4 py-3 text-right text-[#5f6368] font-medium">Total (₹)</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedItems.map((item, idx) => (
                                    <tr key={idx} className="border-t border-[#f1f3f4] hover:bg-[#f8f9fa]">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-[#202124]">{item.materialName}</div>
                                            {item.negotiationQuantity && (
                                                <div className="mt-1 flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-1.5 bg-[#fef3c7] border border-[#f59e0b]/20 rounded px-1.5 py-0.5 w-fit">
                                                        <span className="text-[10px] text-[#b45309] font-bold">NEGOTIATION: {item.negotiationQuantity} {item.unit}</span>
                                                    </div>
                                                    {item.negotiationReason && (
                                                        <span className="text-[10px] text-[#b45309]/70 italic leading-tight pl-1">
                                                            "{item.negotiationReason}"
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-[#5f6368]">{item.specification || '—'}</td>
                                        <td className="px-4 py-3 text-right">{item.quantity} {item.unit}</td>
                                        <td className="px-4 py-3 text-right">₹{item.unitPrice.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-[#5f6368]">{item.vendorName}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-[#202124]">₹{item.total.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleEditItem(idx)}
                                                    className="text-[#1a73e8] hover:text-[#174ea6] p-1.5 rounded-full hover:bg-[#e8f0fe] transition-colors"
                                                    title="Edit this item"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveItem(idx)}
                                                    className="text-[#c5221f] hover:text-[#a50e0e] p-1.5 rounded-full hover:bg-[#fce8e6] transition-colors"
                                                    title="Remove"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-[#f8f9fa] border-t-2 border-[#dadce0]">
                                <tr>
                                    <td colSpan={5} className="px-4 py-3 text-right font-semibold text-[#202124]">
                                        TOTAL ESTIMATED COST:
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-[16px] text-[#1a73e8]">
                                        ₹{grandTotal.toFixed(2)}
                                    </td>
                                    <td />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialPicker;
