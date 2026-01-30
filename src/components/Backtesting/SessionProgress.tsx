import React from 'react';
import { useBacktestStore } from '../../stores/backtestStore';

export const SessionProgress: React.FC = () => {
    const { currentSession, getProgress } = useBacktestStore();
    const { current, target, percent } = getProgress();

    if (!currentSession) return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTargetTime = (minutes: number) => {
        return `${minutes}:00`;
    };

    return (
        <div className="w-full space-y-8">
            <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black text-primary tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {currentSession.mode === 'SAMPLE' ? current : formatTime(current)}
                        </span>
                        <span className="text-2xl font-bold text-tertiary tracking-tight opacity-40">
                            / {currentSession.mode === 'SAMPLE' ? target : formatTargetTime(target / 60)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${percent >= 100 ? 'bg-profit' : 'bg-brand'} animate-pulse shadow-[0_0_8px_currentColor]`} />
                        <p className="text-[10px] font-black text-tertiary uppercase tracking-[0.2em]">
                            {currentSession.mode === 'SAMPLE' ? 'Samples Collected' : 'Execution Time'}
                        </p>
                    </div>
                </div>

                <div className="relative h-24 w-24 flex items-center justify-center">
                    {/* SVG Circular Progress */}
                    <svg className="w-full h-full -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-white/5"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={264}
                            strokeDashoffset={264 - (264 * percent) / 100}
                            strokeLinecap="round"
                            className="text-brand transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-brand tabular-nums">{Math.round(percent)}%</span>
                    </div>
                </div>
            </div>

            {/* Linear Progress with Glow */}
            <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                    className="h-full bg-gradient-to-r from-brand via-blue-400 to-brand bg-[length:200%_100%] animate-shimmer transition-all duration-700 ease-out shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    style={{ width: `${Math.min(percent, 100)}%` }}
                />
            </div>
        </div>
    );
};
