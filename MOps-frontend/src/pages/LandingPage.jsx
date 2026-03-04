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
        <div className="font-sans text-[#202124] bg-white text-[16px]">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-[140px] pb-[120px] px-6 overflow-hidden max-w-[1440px] mx-auto min-h-[90vh] flex flex-col justify-center">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
                    {/* Hero Text */}
                    <div className="flex flex-col gap-6 sm:gap-8 z-10 animate-fade-in-up">
                        <h1 className="text-[32px] sm:text-[42px] lg:text-[56px] leading-[1.1] font-display font-medium tracking-[-1.5px] text-[#202124]">
                            Maintenance requests, <br />
                            <span className="text-[#1a73e8] relative inline-block">
                                reimagined.
                                <svg className="absolute w-full h-[8px] sm:h-[12px] -bottom-1 sm:bottom-[-8px] left-0 text-[#e8f0fe] -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-[#5f6368] font-google-sans max-w-[540px]">
                            Streamline your facility operations with intelligent workflows. Google-class reliability for your maintenance team.
                        </p>

                        <form onSubmit={handleSearch} className="relative max-w-[480px] w-full group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-[#9aa0a6] group-focus-within:text-[#1a73e8] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="w-full h-[48px] sm:h-[56px] pl-12 pr-20 sm:pr-24 rounded-full border border-[#dadce0] bg-white text-[14px] sm:text-[16px] placeholder-[#9aa0a6] focus:outline-none focus:ring-4 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] shadow-sm transition-all hover:shadow-md"
                                placeholder="Search for 'Air conditioning'"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 h-[36px] sm:h-[40px] px-4 sm:px-6 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-full text-[13px] sm:text-[14px] font-medium font-google-sans transition-colors"
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
                <div className="w-full bg-[#f8f9fa] border-y border-[#dadce0] py-[20px]">
                    <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
                        <span className="text-[13px] font-medium text-[#5f6368] whitespace-nowrap">Trusted by 200+ facility teams</span>
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-4 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                            {['Acme Corp', 'Global Logistics', 'TechSpace', 'Urban Living', 'BuildWell'].map((company, i) => (
                                <span key={i} className="text-[13px] sm:text-[14px] font-bold font-google-sans text-[#5f6368] hover:text-[#1a73e8] cursor-default whitespace-nowrap">
                                    {company}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </FadeInSection>

            {/* SECTION 2: HOW IT WORKS */}
            <section className="py-[80px] px-6 bg-white">
                <div className="max-w-[1200px] mx-auto">
                    <FadeInSection>
                        <div className="text-center mb-12">
                            <h3 className="text-[11px] font-bold text-[#5f6368] tracking-[2px] uppercase mb-4">HOW IT WORKS</h3>
                            <h2 className="text-[36px] font-display text-[#202124] tracking-tight leading-tight">Three steps to a resolved request</h2>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { step: '01', title: 'Submit Your Request', desc: 'Fill a form, attach images, mark urgent if needed.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                            { step: '02', title: 'Review & Quotation', desc: 'Admin reviews, selects materials, checks godown stock.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
                            { step: '03', title: 'Track to Completion', desc: 'Real-time status from approval to delivery.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
                        ].map((item, index) => (
                            <FadeInSection key={index} delay={`${index * 0.1}s`}>
                                <div className="bg-[#f8f9fa] rounded-[16px] p-8 h-full hover:bg-[#f1f3f4] transition-colors duration-300">
                                    <div className="text-[11px] font-bold text-[#1a73e8] tracking-[2px] mb-3">STEP {item.step}</div>
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1a73e8] shadow-sm mb-4">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                    </div>
                                    <h4 className="text-[18px] font-medium font-google-sans text-[#202124] mb-2">{item.title}</h4>
                                    <p className="text-[14px] leading-[1.6] text-[#5f6368]">{item.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3: FEATURE HIGHLIGHTS */}
            <section className="py-[80px] px-6 bg-[#f8f9fa]">
                <div className="max-w-[900px] mx-auto">
                    <FadeInSection>
                        <div className="text-center mb-12">
                            <h3 className="text-[11px] font-bold text-[#5f6368] tracking-[2px] uppercase mb-4">BUILT FOR OPERATIONS</h3>
                            <h2 className="text-[36px] font-display text-[#202124] tracking-tight leading-tight">Everything your facility team needs</h2>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                            { title: 'Inventory-Aware Procurement', desc: 'Checks godown before any purchase order.', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
                            { title: 'Vendor Aggregation', desc: 'Groups materials by vendor to optimize purchasing.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                            { title: 'Automatic Escalation', desc: 'Super Admin gets alerted if deadlines are breached.', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
                            { title: 'Real-Time Status Tracking', desc: 'Every stage visible, nothing hidden.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' }
                        ].map((item, index) => (
                            <FadeInSection key={index} delay={`${index * 0.1}s`}>
                                <div className="bg-white rounded-[16px] p-7 shadow-google-1 hover:shadow-google-2 transition-shadow duration-300">
                                    <div className="w-10 h-10 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] mb-4">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                    </div>
                                    <h4 className="text-[16px] font-medium font-google-sans text-[#202124] mb-2">{item.title}</h4>
                                    <p className="text-[14px] leading-[1.6] text-[#5f6368]">{item.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4: ROLE CALLOUT */}
            <section className="py-[60px] px-6 bg-white">
                <div className="max-w-[1000px] mx-auto">
                    <FadeInSection>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            {[
                                { role: 'Requester', desc: 'Submit and track requests', color: '#1a73e8', bg: 'bg-[#1a73e8]' },
                                { role: 'Admin', desc: 'Manage quotations & vendors', color: '#137333', bg: 'bg-[#137333]' },
                                { role: 'Super Admin', desc: 'Full system control & alerts', color: '#f9ab00', bg: 'bg-[#f9ab00]' }
                            ].map((item, i) => (
                                <div key={i} className="flex-1 flex items-center gap-4 border-[1.5px] border-[#dadce0] rounded-2xl md:rounded-[50px] px-6 md:px-8 py-4 md:py-5 hover:border-[#1a73e8] hover:bg-[#e8f0fe] transition-all duration-200 cursor-default group">
                                    <div className={`w-[10px] h-[10px] shrink-0 rounded-full ${item.bg}`}></div>
                                    <div className="min-w-0">
                                        <div className="text-[14px] md:text-[15px] font-medium font-google-sans text-[#202124] group-hover:text-[#1a73e8] transition-colors truncate">{item.role}</div>
                                        <div className="text-[12px] md:text-[13px] text-[#5f6368] leading-tight line-clamp-1">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* SECTION 5: STATUS TRACKER PREVIEW */}
            <section className="py-[80px] px-6 bg-[#f8f9fa]">
                <div className="max-w-[1200px] mx-auto text-center">
                    <FadeInSection>
                        <h2 className="text-[36px] font-display text-[#202124] mb-2">Track every request like a shipment</h2>
                        <p className="text-[16px] text-[#5f6368] mb-12">From submission to completion — full visibility at every stage.</p>

                        <div className="max-w-[720px] mx-auto bg-white rounded-[20px] p-6 sm:p-10 shadow-[0_10px_25px_rgba(0,0,0,0.1)] overflow-hidden">
                            <div className="overflow-x-auto pb-4 custom-scrollbar">
                                <div className="flex items-center justify-between relative min-w-[600px] px-4">
                                    {/* Connector Line Background */}
                                    <div className="absolute top-[12px] left-0 w-full h-[2px] bg-[#dadce0] -z-10"></div>
                                    {/* Active Connector Line */}
                                    <div className="absolute top-[12px] left-0 w-[58%] h-[2px] bg-[#1a73e8] -z-10"></div>

                                    {[
                                        { label: 'Submitted', active: true, completed: true },
                                        { label: 'Quotation', active: true, completed: true },
                                        { label: 'Approved', active: true, completed: true },
                                        { label: 'Sourced', active: true, completed: true },
                                        { label: 'In Production', active: true, pulse: true },
                                        { label: 'Ready', active: false },
                                        { label: 'Payment', active: false },
                                        { label: 'Completed', active: false }
                                    ].map((step, i) => (
                                        <div key={i} className="flex flex-col items-center gap-3 shrink-0">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-[2px] bg-white z-10 
                                                ${step.completed ? 'border-[#1a73e8] bg-[#1a73e8] text-white' :
                                                    step.pulse ? 'border-[#1a73e8] shadow-[0_0_0_4px_rgba(26,115,232,0.2)]' : 'border-[#dadce0]'}`}>
                                                {step.completed && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                {step.pulse && <div className="w-2.5 h-2.5 bg-[#1a73e8] rounded-full animate-pulse"></div>}
                                            </div>
                                            <span className={`text-[11px] font-medium ${step.active ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`}>
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
            <footer className="bg-white border-t border-[#dadce0] py-8 px-6">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[18px] font-normal font-google-sans text-[#5f6368] tracking-tight">
                            Mainten<span className="font-bold text-[#1a73e8]">Ops</span>
                        </span>
                    </div>

                    <div className="flex gap-8 text-[13px] text-[#5f6368] font-medium">
                        <a href="#" className="hover:text-[#1a73e8] transition-colors">Documentation</a>
                        <a href="#" className="hover:text-[#1a73e8] transition-colors">Contact</a>
                        <a href="#" className="hover:text-[#1a73e8] transition-colors">Privacy</a>
                    </div>

                    <div className="text-[13px] text-[#bdc1c6]">
                        © 2026 MaintenOps
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;