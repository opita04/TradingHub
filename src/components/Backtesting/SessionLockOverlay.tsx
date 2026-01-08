import React from 'react';
import { useBacktestStore } from '../../stores/backtestStore';
import { useAppStore } from '../../stores/appStore';
import { Lock, FlaskConical } from 'lucide-react';

export const SessionLockOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentSession } = useBacktestStore();
    const { setActiveTab } = useAppStore();
    const isSessionActive = currentSession?.status === 'ACTIVE';

    if (!isSessionActive) return <>{children}</>;

    return (
        <div className="relative w-full h-full min-h-[60vh]">
            {/* Blurred Content */}
            <div className="filter blur-xl pointer-events-none select-none opacity-20">
                {children}
            </div>

            {/* Lock UI */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-20 h-20 bg-brand/10 border border-brand/20 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <Lock size={32} className="text-brand" />
                </div>

                <h2 className="text-2xl font-black text-primary mb-2 tracking-tight">Execution Mode Active</h2>
                <p className="text-secondary max-w-sm mb-8">
                    Analysis and strategy editing are locked during active sessions to ensure disciplined data collection.
                </p>

                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button
                        onClick={() => setActiveTab('backtest')}
                        className="flex items-center justify-center gap-2 py-4 bg-brand text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <FlaskConical size={18} />
                        Return to Backtest
                    </button>

                    <div className="text-[10px] text-tertiary uppercase tracking-widest font-bold">
                        Finish or Abort session to unlock
                    </div>
                </div>
            </div>
        </div>
    );
};
