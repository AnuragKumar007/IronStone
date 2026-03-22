"use client";
import { useState } from "react";

export default function MembershipSection() {
    const [isAnnual, setIsAnnual] = useState(false);

    // Calculate prices: Assuming ~20% discount when billed annually, but displayed as monthly cost
    const prices = {
        basic: isAnnual ? 799 : 999,
        pro: isAnnual ? 1599 : 1999,
        advance: isAnnual ? 2399 : 2999,
    };

    return (
        <div className="relative min-h-screen bg-black overflow-hidden mt-[15rem] md:pt-16 pb-24">

            {/* Membership Content */}
            <div className="relative z-10 container mx-auto px-4 py-16">
                {/* Header */}
                <div className="flex flex-col items-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 mb-6">
                        <i className="ri-price-tag-3-fill text-red-500 text-sm"></i>
                        <span className="text-white text-xs font-semibold tracking-widest uppercase">Pricing</span>
                    </div>
                    <h2 className="text-[3rem] text-center md:text-[4rem] font-bold text-white leading-tight">Plans and Pricing</h2>
                    <p className="text-gray-400 text-center max-w-2xl mt-4 text-lg mb-10">Choose a plan that fits your fitness goals, whether you're just starting out or scaling your workout routines.</p>

                    {/* Monthly / Annually Toggle */}
                    <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-full border border-zinc-800">
                        <span className={`text-sm font-semibold tracking-widest uppercase transition-colors duration-300 ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>
                            Monthly
                        </span>
                        
                        {/* Toggle Button */}
                        <div 
                            className="w-14 h-7 rounded-full border-2 border-red-500 relative cursor-pointer"
                            onClick={() => setIsAnnual(!isAnnual)}
                        >
                            <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${isAnnual ? 'left-[30px]' : 'left-1'}`}></div>
                        </div>

                        <span className={`text-sm font-semibold tracking-widest uppercase transition-colors duration-300 ${isAnnual ? 'text-red-500' : 'text-gray-500'}`}>
                            Annually
                        </span>
                        
                        {/* Save 20% Badge */}
                        <span className="bg-zinc-800/80 border border-zinc-700 text-gray-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ml-1">
                            Save 20%
                        </span>
                    </div>
                </div>

                {/* Membership Cards */}
                <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8 max-w-6xl mx-auto">
                    {/* Basic Plan */}
                    <div className="group relative bg-[#0d0d0d] p-8 md:p-10 rounded-3xl w-full lg:w-1/3 border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300">
                        <div className="relative z-10 flex flex-col h-full">
                            <h3 className="text-2xl font-bold text-white mb-4">Basic Plan</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <h3 className="text-5xl font-bold text-white">₹{prices.basic}</h3>
                                <span className="text-gray-500 font-medium">/month</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-8 min-h-[40px]">
                                {isAnnual ? "Billed ₹9,588 yearly." : "For beginners to explore our platform."}
                            </p>
                            
                            <button className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 mb-10">
                                Start for Free
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-[1px] flex-1 bg-zinc-800"></div>
                                <span className="text-xs text-gray-500 tracking-widest uppercase font-semibold">Stand Out Features</span>
                                <div className="h-[1px] flex-1 bg-zinc-800"></div>
                            </div>

                            <div className="space-y-4 flex-1">
                                <p className="text-gray-300 flex items-start gap-3"><i className="ri-check-line text-gray-500 mt-0.5"></i> Basic workout plans</p>
                                <p className="text-gray-300 flex items-start gap-3"><i className="ri-check-line text-gray-500 mt-0.5"></i> Progress tracking</p>
                                <p className="text-gray-300 flex items-start gap-3"><i className="ri-check-line text-gray-500 mt-0.5"></i> Community access</p>
                                <p className="text-gray-500 flex items-start gap-3"><i className="ri-close-line text-gray-700 mt-0.5"></i> Personal trainer</p>
                            </div>
                        </div>
                    </div>

                    {/* Pro Plan - Highlighted */}
                    <div className="group relative bg-[#111111] p-8 md:p-10 rounded-3xl w-full lg:w-1/3 border border-red-900/40 shadow-[0_0_40px_rgba(220,38,38,0.1)] hover:shadow-[0_0_50px_rgba(220,38,38,0.15)] transition-all duration-300 scale-100 lg:scale-[1.05] z-10">
                        {/* Ambient glow inside card */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-red-600/10 blur-[50px] rounded-full pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-white">Pro Plan</h3>
                                <span className="bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                    <i className="ri-star-s-fill text-red-500"></i> Popular
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1 mb-4">
                                <h3 className="text-5xl font-bold text-white">₹{prices.pro}</h3>
                                <span className="text-gray-500 font-medium">/month</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-8 min-h-[40px]">
                                {isAnnual ? "Billed ₹19,188 yearly." : "For active members who want advanced tools."}
                            </p>
                            
                            <button className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-3.5 rounded-xl transition-all duration-300 mb-10 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                Choose Pro Plan
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-[1px] flex-1 bg-zinc-800"></div>
                                <span className="text-xs text-gray-500 tracking-widest uppercase font-semibold">Stand Out Features</span>
                                <div className="h-[1px] flex-1 bg-zinc-800"></div>
                            </div>

                            <div className="space-y-4 flex-1">
                                <p className="text-gray-300 flex items-start gap-3"><i className="ri-check-circle-fill text-red-600 mt-0.5"></i> All Basic features</p>
                                <p className="text-gray-300 flex items-start gap-3"><i className="ri-check-circle-fill text-red-600 mt-0.5"></i> Personal trainer</p>
                                <p className="text-gray-300 flex items-start gap-3"><i className="ri-check-circle-fill text-red-600 mt-0.5"></i> Premium workouts</p>
                                <p className="text-gray-300 flex items-start gap-3"><i className="ri-check-circle-fill text-red-600 mt-0.5"></i> Nutrition guidance</p>
                            </div>
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div className="group relative bg-[#0d0d0d] p-8 md:p-10 rounded-3xl w-full lg:w-1/3 border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300">
                        <div className="relative z-10 flex flex-col h-full">
                            <h3 className="text-2xl font-bold text-white mb-4">Advance Plan</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <h3 className="text-5xl font-bold text-white">₹{prices.advance}</h3>
                                <span className="text-gray-500 font-medium">/month</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-8 min-h-[40px]">
                                {isAnnual ? "Billed ₹28,788 yearly." : "For high-achieving individuals seeking elite solutions."}
                            </p>
                            
                            <button className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 mb-10">
                                Contact Us
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-[1px] flex-1 bg-zinc-800"></div>
                                <span className="text-xs text-gray-500 tracking-widest uppercase font-semibold">Stand Out Features</span>
                                <div className="h-[1px] flex-1 bg-zinc-800"></div>
                            </div>

                            <div className="space-y-4 flex-1">
                                <p className="text-gray-300 flex items-start gap-3"><i className="ri-check-line text-gray-500 mt-0.5"></i> Dedicated account manager</p>
                                <p className="text-gray-300 flex items-start gap-3"><i className="ri-check-line text-gray-500 mt-0.5"></i> 1-on-1 elite coaching</p>
                                <p className="text-gray-300 flex items-start gap-3"><i className="ri-check-line text-gray-500 mt-0.5"></i> Custom meal & recovery plans</p>
                                <p className="text-gray-300 flex items-start gap-3"><i className="ri-check-line text-gray-500 mt-0.5"></i> Priority support assistance</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <p className="text-center text-gray-500 text-sm mt-12">Start your journey risk free - No credit card needed</p>
            </div>
        </div>
    );
}
