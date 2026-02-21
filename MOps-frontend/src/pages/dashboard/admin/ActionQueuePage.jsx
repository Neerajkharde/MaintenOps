import React from 'react';
import ActionQueue from '../../../components/dashboard/admin/ActionQueue';

const ActionQueuePage = () => {
    return (
        <div className="p-8">
            <h1 className="text-[28px] font-['Google_Sans_Display',sans-serif] text-[#202124] mb-6">Action Queue</h1>
            <ActionQueue />
        </div>
    );
};

export default ActionQueuePage;
