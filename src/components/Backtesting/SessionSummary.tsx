import React from 'react';
import { useBacktestStore } from '../../stores/backtestStore';
import { useTradeStore } from '../../stores/tradeStore';
import { RefreshCw, TrendingUp, CheckCircle, Clock, Trophy, Target, BarChart3, ArrowRight } from 'lucide-react';

export const SessionSummary: React.FC = () => {
    const { currentSession, resetSession } = useBacktestStore();
    const { trades } = useTradeStore();

    if (!currentSession) return null;

    const sessionTrades = trades.filter(t => t.sessionId === currentSession.id);
    const winCount = sessionTrades.filter(t => t.pnl > 0).length;
    const lossCount = sessionTrades.filter(t => t.pnl < 0).length;
    const beCount = sessionTrades.filter(t => t.pnl === 0).length;

    const winRate = sessionTrades.length > 0
        ? (winCount / sessionTrades.length) * 100
        : 0;

    const totalR = sessionTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);

    const durationMins = currentSession.endTime
        ? Math.round((currentSession.endTime - currentSession.startTime) / 60000)
        : 0;

    return (
        <div className="max-w-4xl mx-auto py-16 px-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                            <Trophy size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-brand uppercase tracking-[0.4em]">Reporting Node</span>
                            <span className="text-xs font-bold text-tertiary">Session ID: {currentSession.id.slice(0, 8)}</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-primary tracking-tight">Session Intelligence</h1>
                    <p className="text-tertiary text-sm mt-2">Data archived. Performance snapshots generated.</p>
                </div>

                <div className={`px-6 py-3 rounded-2xl border backdrop-blur-md flex items-center gap-3 ${currentSession.status === 'COMPLETED' ? 'bg-profit/10 border-profit/20 text-profit' : 'bg-loss/10 border-loss/20 text-loss'}`}>
                    <CheckCircle size={18} />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">{currentSession.status}</span>
                </div>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <SummaryCard
                    label="Samples"
                    value={sessionTrades.length}
                    subValue="Total Logs"
                    icon={Target}
                    color="text-brand"
                />
                <SummaryCard
                    label="Efficiency"
                    value={`${Math.round(winRate)}%`}
                    subValue="Win Rate"
                    icon={TrendingUp}
                    color="text-profit"
                />
                <SummaryCard
                    label="P&L Result"
                    value={`${totalR > 0 ? '+' : ''}${totalR.toFixed(1)}R`}
                    subValue="Net Return"
                    icon={BarChart3}
                    color={totalR >= 0 ? 'text-profit' : 'text-loss'}
                />
                <SummaryCard
                    label="Time Expired"
                    value={`${durationMins}m`}
                    subValue="Duration"
                    icon={Clock}
                    color="text-secondary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Visual Breakdown */}
                <div className="lg:col-span-2 bg-surface/30 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl">
                    <h3 className="text-xs font-black text-tertiary uppercase tracking-[0.4em] mb-8">Execution Matrix</h3>
                    <div className="space-y-8">
                        <MatrixRow label="Wins" count={winCount} total={sessionTrades.length} color="bg-profit" textColor="text-profit" />
                        <MatrixRow label="Losses" count={lossCount} total={sessionTrades.length} color="bg-loss" textColor="text-loss" />
                        <MatrixRow label="Breakeven" count={beCount} total={sessionTrades.length} color="bg-brand" textColor="text-brand" />
                    </div>
                </div>

                {/* Strategy Context */}
                <div className="bg-brand/5 border border-brand/10 rounded-[2.5rem] p-10 flex flex-col justify-between">
                    <div>
                        <h3 className="text-[10px] font-black text-brand uppercase tracking-[0.4em] mb-6">Strategy Context</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-[10px] font-bold text-tertiary uppercase block mb-1">Architecture</span>
                                <span className="text-lg font-black text-primary">{currentSession.strategySnapshot.name}</span>
                            </div>
                            <div className="flex gap-6">
                                <div>
                                    <span className="text-[10px] font-bold text-tertiary uppercase block mb-1">Asset</span>
                                    <span className="text-sm font-bold text-secondary uppercase">{currentSession.market}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-tertiary uppercase block mb-1">TF</span>
                                    <span className="text-sm font-bold text-secondary uppercase">{currentSession.timeframe}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={resetSession}
                        className="group w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-brand text-black font-black uppercase text-[10px] tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-brand/20"
                    >
                        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                        New Session
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ label, value, subValue, icon: Icon, color }: any) => (
    <div className="bg-surface/20 border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 transition-transform duration-500 group-hover:scale-110 opacity-20 group-hover:opacity-40">
            <Icon size={40} className={color} />
        </div>
        <div className="relative z-10">
            <span className="text-[10px] font-black text-tertiary uppercase tracking-[0.3em] block mb-1">{label}</span>
            <div className={`text-4xl font-black mb-1 ${color}`}>{value}</div>
            <span className="text-[10px] font-bold text-tertiary/40 uppercase tracking-widest">{subValue}</span>
        </div>
    </div>
);

const MatrixRow = ({ label, count, total, color, textColor }: any) => {
    const percent = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{label}</span>
                <span className={`text-sm font-black italic ${textColor}`}>{count} <span className="text-tertiary/40 font-bold ml-1">({Math.round(percent)}%)</span></span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                    className={`h-full ${color} transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};
