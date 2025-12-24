import React from 'react';
import { ArrowUpRight, Wallet } from 'lucide-react';
import { AnimatedValue } from '../Common/AnimatedValue';

export const BalanceHeader: React.FC = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-2">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 px-1.5 rounded bg-blue-500/10 border border-blue-500/20">
                        <Wallet size={12} className="text-blue-400" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">Total Portfolio Net</span>
                </div>
                <div className="flex items-baseline gap-4">
                    <h2 className="text-5xl font-bold text-white tracking-tighter">
                        $<AnimatedValue value={482950} formatFn={(v) => v.toLocaleString('en-US')} />
                        <span className="text-3xl text-gray-600 font-light translate-y-[-2px] inline-block">.00</span>
                    </h2>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                        <ArrowUpRight size={14} className="text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400 tracking-tight">+4.2%</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                        <span className="text-emerald-400">+$12,450.00</span> Growth this cycle
                    </p>
                </div>
            </div>

            <div className="flex gap-3">
                <button className="h-10 px-6 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95">
                    Deposit
                </button>
                <button className="h-10 px-6 glass-panel text-gray-300 hover:text-white hover:border-white/20 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all active:scale-95">
                    Transfer
                </button>
            </div>
        </div>
    );
};
