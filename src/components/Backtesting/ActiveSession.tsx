import React, { useState } from 'react';
import { useBacktestStore } from '../../stores/backtestStore';
import { SessionProgress } from './SessionProgress';
import { BacktestTradeQuickLog } from './BacktestTradeQuickLog';
import { Lock, XCircle, ShieldAlert, Cpu } from 'lucide-react';

export const ActiveSession: React.FC = () => {
    const { currentSession, abortSession } = useBacktestStore();

    if (!currentSession) return null;

    const [confirmAbort, setConfirmAbort] = useState(false);

    const handleAbort = () => {
        if (confirmAbort) {
            abortSession();
        } else {
            setConfirmAbort(true);
            // Reset after 3 seconds if not clicked again
            setTimeout(() => setConfirmAbort(false), 3000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center py-12 px-8 animate-fade-in relative max-w-6xl mx-auto pb-32">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse-slow delay-700" />
            </div>

            {/* Tactical Header */}
            <div className="w-full relative z-10 flex items-center justify-between mb-16 px-6">
                <div className="flex items-center gap-10">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1.5">
                            <Cpu size={14} className="text-brand animate-pulse" />
                            <span className="text-[10px] font-black text-tertiary uppercase tracking-[0.3em]">Protocol Active</span>
                        </div>
                        <h2 className="text-xl font-black text-primary tracking-tight">
                            {currentSession.strategySnapshot.name}
                        </h2>
                    </div>

                    <div className="h-10 w-px bg-white/10" />

                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-tertiary uppercase tracking-[0.3em] mb-1.5">Environment</span>
                        <div className="text-sm font-bold text-secondary flex items-center gap-3">
                            <span className="text-brand">{currentSession.market}</span>
                            <span className="opacity-20">/</span>
                            <span>{currentSession.timeframe}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-10">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-tertiary uppercase tracking-[0.3em] mb-1.5">Status</span>
                        <div className="flex items-center gap-2.5 px-4 py-1.5 bg-brand/10 border border-brand/20 rounded-full">
                            <Lock size={10} className="text-brand" />
                            <span className="text-[10px] font-black text-brand uppercase tracking-widest leading-none">Locked</span>
                        </div>
                    </div>

                    <div className="h-10 w-px bg-white/10" />

                    <button
                        type="button"
                        onClick={handleAbort}
                        className={`group flex flex-col items-center gap-1.5 transition-all duration-300 relative z-[100] cursor-pointer
                            ${confirmAbort ? 'text-loss scale-110' : 'text-tertiary hover:text-loss'}`}
                    >
                        {confirmAbort ? (
                            <ShieldAlert size={20} className="animate-pulse" />
                        ) : (
                            <XCircle size={20} className="group-hover:rotate-90 transition-transform" />
                        )}
                        <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                            {confirmAbort ? 'Confirm?' : 'Abort'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Main Execution Surface */}
            <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                {/* Left: Progress & Feedback */}
                <div className="lg:col-span-5 space-y-12 bg-surface/20 border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
                    <SessionProgress />

                    <div className="p-8 bg-brand/5 border border-brand/10 rounded-2xl">
                        <div className="flex gap-4 items-start">
                            <ShieldAlert size={18} className="text-brand mt-0.5" />
                            <div className="space-y-1.5">
                                <h4 className="text-[11px] font-black text-brand uppercase tracking-widest">Execution Integrity</h4>
                                <p className="text-[11px] text-tertiary leading-relaxed font-medium">
                                    Emotional detachment is mandatory. Log every setup as it appears. No retrospective bias.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Quick Log Interface */}
                <div className="lg:col-span-7 bg-[#0D0D0E]/80 border border-white/5 p-12 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand/10 to-transparent pointer-events-none" />

                    <div className="mb-10 flex items-center justify-between">
                        <h3 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Log Action</h3>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand/40" />
                            <div className="w-2 h-2 rounded-full bg-brand/20" />
                            <div className="w-2 h-2 rounded-full bg-brand/10" />
                        </div>
                    </div>

                    <BacktestTradeQuickLog />
                </div>
            </div>

            {/* Minimalist Sub-footer */}
            <div className="mt-20 relative z-10 flex flex-col items-center gap-6 opacity-30 select-none">
                <div className="flex items-center gap-12">
                    {['No Indicators', 'No Analytics', 'No Distractions'].map((text, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-tertiary">{text}</span>
                        </div>
                    ))}
                </div>
                <div className="w-48 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
        </div>
    );
};
