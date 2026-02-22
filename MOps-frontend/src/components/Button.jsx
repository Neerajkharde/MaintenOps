import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    loading = false,
    ...props
}) => {
    const baseStyles = "h-10 px-6 rounded-pill font-ui text-[14px] font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none";

    const variants = {
        primary: "bg-primary text-white hover:shadow-sm hover:brightness-110",
        secondary: "bg-primary-container text-primary hover:brightness-95",
        outline: "border border-outline text-primary hover:bg-primary-container/20",
        ghost: "bg-transparent text-on-surface-variant hover:bg-surface-variant",
        danger: "bg-error text-white hover:brightness-110 shadow-sm",
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
                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
