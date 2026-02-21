import React from 'react';
import VendorList from '../../../components/dashboard/admin/VendorList';

const VendorsPage = () => {
    return (
        <div className="p-8">
            <h1 className="text-[28px] font-['Google_Sans_Display',sans-serif] text-[#202124] mb-6">Vendors</h1>
            <div className="max-w-4xl">
                <VendorList />
            </div>
        </div>
    );
};

export default VendorsPage;
