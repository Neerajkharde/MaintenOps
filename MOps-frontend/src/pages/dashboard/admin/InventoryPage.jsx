import React from 'react';
import InventoryStatus from '../../../components/dashboard/admin/InventoryStatus';

const InventoryPage = () => {
    return (
        <div className="p-8">
            <h1 className="text-[28px] font-['Google_Sans_Display',sans-serif] text-[#202124] mb-6">Inventory</h1>
            <div className="max-w-4xl">
                <InventoryStatus />
            </div>
        </div>
    );
};

export default InventoryPage;
