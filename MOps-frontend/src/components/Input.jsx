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
          w-full h-12 px-4 rounded-xl border text-[15px] outline-none transition-all duration-300 font-body
          ${error
                        ? 'border-error ring-1 ring-error/20 bg-error-container/5'
                        : 'border-outline focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-on-surface-variant/40 bg-white'
                    }
          text-on-surface placeholder:text-on-surface-variant/40 shadow-sm focus:shadow-md
          ${className}
        `}
                {...props}
            />
            {error && <span className="text-[12px] text-error ml-1 font-ui">{error}</span>}
        </div>
    );
};

export default Input;
