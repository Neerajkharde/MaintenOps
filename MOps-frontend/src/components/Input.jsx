import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-[14px] font-medium font-ui text-on-surface ml-1">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full h-11 px-4 rounded-md border text-[15px] outline-none transition-all duration-200 font-body
          ${error
                        ? 'border-error focus:border-error focus:ring-1 focus:ring-error bg-error-container/5'
                        : 'border-outline focus:border-primary focus:ring-1 focus:ring-primary hover:border-on-surface-variant'
                    }
          bg-white text-on-surface placeholder:text-on-surface-variant/50
          ${className}
        `}
                {...props}
            />
            {error && <span className="text-[12px] text-error ml-1 font-ui">{error}</span>}
        </div>
    );
};

export default Input;
