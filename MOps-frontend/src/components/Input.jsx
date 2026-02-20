import React from 'react';

const Input = ({ label, error, ...props }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-[14px] font-medium text-[#0F172A]">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full h-11 px-3.5 rounded-[8px] border text-[15px] outline-none transition-all duration-200
          ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] hover:border-[#CBD5E1]'
                    }
          bg-white text-[#0F172A] placeholder:text-[#94A3B8]
        `}
                {...props}
            />
            {error && <span className="text-[13px] text-red-500">{error}</span>}
        </div>
    );
};

export default Input;
