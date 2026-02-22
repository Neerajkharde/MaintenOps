import React, { useState, useEffect, useCallback } from 'react';
import { materialService } from '../../services/materialService';

/**
 * MaterialPicker — lets admin select materials with specs, vendors, price, and quantity.
 * Calls onMaterialsChange whenever the selected list changes.
 */
const MaterialPicker = ({ onMaterialsChange }) => {
    const [allMaterials, setAllMaterials] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Current row being built
    const [currentItem, setCurrentItem] = useState({
        materialId: 0,
        specificationId: 0,
        quantity: '',
        vendorId: 0,
        unitPrice: '',
    });
    const [selectedMaterialDetails, setSelectedMaterialDetails] = useState(null);
    const [addError, setAddError] = useState('');

    // Load all materials on mount
    useEffect(() => {
        materialService.searchMaterials().then(setAllMaterials).catch(console.error);
    }, []);

    // Notify parent whenever selectedItems changes
    useEffect(() => {
        const totalCost = selectedItems.reduce((sum, i) => sum + i.total, 0);
        const description = selectedItems
            .map(i => `${i.materialName}${i.specification ? ` (${i.specification})` : ''} x${i.quantity}`)
            .join(', ');
        onMaterialsChange(selectedItems, totalCost, description);
    }, [selectedItems]);

    // Debounced material search
    useEffect(() => {
        if (searchQuery.trim().length === 0) {
            materialService.searchMaterials().then(setAllMaterials).catch(console.error);
            return;
        }
        const timer = setTimeout(() => {
            materialService.searchMaterials(searchQuery).then(setAllMaterials).catch(console.error);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleMaterialChange = async (materialId) => {
        setCurrentItem({ materialId, specificationId: 0, quantity: '', vendorId: 0, unitPrice: '' });
        setSelectedMaterialDetails(null);
        setAddError('');
        if (!materialId) return;

        setLoading(true);
        try {
            const details = await materialService.getMaterialDetails(materialId);
            setSelectedMaterialDetails(details);
            // Auto-select preferred vendor
            const preferred = details.vendors?.find(v => v.isPreferred);
            if (preferred) {
                setCurrentItem(prev => ({ ...prev, materialId, vendorId: preferred.id }));
            }
            // Auto-fill last purchase rate
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
        if (!specId || !currentItem.materialId) return;
        // Fetch spec-specific rate
        try {
            const details = await materialService.getMaterialDetails(currentItem.materialId);
            if (details.lastPurchaseRate) {
                setCurrentItem(prev => ({ ...prev, specificationId: specId, unitPrice: String(details.lastPurchaseRate) }));
            }
        } catch { /* non-critical */ }
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
        const vendor = selectedMaterialDetails?.vendors?.find(v => v.id === vendorId);

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
            lastPurchaseRate: selectedMaterialDetails?.lastPurchaseRate,
            total: qty * price,
        };

        setSelectedItems(prev => [...prev, newItem]);
        // Reset form
        setCurrentItem({ materialId: 0, specificationId: 0, quantity: '', vendorId: 0, unitPrice: '' });
        setSelectedMaterialDetails(null);
        setSearchQuery('');
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
                    Add Material
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Material search */}
                    <div className="col-span-2">
                        <label className="block text-[12px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1">
                            Search & Select Material <span className="text-[#c5221f]">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search materials..."
                                className="flex-1 h-10 px-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8]"
                            />
                            <select
                                value={currentItem.materialId}
                                onChange={e => handleMaterialChange(Number(e.target.value))}
                                className="flex-1 h-10 px-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8] bg-white"
                            >
                                <option value={0}>Select material</option>
                                {allMaterials.map(m => (
                                    <option key={m.materialId} value={m.materialId}>
                                        {m.materialName} ({m.defaultUnit})
                                    </option>
                                ))}
                            </select>
                        </div>
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

                    {/* Rate / Unit Price */}
                    <div>
                        <label className="block text-[12px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1">
                            Rate (₹) <span className="text-[#c5221f]">*</span>
                            {selectedMaterialDetails?.lastPurchaseRate && (
                                <span className="text-[11px] text-[#1a73e8] ml-2">
                                    Last: ₹{selectedMaterialDetails.lastPurchaseRate}
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

                    {/* Vendor */}
                    {selectedMaterialDetails && (
                        <div>
                            <label className="block text-[12px] font-['Google_Sans',sans-serif] font-medium text-[#5f6368] mb-1">
                                Vendor <span className="text-[#c5221f]">*</span>
                            </label>
                            <select
                                value={currentItem.vendorId}
                                onChange={e => setCurrentItem(prev => ({ ...prev, vendorId: Number(e.target.value) }))}
                                className="w-full h-10 px-3 border-[1.5px] border-[#dadce0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#1a73e8] bg-white"
                            >
                                <option value={0}>Select vendor</option>
                                {selectedMaterialDetails.vendors?.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.name} {v.isPreferred ? '⭐' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Item total preview */}
                    {currentItem.quantity > 0 && currentItem.unitPrice > 0 && (
                        <div className="col-span-2 flex items-center gap-2 bg-[#e8f0fe] rounded-[8px] px-4 py-2">
                            <span className="text-[13px] text-[#1a73e8]">Item total:</span>
                            <span className="text-[14px] font-semibold text-[#1a73e8]">
                                ₹{(parseFloat(currentItem.quantity) * parseFloat(currentItem.unitPrice)).toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>

                {addError && (
                    <div className="px-3 py-2 bg-[#fce8e6] border border-[#fad2cf] rounded-[8px] text-[13px] text-[#c5221f]">
                        {addError}
                    </div>
                )}

                <button
                    onClick={handleAddItem}
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2 rounded-[50px] text-[14px] font-['Google_Sans',sans-serif] font-medium transition-colors disabled:opacity-60"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add to Quotation
                </button>
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
                                        <td className="px-4 py-3 font-medium text-[#202124]">{item.materialName}</td>
                                        <td className="px-4 py-3 text-[#5f6368]">{item.specification || '—'}</td>
                                        <td className="px-4 py-3 text-right">{item.quantity} {item.unit}</td>
                                        <td className="px-4 py-3 text-right">₹{item.unitPrice.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-[#5f6368]">{item.vendorName}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-[#202124]">₹{item.total.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleRemoveItem(idx)}
                                                className="text-[#c5221f] hover:text-[#a50e0e] p-1 rounded-full hover:bg-[#fce8e6] transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
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
