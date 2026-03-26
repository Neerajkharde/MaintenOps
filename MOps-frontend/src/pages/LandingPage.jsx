import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FadeInSection from '../components/FadeInSection';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="font-body text-on-surface bg-background text-[16px]">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-[140px] pb-[120px] px-6 overflow-hidden max-w-[1440px] mx-auto min-h-[90vh] flex flex-col justify-center">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
                    {/* Hero Text */}
                    <div className="flex flex-col gap-6 sm:gap-8 z-10 animate-fadeUp">
                         <div className="inline-flex items-center px-4 py-1.5 rounded-pill bg-primary-container border border-primary/20 text-primary text-[12px] font-bold tracking-[0.15em] uppercase w-fit mb-[-8px]">
                            ISKCON NVCC Pune
                        </div>
                        <h1 className="text-[36px] sm:text-[48px] lg:text-[64px] leading-[1.1] font-display font-bold tracking-tight text-secondary">
                            Maintenance, <br />
                            <span className="text-primary relative inline-block">
                                streamlined.
                                <svg className="absolute w-full h-[12px] -bottom-2 left-0 text-accent/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-on-surface-variant max-w-[540px]">
                            Empowering ISKCON NVCC with intelligent facility management. Seamless workflows designed for precision and service.
                        </p>

                        <form onSubmit={handleSearch} className="relative max-w-[480px] w-full group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-outline group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="w-full h-[52px] sm:h-[60px] pl-12 pr-20 rounded-md border border-outline bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-sm transition-all hover:shadow-md font-ui"
                                placeholder="Search for 'Electrical repair'..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn-primary absolute right-1.5 top-1.5 bottom-1.5 px-6 !leading-none"
                            >
                                Go
                            </button>
                        </form>
                    </div>

                    {/* Dashboard Preview Widget */}
                    <div className="relative z-10 lg:pl-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-blue-100/40 via-purple-50/20 to-white/0 rounded-full blur-3xl -z-10"></div>

                        <div className="bg-white rounded-[24px] shadow-google-3 border border-[#dadce0]/60 p-6 relative overflow-hidden backdrop-blur-sm bg-white/90">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <div className="text-[12px] uppercase tracking-wider text-[#5f6368] font-bold mb-1">Overview</div>
                                    <div className="text-[14px] text-[#9aa0a6]">Last updated: Just now</div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#f1f3f4] flex items-center justify-center text-[#1a73e8]">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                </div>
                            </div>

                            <div className="flex items-end gap-3 mb-8">
                                <span className="text-[48px] font-display text-[#1a73e8] leading-none">98.5%</span>
                                <span className="text-[13px] font-medium text-[#137333] bg-[#e6f4ea] px-2 py-1 rounded-full mb-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                    +2.4%
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-[#f8f9fa] rounded-[16px]">
                                    <div className="text-[12px] text-[#5f6368] mb-2">Active Requests</div>
                                    <div className="text-[24px] font-display text-[#202124] mb-2">12</div>
                                    <div className="h-1 w-full bg-[#dadce0] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#1a73e8] w-[40%] rounded-full"></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-[#f8f9fa] rounded-[16px]">
                                    <div className="text-[12px] text-[#5f6368] mb-2">Avg Resolution</div>
                                    <div className="text-[24px] font-display text-[#202124] mb-2">2h 15m</div>
                                    <div className="h-1 w-full bg-[#dadce0] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#137333] w-[75%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity List */}
                            <div>
                                <div className="text-[11px] font-bold text-[#5f6368] uppercase tracking-wider mb-4">Recent Activity</div>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Server Room AC Check', status: 'In Progress', color: 'bg-[#f9ab00]' },
                                        { title: 'Lobby Light Replacement', status: 'Live System Status', color: 'bg-[#188038]' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                                <span className="text-[14px] font-medium text-[#3c4043]">{item.title}</span>
                                            </div>
                                            {i === 0 ? (
                                                <span className="text-[10px] border border-[#dadce0] px-2 py-0.5 rounded-full text-[#5f6368]">{item.status}</span>
                                            ) : (
                                                <span className="text-[10px] bg-[#202124] text-white px-3 py-1 rounded-full flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-[#188038] rounded-full animate-pulse"></span>
                                                    {item.status}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 1: TRUST BAR */}
            <FadeInSection>
                <div className="w-full bg-surface-variant border-y border-outline/30 py-[20px]">
                    <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
                        <span className="text-[13px] font-bold text-secondary/60 uppercase tracking-widest whitespace-nowrap">Trusted by ISKCON NVCC Departments</span>
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-4 md:gap-12 opacity-80 grayscale hover:grayscale-0 transition-all duration-300">
                            {['Temple Admin', 'Govinda\'s', 'Guest House', 'Security', 'Maintenance'].map((dept, i) => (
                                <span key={i} className="text-[13px] sm:text-[14px] font-bold font-ui text-on-surface-variant hover:text-primary cursor-default whitespace-nowrap">
                                    {dept}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </FadeInSection>

            {/* SECTION 2: HOW IT WORKS */}
            <section className="py-[100px] px-6 bg-white/50 backdrop-blur-md">
                <div className="max-w-[1200px] mx-auto">
                    <FadeInSection>
                        <div className="text-center mb-16">
                            <h3 className="text-[12px] font-bold text-primary tracking-[0.2em] uppercase mb-4">HOW IT WORKS</h3>
                            <h2 className="text-[42px] font-display font-bold text-secondary tracking-tight leading-tight">Service through Excellence</h2>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Submit Request', desc: 'Detail the maintenance need with images and priority.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                            { step: '02', title: 'Review & Verify', desc: 'Admin validates the request and prepares for execution.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
                            { step: '03', title: 'Completion', desc: 'Real-time updates until the task is fully resolved.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
                        ].map((item, index) => (
                            <FadeInSection key={index} delay={`${index * 0.1}s`}>
                                <div className="card h-full p-8 group">
                                    <div className="text-[12px] font-bold text-primary tracking-[0.1em] mb-4">PHASE {item.step}</div>
                                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
                                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                    </div>
                                    <h4 className="text-[20px] font-display font-bold text-secondary mb-3">{item.title}</h4>
                                    <p className="text-[15px] leading-[1.6] text-on-surface-variant">{item.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3: FEATURE HIGHLIGHTS */}
            <section className="py-[100px] px-6 bg-surface-variant/40">
                <div className="max-w-[900px] mx-auto text-center">
                    <FadeInSection>
                        <div className="mb-16">
                            <h3 className="text-[12px] font-bold text-primary tracking-[0.2em] uppercase mb-4">DEVOTED TO EFFICIENCY</h3>
                            <h2 className="text-[42px] font-display font-bold text-secondary tracking-tight">Purpose-built for Temple Ops</h2>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {[
                            { title: 'Inventory Management', desc: 'Intelligent tracking of temple assets and materials.', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
                            { title: 'Vendor Synergy', desc: 'Seamlessly coordinate with trusted temple vendors.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                            { title: 'Urgent Alerts', desc: 'Immediate priority handling for critical repairs.', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
                            { title: 'Full Traceability', desc: 'Total transparency from request to resolution.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' }
                        ].map((item, index) => (
                            <FadeInSection key={index} delay={`${index * 0.1}s`}>
                                <div className="card p-8 bg-white/60 backdrop-blur-sm">
                                    <div className="w-12 h-12 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary mb-6">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                    </div>
                                    <h4 className="text-[18px] font-display font-bold text-secondary mb-3">{item.title}</h4>
                                    <p className="text-[15px] leading-[1.6] text-on-surface-variant">{item.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4: ROLE CALLOUT */}
            <section className="py-[80px] px-6 bg-white/40">
                <div className="max-w-[1000px] mx-auto">
                    <FadeInSection>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            {[
                                { role: 'Requester', desc: 'Submit & Track Requests', color: 'primary', bg: 'bg-primary' },
                                { role: 'Admin', desc: 'Manage Logistics & Stock', color: 'secondary', bg: 'bg-secondary' },
                                { role: 'Super Admin', desc: 'System Oversight & Approvals', color: 'accent', bg: 'bg-accent' }
                            ].map((item, i) => (
                                <div key={i} className="flex-1 flex items-center gap-5 border border-outline rounded-xl px-8 py-6 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-default group shadow-sm bg-white">
                                    <div className={`w-[12px] h-[12px] shrink-0 rounded-full ${item.bg} shadow-sm group-hover:scale-125 transition-transform`}></div>
                                    <div className="min-w-0">
                                        <div className="text-[16px] font-display font-bold text-secondary group-hover:text-primary transition-colors truncate">{item.role}</div>
                                        <div className="text-[13px] text-on-surface-variant leading-tight line-clamp-1 italic">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* SECTION 5: STATUS TRACKER PREVIEW */}
            <section className="py-[100px] px-6 bg-surface-variant/30">
                <div className="max-w-[1200px] mx-auto text-center">
                    <FadeInSection>
                        <h2 className="text-[42px] font-display font-bold text-secondary mb-3">Service Traceability</h2>
                        <p className="text-[18px] text-on-surface-variant max-w-[700px] mx-auto mb-16">Witness the journey of every offering — from submission to divine completion.</p>

                        <div className="max-w-[800px] mx-auto card p-10 bg-white/90 backdrop-blur-sm overflow-hidden">
                            <div className="overflow-x-auto pb-6 custom-scrollbar">
                                <div className="flex items-center justify-between relative min-w-[700px] px-4">
                                    {/* Connector Line Background */}
                                    <div className="absolute top-[16px] left-0 w-full h-[3px] bg-outline/20 -z-10 rounded-pill"></div>
                                    {/* Active Connector Line */}
                                    <div className="absolute top-[16px] left-0 w-[58%] h-[3px] bg-primary -z-10 rounded-pill shadow-sm"></div>

                                    {[
                                        { label: 'Submitted', active: true, completed: true },
                                        { label: 'Quotation', active: true, completed: true },
                                        { label: 'Approved', active: true, completed: true },
                                        { label: 'Sourced', active: true, completed: true },
                                        { label: 'In Progress', active: true, pulse: true },
                                        { label: 'Ready', active: false },
                                        { label: 'Delivery', active: false },
                                        { label: 'Completed', active: false }
                                    ].map((step, i) => (
                                        <div key={i} className="flex flex-col items-center gap-4 shrink-0">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[2.5px] bg-white z-10 transition-all duration-300
                                                ${step.completed ? 'border-primary bg-primary text-white shadow-md' :
                                                    step.pulse ? 'border-primary shadow-[0_0_15px_rgba(255,153,51,0.4)]' : 'border-outline/50 opacity-40'}`}>
                                                {step.completed && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                {step.pulse && <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
                                            </div>
                                            <span className={`text-[12px] font-ui font-bold tracking-tight uppercase ${step.active ? 'text-secondary' : 'text-on-surface-variant/40'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* SECTION 6: FOOTER */}
            <footer className="bg-secondary text-white py-16 px-6 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -z-0"></div>
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <span className="text-[28px] font-display font-bold tracking-tight">
                            NVCC <span className="text-primary font-medium">MaintenOps</span>
                        </span>
                        <p className="text-white/60 text-[14px] font-ui max-w-[300px] text-center md:text-left">
                            Dedicated maintenance management for ISKCON New Vedic Cultural Center, Pune.
                        </p>
                    </div>

                    <div className="flex gap-10 text-[14px] font-ui font-semibold">
                        <a href="#" className="hover:text-primary transition-colors">Documentation</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact</a>
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                    </div>

                    <div className="text-[13px] text-white/40 font-ui text-center md:text-right">
                        © 2026 ISKCON NVCC Pune. <br />
                        Developed for MaintenOps.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;