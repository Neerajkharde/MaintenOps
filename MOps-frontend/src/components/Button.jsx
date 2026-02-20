import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    loading = false,
    ...props
}) => {
    const baseStyles = "h-11 px-5 rounded-[8px] font-medium text-[15px] transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1";

    const variants = {
        primary: "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-[0_1px_2px_rgba(0,0,0,0.05)] focus:ring-blue-500",
        secondary: "bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] shadow-[0_1px_2px_rgba(0,0,0,0.05)] focus:ring-gray-200",
        ghost: "bg-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]",
        outline: "border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]",
    };

    return (
        <button
            className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
