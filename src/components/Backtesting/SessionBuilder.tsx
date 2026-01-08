import React, { useState } from 'react';
import { useStrategiesStore } from '../../stores/strategiesStore';
import { useBacktestStore } from '../../stores/backtestStore';
import { Play, Timer, Target as TargetIcon, ChevronDown, Activity, Zap } from 'lucide-react';

export const SessionBuilder: React.FC = () => {
    const { strategies } = useStrategiesStore();
    const { startSession } = useBacktestStore();

    const [strategyId, setStrategyId] = useState('');
    const [market, setMarket] = useState('');
    const [timeframe, setTimeframe] = useState('m5');
    const [mode, setMode] = useState<'TIME' | 'SAMPLE'>('SAMPLE');
    const [target, setTarget] = useState(20);

    const handleStart = () => {
        const strategy = strategies.find(s => s.id === strategyId);
        if (!strategy || !market) return;

        startSession({
            strategyId,
            strategyName: strategy.name,
            strategyType: strategy.type,
            market,
            timeframe,
            mode,
            target
        });
    };

    const isReady = strategyId !== '' && market.trim() !== '' && target > 0;

    return (
        <div className="max-w-2xl mx-auto pt-2 pb-16 px-6 animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-primary mb-3 tracking-tight">Backtest Session</h1>
                <p className="text-tertiary text-sm max-w-sm mx-auto leading-relaxed">
                    Set your constraints. Focus on execution excellence, <span className="text-secondary italic">zero over-analysis</span>.
                </p>
            </div>

            <div className="relative group">
                {/* Decorative background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />

                <div className="relative bg-[#0A0A0B]/80 border border-white/5 p-10 rounded-[2rem] backdrop-blur-xl shadow-2xl space-y-8">
                    {/* Strategy Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-tertiary uppercase tracking-[0.2em] ml-1">Strategy Architecture</label>
                        <div className="relative group/select">
                            <select
                                value={strategyId}
                                onChange={(e) => setStrategyId(e.target.value)}
                                className="w-full bg-surface-highlight/50 border border-white/10 rounded-2xl px-5 py-4 text-primary focus:outline-none focus:border-brand/50 transition-all appearance-none cursor-pointer hover:bg-surface-highlight/80 text-sm font-medium"
                            >
                                <option value="" disabled className="bg-black">Select a strategy...</option>
                                {strategies.map(s => (
                                    <option key={s.id} value={s.id} className="bg-black">{s.name} ({s.status})</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none group-hover/select:text-brand transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Market */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-tertiary uppercase tracking-[0.2em] ml-1">Symbol / Asset</label>
                            <input
                                type="text"
                                value={market}
                                onChange={(e) => setMarket(e.target.value)}
                                placeholder="NQ, ES, BTC..."
                                className="w-full bg-surface-highlight/50 border border-white/10 rounded-2xl px-5 py-4 text-primary focus:outline-none focus:border-brand/50 transition-all placeholder:text-tertiary/50 text-sm font-medium"
                            />
                        </div>

                        {/* Timeframe */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-tertiary uppercase tracking-[0.2em] ml-1">Execution TF</label>
                            <div className="relative group/select">
                                <select
                                    value={timeframe}
                                    onChange={(e) => setTimeframe(e.target.value)}
                                    className="w-full bg-surface-highlight/50 border border-white/10 rounded-2xl px-5 py-4 text-primary focus:outline-none focus:border-brand/50 transition-all appearance-none cursor-pointer hover:bg-surface-highlight/80 text-sm font-medium"
                                >
                                    {['m1', 'm3', 'm5', 'm15', 'h1', 'h4', 'D'].map(tf => (
                                        <option key={tf} value={tf} className="bg-black text-sm">{tf}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none group-hover/select:text-brand transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Session Mode */}
                    <div className="space-y-6 pt-8 border-t border-white/5">
                        <label className="text-[10px] font-bold text-tertiary uppercase tracking-[0.2em] ml-1">Session Objective</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => { setMode('SAMPLE'); setTarget(20); }}
                                className={`flex-1 flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group/btn ${mode === 'SAMPLE' ? 'bg-brand/5 border-brand/50 text-brand' : 'bg-white/5 border-white/5 text-tertiary hover:bg-white/10 hover:border-white/10'}`}
                            >
                                {mode === 'SAMPLE' && <div className="absolute inset-0 bg-brand/5 animate-pulse-slow" />}
                                <TargetIcon size={20} className={`transition-transform duration-500 ${mode === 'SAMPLE' ? 'scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'group-hover/btn:scale-110'}`} />
                                <span className="text-xs font-bold tracking-widest uppercase">Sample Count</span>
                            </button>
                            <button
                                onClick={() => { setMode('TIME'); setTarget(15); }}
                                className={`flex-1 flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group/btn ${mode === 'TIME' ? 'bg-brand/5 border-brand/50 text-brand' : 'bg-white/5 border-white/5 text-tertiary hover:bg-white/10 hover:border-white/10'}`}
                            >
                                {mode === 'TIME' && <div className="absolute inset-0 bg-brand/5 animate-pulse-slow" />}
                                <Timer size={20} className={`transition-transform duration-500 ${mode === 'TIME' ? 'scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'group-hover/btn:scale-110'}`} />
                                <span className="text-xs font-bold tracking-widest uppercase">Time Window</span>
                            </button>
                        </div>

                        {/* Target Selection */}
                        <div className="flex gap-3">
                            {(mode === 'SAMPLE' ? [10, 20, 30] : [10, 15, 20]).map(val => (
                                <button
                                    key={val}
                                    onClick={() => setTarget(val)}
                                    className={`flex-1 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${target === val ? 'bg-white/10 border-white/30 text-primary shadow-xl' : 'bg-transparent border-white/5 text-tertiary hover:bg-white/5'}`}
                                >
                                    {val} {mode === 'SAMPLE' ? 'Samples' : 'Minutes'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="pt-4">
                        <button
                            onClick={handleStart}
                            disabled={!isReady}
                            className={`w-full group/start relative flex items-center justify-center gap-3 py-5 rounded-2xl text-sm font-black uppercase tracking-[0.3em] transition-all duration-500 
                                ${isReady
                                    ? 'bg-brand text-black shadow-[0_20px_40px_-15px_rgba(6,182,212,0.5)] hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]'
                                    : 'bg-white/5 text-tertiary cursor-not-allowed border border-white/5'}`}
                        >
                            {isReady && (
                                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                                    <div className="absolute inset-0 translate-x-[-100%] group-hover/start:translate-x-[100%] transition-transform duration-1000 bg-white/20 skew-x-[-20deg]" />
                                </div>
                            )}
                            <Zap size={18} fill={isReady ? "currentColor" : "none"} className={isReady ? "animate-pulse" : ""} />
                            Commit to Session
                        </button>
                        {!isReady && (
                            <p className="text-[10px] text-tertiary text-center mt-4 uppercase tracking-widest opacity-50">
                                Missing context: {!strategyId && 'Strategy '} {!market && 'Market '}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
