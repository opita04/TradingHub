import React, { useState, useEffect, useRef } from 'react';
import { useBacktestStore } from '../../stores/backtestStore';
import { Check, X, Minus, Plus, ChevronRight, Image as ImageIcon, Trash2, Keyboard } from 'lucide-react';

export const BacktestTradeQuickLog: React.FC = () => {
    const { logTrade } = useBacktestStore();

    const [setupPresent, setSetupPresent] = useState<boolean | null>(null);
    const [entryValid, setEntryValid] = useState<boolean | null>(null);
    const [outcome, setOutcome] = useState<'WIN' | 'LOSS' | 'BE' | null>(null);
    const [rMultiple, setRMultiple] = useState(2);
    const [showRMultiple, setShowRMultiple] = useState(false);
    const [screenshots, setScreenshots] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            const key = e.key.toLowerCase();
            if (key === 'y') setSetupPresent(true);
            if (key === 'n') setSetupPresent(false);
            if (key === 'v') setEntryValid(true);
            if (key === 'i') setEntryValid(false);
            if (key === 'w') setOutcome('WIN');
            if (key === 'l') setOutcome('LOSS');
            if (key === 'b') setOutcome('BE');
            if (e.key === 'Enter' && setupPresent !== null && entryValid !== null && outcome !== null) {
                handleSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [setupPresent, entryValid, outcome, rMultiple, screenshots]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshots(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeScreenshot = (index: number) => {
        setScreenshots(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (setupPresent === null || entryValid === null || outcome === null) return;

        logTrade({
            setupPresent,
            entryValid,
            outcome,
            rMultiple: outcome === 'WIN' ? rMultiple : (outcome === 'BE' ? 0 : -1),
            screenshots: screenshots.length > 0 ? screenshots : undefined
        });

        setSetupPresent(null);
        setEntryValid(null);
        setOutcome(null);
        setScreenshots([]);
    };

    const isComplete = setupPresent !== null && entryValid !== null && outcome !== null;

    return (
        <div className="space-y-10">
            {/* Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. Setup Status */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-tertiary uppercase tracking-[0.3em]">01. Setup</label>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${setupPresent !== null ? 'bg-brand/20 text-brand' : 'bg-white/5 text-tertiary'}`}>REQUIRED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <ActionButton
                            active={setupPresent === true}
                            onClick={() => setSetupPresent(true)}
                            label="Yes"
                            shortcut="Y"
                            icon={<Check size={18} />}
                            color="profit"
                        />
                        <ActionButton
                            active={setupPresent === false}
                            onClick={() => setSetupPresent(false)}
                            label="No"
                            shortcut="N"
                            icon={<X size={18} />}
                            color="loss"
                        />
                    </div>
                </div>

                {/* 2. Validation */}
                <div className="space-y-4 text-center">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-tertiary uppercase tracking-[0.3em]">02. Validity</label>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${entryValid !== null ? 'bg-brand/20 text-brand' : 'bg-white/5 text-tertiary'}`}>REQUIRED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <ActionButton
                            active={entryValid === true}
                            onClick={() => setEntryValid(true)}
                            label="Valid"
                            shortcut="V"
                            icon={<Check size={18} />}
                            color="profit"
                        />
                        <ActionButton
                            active={entryValid === false}
                            onClick={() => setEntryValid(false)}
                            label="Invalid"
                            shortcut="I"
                            icon={<X size={18} />}
                            color="loss"
                        />
                    </div>
                </div>

                {/* 3. Outcome */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-tertiary uppercase tracking-[0.3em]">03. Outcome</label>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${outcome !== null ? 'bg-brand/20 text-brand' : 'bg-white/5 text-tertiary'}`}>REQUIRED</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <ActionButton
                            active={outcome === 'WIN'}
                            onClick={() => setOutcome('WIN')}
                            label="Win"
                            shortcut="W"
                            compact
                            color="profit"
                        />
                        <ActionButton
                            active={outcome === 'LOSS'}
                            onClick={() => setOutcome('LOSS')}
                            label="Loss"
                            shortcut="L"
                            compact
                            color="loss"
                        />
                        <ActionButton
                            active={outcome === 'BE'}
                            onClick={() => setOutcome('BE')}
                            label="B.E"
                            shortcut="B"
                            compact
                            color="brand"
                        />
                    </div>
                </div>
            </div>

            {/* Tactical Footer */}
            <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-8 pt-8 border-t border-white/5">
                {/* Image Attachments */}
                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="h-14 px-6 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 text-xs font-bold text-tertiary hover:text-primary hover:bg-white/10 transition-all group"
                    >
                        <ImageIcon size={16} className="group-hover:text-brand transition-colors" />
                        Attach Proof
                        {screenshots.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-brand text-black text-[10px] font-black">
                                {screenshots.length}
                            </span>
                        )}
                    </button>

                    <div className="flex gap-2">
                        {screenshots.map((src, i) => (
                            <div key={i} className="relative group w-14 h-14 rounded-xl overflow-hidden border border-white/10 shadow-2xl skew-x-[-4deg] hover:skew-x-0 transition-transform">
                                <img src={src} className="w-full h-full object-cover" alt="log" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={() => removeScreenshot(i)} className="p-2 bg-loss/80 rounded-lg text-white">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit & R-Config */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex flex-col items-end gap-3">
                        <button
                            onClick={() => setShowRMultiple(!showRMultiple)}
                            className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${showRMultiple ? 'text-brand' : 'text-tertiary hover:text-secondary'}`}
                        >
                            <span className="opacity-40">Risk Param:</span>
                            {rMultiple.toFixed(1)}R
                            <ChevronRight size={12} className={`transition-transform duration-300 ${showRMultiple ? 'rotate-90' : ''}`} />
                        </button>

                        {showRMultiple && (
                            <div className="flex items-center gap-2 p-1 bg-surface-highlight/50 border border-white/10 rounded-xl animate-scale-in">
                                <button onClick={() => setRMultiple(Math.max(0, rMultiple - 0.5))} className="p-2 hover:bg-white/5 rounded-lg text-secondary">
                                    <Minus size={14} />
                                </button>
                                <span className="text-sm font-black tabular-nums min-w-[30px] text-center">{rMultiple.toFixed(1)}</span>
                                <button onClick={() => setRMultiple(rMultiple + 0.5)} className="p-2 hover:bg-white/5 rounded-lg text-secondary">
                                    <Plus size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!isComplete}
                        className={`h-16 flex-1 md:flex-none md:min-w-[240px] px-8 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 relative overflow-hidden group/submit
                            ${isComplete
                                ? 'bg-brand text-black shadow-[0_15px_30px_-10px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98]'
                                : 'bg-white/5 text-tertiary/20 border border-white/5 cursor-not-allowed'}`}
                    >
                        {isComplete && (
                            <div className="absolute inset-0 translate-x-[-100%] group-hover/submit:translate-x-[100%] transition-transform duration-1000 bg-white/20 skew-x-[-20deg]" />
                        )}
                        <div className="flex items-center justify-center gap-3">
                            {isComplete ? 'Commit Log' : 'Awaiting Context'}
                            <Keyboard size={14} className={isComplete ? 'opacity-100' : 'opacity-20'} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ActionButtonProps {
    active: boolean;
    onClick: () => void;
    label: string;
    shortcut: string;
    icon?: React.ReactNode;
    color: 'profit' | 'loss' | 'brand';
    compact?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ active, onClick, label, shortcut, icon, color, compact }) => {
    const colorMap = {
        profit: 'text-profit border-profit/30 bg-profit/5',
        loss: 'text-loss border-loss/30 bg-loss/5',
        brand: 'text-brand border-brand/30 bg-brand/5'
    };

    return (
        <button
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border transition-all duration-300 group/btn
                ${active
                    ? `${colorMap[color]} shadow-[0_0_20px_rgba(0,0,0,0.4)] scale-[0.98]`
                    : 'bg-white/5 border-white/5 text-tertiary hover:bg-white/10 hover:border-white/10'
                }
                ${compact ? 'py-4' : 'py-6'}
            `}
        >
            {active && (
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full 
                    ${color === 'profit' ? 'bg-profit shadow-[0_0_8px_#22c55e]' :
                        color === 'loss' ? 'bg-loss shadow-[0_0_8px_#ef4444]' :
                            'bg-brand shadow-[0_0_8px_#06b6d4]'}`}
                />
            )}

            {icon && <div className={`transition-transform duration-500 ${active ? 'scale-110 drop-shadow-[0_0_5px_currentColor]' : 'group-hover/btn:scale-110'}`}>{icon}</div>}
            {!icon && <span className="text-sm font-black italic">{label.charAt(0)}</span>}

            <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-40'}`}>
                {label} <span className="font-mono ml-0.5 opacity-50">({shortcut})</span>
            </span>
        </button>
    );
};
