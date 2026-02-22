import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FadeInSection from '../components/FadeInSection';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const LandingPage = () => {
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
        <div className="font-body text-on-surface bg-background select-none">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-[120px] pb-[100px] px-6 overflow-hidden max-w-[1440px] mx-auto min-h-[90vh] flex flex-col justify-center">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
                    {/* Hero Text */}
                    <div className="flex flex-col gap-8 z-10 animate-fadeUp">
                        <h1 className="text-[64px] leading-[1.05] font-display font-medium tracking-tight text-on-surface">
                            Facility operations, <br />
                            <span className="text-primary italic font-light">standardized.</span>
                        </h1>
                        <p className="text-[20px] leading-[1.6] text-on-surface-variant max-w-[500px]">
                            Experience intelligent maintenance workflows. Built with Google-class reliability for modern facility teams.
                        </p>

                        <form onSubmit={handleSearch} className="relative max-w-[480px] w-full group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="w-full h-[60px] pl-14 pr-24 rounded-pill border border-outline bg-white text-[16px] placeholder-on-surface-variant/40 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-sm hover:shadow-md transition-all font-ui"
                                placeholder="What needs fixing today?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                type="submit"
                                className="absolute right-2.5 top-2.5 h-[40px] !px-8"
                            >
                                Start
                            </Button>
                        </form>
                    </div>

                    {/* Dashboard Preview Widget */}
                    <div className="relative z-10 lg:pl-10 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-primary/10 via-background to-transparent rounded-full blur-3xl -z-10"></div>

                        <div className="google-card p-8 lg:p-10 relative overflow-hidden backdrop-blur-md bg-white/95">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <div className="text-[11px] uppercase tracking-[1.5px] text-on-surface-variant font-bold mb-1">System Status</div>
                                    <div className="text-[14px] text-on-surface/60 font-ui">Operational & Reactive</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                </div>
                            </div>

                            <div className="flex items-end gap-3 mb-10">
                                <span className="text-[56px] font-display text-primary leading-none tracking-tight">98.5%</span>
                                <span className="text-[13px] font-medium text-success bg-success-container px-3 py-1 rounded-pill mb-2 flex items-center gap-1 font-ui">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                    Uptime
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-10 font-ui">
                                <div className="p-5 bg-background rounded-lg border border-outline/30">
                                    <div className="text-[12px] text-on-surface-variant mb-2">Active Jobs</div>
                                    <div className="text-[28px] font-medium text-on-surface">12</div>
                                </div>
                                <div className="p-5 bg-background rounded-lg border border-outline/30">
                                    <div className="text-[12px] text-on-surface-variant mb-2">Resolution</div>
                                    <div className="text-[28px] font-medium text-on-surface">2.4h</div>
                                </div>
                            </div>

                            {/* Activity List */}
                            <div className="space-y-4">
                                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[1.5px]">Live Feed</div>
                                {[
                                    { title: 'Server Room Optimization', status: 'Running', color: 'bg-warning' },
                                    { title: 'Facility Power Check', status: 'Completed', color: 'bg-success' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-surface-variant rounded-md">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${item.color} ${i === 0 ? 'animate-pulse' : ''}`}></div>
                                            <span className="text-[14px] font-medium text-on-surface font-ui">{item.title}</span>
                                        </div>
                                        <span className="text-[11px] font-medium text-on-surface-variant">{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BAR */}
            <FadeInSection>
                <div className="w-full bg-white border-y border-outline py-[30px]">
                    <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                        <span className="text-[13px] font-medium text-on-surface-variant uppercase tracking-widest font-ui">Trusted by leading teams</span>
                        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-30 grayscale saturate-0">
                            {['ACME', 'ISKO', 'TECH', 'URBAN', 'CORE'].map((company, i) => (
                                <span key={i} className="text-[18px] font-display font-medium text-on-surface italic">
                                    {company}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </FadeInSection>

            {/* HOW IT WORKS */}
            <section className="py-[120px] px-6 bg-white">
                <div className="max-w-[1200px] mx-auto">
                    <FadeInSection>
                        <div className="text-center mb-16">
                            <h3 className="text-[12px] font-bold text-primary tracking-[2.5px] uppercase mb-5">THE WORKFLOW</h3>
                            <h2 className="text-[44px] font-display text-on-surface tracking-tight leading-tight">Intelligent by design</h2>
                        </div>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Submit', desc: 'Context-aware request forms with visual documentation.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                            { step: '02', title: 'Process', desc: 'Material-level tracking and automatic godown checks.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
                            { step: '03', title: 'Succeed', desc: 'Real-time logistical visibility from warehouse to floor.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
                        ].map((item, index) => (
                            <FadeInSection key={index} delay={`${index * 0.15}s`}>
                                <div className="group border border-outline rounded-xl p-10 hover:border-primary hover:bg-primary-container/20 transition-all duration-300">
                                    <div className="text-[10px] font-bold text-on-surface-variant tracking-[2px] mb-8">STEP {item.step}</div>
                                    <div className="w-14 h-14 rounded-pill bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                    </div>
                                    <h4 className="text-[20px] font-medium font-ui text-on-surface mb-3">{item.title}</h4>
                                    <p className="text-[15px] leading-[1.6] text-on-surface-variant">{item.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-[100px] px-6 bg-primary overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-[800px] mx-auto text-center relative z-10">
                    <FadeInSection>
                        <h2 className="text-[44px] font-display text-white mb-6 leading-tight">Ready to modernize your operations?</h2>
                        <p className="text-[18px] text-white/80 mb-10 font-ui leading-relaxed">
                            Join hundreds of facilities that have switched to MaintenOps for a clearer, more efficient future.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="h-14 px-10 bg-white text-primary rounded-pill font-ui font-medium text-[16px] hover:shadow-lg transition-all"
                            >
                                Get Started
                            </button>
                            <button className="h-14 px-10 border border-white text-white rounded-pill font-ui font-medium text-[16px] hover:bg-white/10 transition-all">
                                View Demo
                            </button>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-white py-12 px-6 border-t border-outline">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-ui">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-[18px] font-medium font-display text-on-surface">MaintenOps</span>
                    </div>

                    <div className="flex gap-8 text-[13px] text-on-surface-variant font-medium">
                        <a href="#" className="hover:text-primary transition-colors">Documentation</a>
                        <a href="#" className="hover:text-primary transition-colors">Safety</a>
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                    </div>

                    <div className="text-[13px] text-on-surface-variant font-medium">
                        © 2026 MaintenOps Systems
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
