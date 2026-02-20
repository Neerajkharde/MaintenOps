import React, { useState, useEffect } from 'react';

const NewRequestModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [selectedDept, setSelectedDept] = useState(null);
    const [isUrgent, setIsUrgent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showJustification, setShowJustification] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        applicantName: '',
        contactNo: '',
        description: '',
        urgentJustification: ''
    });

    const [errors, setErrors] = useState({});

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedDept(null);
            setIsUrgent(false);
            setIsSuccess(false);
            setFormData({ applicantName: '', contactNo: '', description: '', urgentJustification: '' });
            setErrors({});
        }
    }, [isOpen]);

    const departments = [
        { id: 'plumbing', label: 'Plumbing', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', color: '#1a73e8', bg: 'bg-[#1a73e8]/10' },
        { id: 'carpentry', label: 'Carpentry', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: '#f9ab00', bg: 'bg-[#f9ab00]/10' }, // Replaced with generic tool icon for stability
        { id: 'electrical', label: 'Electrical', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: '#c5221f', bg: 'bg-[#c5221f]/10' },
        { id: 'em', label: 'EM', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: '#137333', bg: 'bg-[#137333]/10' }
    ];

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.applicantName.trim()) newErrors.applicantName = 'Name is required';
        if (!formData.contactNo.trim() || !/^\d{10}$/.test(formData.contactNo)) newErrors.contactNo = 'Valid 10-digit number required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (isUrgent && !formData.urgentJustification.trim()) newErrors.urgentJustification = 'Justification is required for urgent requests';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateStep2()) {
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                setIsSuccess(true);
            }, 1500);
        }
    };

    const handleUrgentToggle = () => {
        setIsUrgent(!isUrgent);
        if (!isUrgent) {
            // Slight delay for animation natural feel
            setTimeout(() => setShowJustification(true), 50);
        } else {
            setShowJustification(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] transition-opacity" onClick={onClose}></div>

            {/* Modal Container */}
            <div className="bg-white rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] w-full max-w-[680px] max-h-[90vh] flex flex-col relative overflow-hidden animate-fade-in-up">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f1f3f4] transition-colors z-20">
                    <svg className="w-5 h-5 text-[#5f6368]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* SUCCESS STATE */}
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center h-full p-12 text-center animate-fade-in-up">
                        <div className="w-20 h-20 rounded-full bg-[#e6f4ea] flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-[#137333]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="font-google-sans text-[24px] text-[#202124] mb-2">Request Submitted!</h2>
                        <p className="font-body text-[14px] text-[#5f6368] mb-8 max-w-[300px]">
                            Your token number is <span className="font-bold text-[#202124]">#3802</span>. You'll be notified at each stage.
                        </p>
                        <button onClick={onClose} className="bg-[#137333] text-white font-google-sans font-medium text-[14px] px-8 py-3 rounded-full hover:bg-[#0d652d] transition-colors shadow-google-1">
                            View My Requests
                        </button>
                    </div>
                ) : (
                    <>
                        {/* HEADER: STEPPER */}
                        <div className="bg-white px-8 pt-8 pb-4 border-b border-[#dadce0] z-10">
                            <div className="flex items-center justify-center max-w-[320px] mx-auto relative">
                                {/* Connector Line */}
                                <div className="absolute top-3 left-0 w-full h-[2px] bg-[#dadce0] -z-10"></div>
                                <div
                                    className="absolute top-3 left-0 h-[2px] bg-[#1a73e8] -z-10 transition-all duration-500 ease-in-out"
                                    style={{ width: step === 2 ? '100%' : '50%' }}
                                ></div>

                                {/* Step 1 Bubble */}
                                <div className="flex-1 flex flex-col items-center gap-2 cursor-pointer" onClick={() => step === 2 && setStep(1)}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-[2px] 
                                        ${step >= 1 ? 'bg-[#1a73e8] border-[#1a73e8] text-white' : 'bg-white border-[#dadce0] text-[#5f6368]'}`}>
                                        {step > 1 ? (
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <span className="text-[12px] font-bold">1</span>
                                        )}
                                    </div>
                                    <span className={`text-[12px] font-medium ${step >= 1 ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`}>Choose Department</span>
                                </div>

                                {/* Step 2 Bubble */}
                                <div className="flex-1 flex flex-col items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-[2px] transition-colors duration-300
                                        ${step === 2 ? 'bg-[#1a73e8] border-[#1a73e8] text-white' : 'bg-white border-[#dadce0] text-[#5f6368]'}`}>
                                        <span className="text-[12px] font-bold">2</span>
                                    </div>
                                    <span className={`text-[12px] font-medium ${step === 2 ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`}>Request Details</span>
                                </div>
                            </div>
                        </div>

                        {/* CONTENT BODY */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden">
                            <div className="flex w-[200%] transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)" style={{ transform: `translateX(-${(step - 1) * 50}%)` }}>

                                {/* STEP 1 CONTENT */}
                                <div className="w-1/2 p-10 flex flex-col items-center">
                                    <h2 className="font-display text-[28px] text-[#202124] tracking-[-0.5px] mb-2 text-center">Select a Department</h2>
                                    <p className="font-body text-[14px] text-[#5f6368] mb-8 text-center">Choose the department responsible for your request.</p>

                                    <div className="grid grid-cols-2 gap-4 w-full max-w-[560px]">
                                        {departments.map((dept) => (
                                            <div
                                                key={dept.id}
                                                onClick={() => setSelectedDept(dept)}
                                                className={`relative bg-white border-[1.5px] rounded-[16px] p-6 cursor-pointer transition-all duration-200 group
                                                    ${selectedDept?.id === dept.id
                                                        ? 'border-[#1a73e8] bg-[#e8f0fe]'
                                                        : 'border-[#dadce0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'}`}
                                                style={{ borderColor: selectedDept?.id === dept.id ? '#1a73e8' : undefined }}
                                                onMouseEnter={(e) => {
                                                    if (selectedDept?.id !== dept.id) e.currentTarget.style.borderColor = dept.color;
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (selectedDept?.id !== dept.id) e.currentTarget.style.borderColor = '#dadce0';
                                                }}
                                            >
                                                {selectedDept?.id === dept.id && (
                                                    <div className="absolute top-4 right-4 bg-[#1a73e8] rounded-full p-1">
                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    </div>
                                                )}

                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${selectedDept?.id === dept.id ? 'bg-white' : dept.bg}`}>
                                                    <svg className="w-6 h-6" style={{ color: dept.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dept.icon} />
                                                    </svg>
                                                </div>
                                                <h3 className="font-google-sans text-[16px] font-medium text-[#202124] mb-1">{dept.label}</h3>
                                                <p className="font-body text-[13px] text-[#5f6368]">General repairs and maintenance</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* STEP 2 CONTENT */}
                                <div className="w-1/2 p-10 flex flex-col items-center">
                                    <div className="w-full max-w-[560px]">
                                        {/* Token Header */}
                                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#dadce0] border-dashed">
                                            <div className="flex items-center gap-4">
                                                <div className="border border-[#dadce0] rounded-[8px] px-3 py-1 bg-[#f8f9fa]">
                                                    <span className="font-display text-[20px] font-bold text-[#1a73e8]">#3802</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-google-sans text-[18px] font-medium text-[#202124]">{selectedDept?.label} Department</h3>
                                                    <p className="font-body text-[13px] text-[#5f6368]">ISKCON NVCC, Pune</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block font-google-sans text-[13px] font-medium text-[#5f6368] mb-1.5">Date</label>
                                                    <input type="text" value={new Date().toLocaleDateString('en-GB')} disabled className="w-full h-12 px-4 rounded-[8px] border border-[#dadce0] bg-[#f8f9fa] text-[#202124] font-body text-[15px]" />
                                                </div>
                                                <div>
                                                    <label className="block font-google-sans text-[13px] font-medium text-[#5f6368] mb-1.5">Department</label>
                                                    <div className="w-full h-12 px-4 rounded-[8px] border border-[#dadce0] bg-[#e8f0fe] flex items-center">
                                                        <span className="font-google-sans text-[14px] font-medium text-[#1a73e8]">{selectedDept?.label}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block font-google-sans text-[13px] font-medium text-[#5f6368] mb-1.5">Name of Applicant</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Your full name"
                                                        value={formData.applicantName}
                                                        onChange={e => setFormData({ ...formData, applicantName: e.target.value })}
                                                        className={`w-full h-12 px-4 rounded-[8px] border ${errors.applicantName ? 'border-[#c5221f]' : 'border-[#dadce0]'} focus:border-[#1a73e8] focus:ring-4 focus:ring-[#1a73e8]/10 outline-none text-[#202124] font-body text-[15px] transition-all`}
                                                    />
                                                    {errors.applicantName && <p className="text-[#c5221f] text-[12px] mt-1">{errors.applicantName}</p>}
                                                </div>
                                                <div>
                                                    <label className="block font-google-sans text-[13px] font-medium text-[#5f6368] mb-1.5">Contact No.</label>
                                                    <input
                                                        type="tel"
                                                        placeholder="10-digit mobile number"
                                                        value={formData.contactNo}
                                                        onChange={e => setFormData({ ...formData, contactNo: e.target.value })}
                                                        className={`w-full h-12 px-4 rounded-[8px] border ${errors.contactNo ? 'border-[#c5221f]' : 'border-[#dadce0]'} focus:border-[#1a73e8] focus:ring-4 focus:ring-[#1a73e8]/10 outline-none text-[#202124] font-body text-[15px] transition-all`}
                                                    />
                                                    {errors.contactNo && <p className="text-[#c5221f] text-[12px] mt-1">{errors.contactNo}</p>}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block font-google-sans text-[13px] font-medium text-[#5f6368] mb-1.5">Job Description</label>
                                                <textarea
                                                    rows="5"
                                                    placeholder="Describe the work needed in detail — e.g., Cupboard to make safe for phones, 8 items"
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    className={`w-full p-4 rounded-[8px] border ${errors.description ? 'border-[#c5221f]' : 'border-[#dadce0]'} focus:border-[#1a73e8] focus:ring-4 focus:ring-[#1a73e8]/10 outline-none text-[#202124] font-body text-[15px] resize-none transition-all`}
                                                ></textarea>
                                                <div className="flex justify-between mt-1">
                                                    {errors.description && <p className="text-[#c5221f] text-[12px]">{errors.description}</p>}
                                                    <p className="text-[#5f6368] text-[12px] ml-auto">{formData.description.length}/500</p>
                                                </div>
                                            </div>

                                            {/* Photo Upload Mock */}
                                            <div>
                                                <label className="block font-google-sans text-[13px] font-medium text-[#5f6368] mb-1.5">Upload Photos (optional)</label>
                                                <div className="border-[2px] border-dashed border-[#dadce0] rounded-[12px] p-8 flex flex-col items-center justify-center hover:bg-[#f8f9fa] hover:border-[#1a73e8] transition-colors cursor-pointer group">
                                                    <div className="w-10 h-10 rounded-full bg-[#f1f3f4] flex items-center justify-center mb-3 group-hover:bg-[#e8f0fe] transition-colors">
                                                        <svg className="w-6 h-6 text-[#5f6368] group-hover:text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    </div>
                                                    <p className="font-google-sans text-[14px] text-[#202124] mb-1">Drag photos here or click to browse</p>
                                                    <p className="font-body text-[12px] text-[#5f6368]">JPG, PNG up to 5MB each · Max 4 photos</p>
                                                </div>
                                            </div>

                                            {/* Urgent Toggle */}
                                            <div className="bg-[#f8f9fa] rounded-[12px] p-4 border border-[#dadce0]">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-google-sans text-[14px] font-medium text-[#202124]">Mark as Urgent</h4>
                                                        <p className="font-body text-[12px] text-[#5f6368]">Only use if work cannot wait</p>
                                                    </div>

                                                    {/* Custom Toggle Switch */}
                                                    <div
                                                        className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${isUrgent ? 'bg-[#c5221f]' : 'bg-[#dadce0]'}`}
                                                        onClick={handleUrgentToggle}
                                                    >
                                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${isUrgent ? 'left-[24px]' : 'left-1'}`}></div>
                                                    </div>
                                                </div>

                                                {/* Animated Justification Field */}
                                                <div className={`overflow-hidden transition-all duration-300 ${showJustification ? 'max-h-[120px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <textarea
                                                        rows="2"
                                                        placeholder="Explain why this is urgent..."
                                                        value={formData.urgentJustification}
                                                        onChange={e => setFormData({ ...formData, urgentJustification: e.target.value })}
                                                        className={`w-full p-3 rounded-[8px] border bg-white ${errors.urgentJustification ? 'border-[#c5221f]' : 'border-[#c5221f]'} focus:ring-2 focus:ring-[#c5221f]/10 outline-none text-[#202124] font-body text-[14px] resize-none`}
                                                    ></textarea>
                                                    {errors.urgentJustification && <p className="text-[#c5221f] text-[12px] mt-1">{errors.urgentJustification}</p>}
                                                </div>
                                            </div>

                                            {/* Official Use Only */}
                                            <div className="pt-6">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="h-[1px] bg-[#dadce0] flex-1"></div>
                                                    <span className="font-body text-[12px] text-[#bdc1c6] uppercase tracking-[1px] font-medium">For Official Use Only</span>
                                                    <div className="h-[1px] bg-[#dadce0] flex-1"></div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 opacity-70 pointer-events-none select-none grayscale">
                                                    <div>
                                                        <label className="block font-google-sans text-[12px] font-medium text-[#bdc1c6] mb-1">Estimated Cost</label>
                                                        <div className="h-10 border border-dashed border-[#dadce0] rounded-[6px] bg-[#f8f9fa]"></div>
                                                    </div>
                                                    <div>
                                                        <label className="block font-google-sans text-[12px] font-medium text-[#bdc1c6] mb-1">Estimated Time</label>
                                                        <div className="h-10 border border-dashed border-[#dadce0] rounded-[6px] bg-[#f8f9fa]"></div>
                                                    </div>
                                                    <div>
                                                        <label className="block font-google-sans text-[12px] font-medium text-[#bdc1c6] mb-1">Completed Date</label>
                                                        <div className="h-10 border border-dashed border-[#dadce0] rounded-[6px] bg-[#f8f9fa]"></div>
                                                    </div>
                                                    <div>
                                                        <label className="block font-google-sans text-[12px] font-medium text-[#bdc1c6] mb-1">IDT Amount</label>
                                                        <div className="h-10 border border-dashed border-[#dadce0] rounded-[6px] bg-[#f8f9fa]"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* FOOTER ACTIONS */}
                        <div className="bg-white border-t border-[#dadce0] p-4 flex justify-between items-center z-10">
                            {step === 1 ? (
                                <div></div> // Spacer
                            ) : (
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 h-10 rounded-full border border-transparent hover:bg-[#f1f3f4] text-[#5f6368] font-google-sans font-medium text-[14px] transition-colors"
                                >
                                    ← Back
                                </button>
                            )}

                            {step === 1 ? (
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!selectedDept}
                                    className={`px-8 h-10 rounded-full font-google-sans font-medium text-[14px] transition-all flex items-center gap-2
                                        ${selectedDept
                                            ? 'bg-[#1a73e8] text-white hover:bg-[#1557b0] shadow-google-1'
                                            : 'bg-[#f1f3f4] text-[#bdc1c6] cursor-not-allowed'}`}
                                >
                                    Continue to Details →
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-8 h-10 rounded-full bg-[#1a73e8] text-white font-google-sans font-medium text-[14px] hover:bg-[#1557b0] shadow-google-1 transition-all flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Request'
                                    )}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewRequestModal;
