import React from 'react';
import EscalationAlerts from '../../../components/dashboard/superadmin/EscalationAlerts';

const EscalationsPage = () => {
    return (
        <div className="p-8">
            <h1 className="text-[28px] font-['Google_Sans_Display',sans-serif] text-[#202124] mb-1">Escalations</h1>
            <p className="text-[14px] text-[#5f6368] mb-6">Review overdue requests and SLA breaches.</p>
            <div className="max-w-5xl">
                <EscalationAlerts />
            </div>
        </div>
    );
};

export default EscalationsPage;
