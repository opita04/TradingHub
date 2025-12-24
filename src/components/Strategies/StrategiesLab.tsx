import React, { useState } from 'react';
import {
    FlaskConical,
    Database,
    Play,
    Zap,
    Plus,
    MoreHorizontal
} from 'lucide-react';
import { useStrategiesStore } from '../../stores/strategiesStore';
import type { Strategy } from '../../types';

const StatusColumn = ({
    title,
    status,
    strategies,
    icon: Icon,
    color,
    onMove
}: {
    title: string,
    status: Strategy['status'],
    strategies: Strategy[],
    icon: any,
    color: string,
    onMove: (id: string, status: Strategy['status']) => void
}) => (
    <div className="flex-1 min-w-[280px] bg-[#1a1f2e] rounded-xl flex flex-col border border-[#27272a]">
        <div className={`p-4 border-b border-[#27272a] flex items-center gap-2 ${color}`}>
            <Icon size={18} />
            <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wide">{title}</h3>
            <span className="ml-auto text-xs bg-[#0a0a0a] px-2 py-0.5 rounded text-gray-400">
                {strategies.length}
            </span>
        </div>
        <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
            {strategies.map(strategy => (
                <div key={strategy.id} className="bg-[#0a0a0a] border border-[#334155] rounded-lg p-4 hover:border-blue-500/50 transition-colors group relative">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${strategy.type === 'scalper' ? 'bg-purple-900/20 text-purple-400 border-purple-900/50' :
                                strategy.type === 'swing' ? 'bg-blue-900/20 text-blue-400 border-blue-900/50' :
                                    'bg-green-900/20 text-green-400 border-green-900/50'
                            }`}>
                            {strategy.type}
                        </span>
                        <button className="text-gray-500 hover:text-gray-300">
                            <MoreHorizontal size={14} />
                        </button>
                    </div>
                    <h4 className="font-bold text-gray-200 mb-2">{strategy.name}</h4>

                    {strategy.status !== 'hypothesis' && (
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-600">Win Rate</span>
                                <span className="font-mono text-gray-300">{strategy.winRate}%</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] text-gray-600">PF</span>
                                <span className="font-mono text-gray-300">{strategy.profitFactor}</span>
                            </div>
                        </div>
                    )}

                    {/* Quick Move Utility (Mock Drag & Drop) */}
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {status !== 'hypothesis' && (
                            <button
                                onClick={() => onMove(strategy.id, getPrevStatus(status))}
                                className="flex-1 bg-[#1a1f2e] hover:bg-[#252b3b] text-xs text-gray-400 py-1 rounded border border-[#334155]"
                            >
                                &larr; Prev
                            </button>
                        )}
                        {status !== 'live' && (
                            <button
                                onClick={() => onMove(strategy.id, getNextStatus(status))}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-xs text-white py-1 rounded"
                            >
                                Next &rarr;
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {strategies.length === 0 && (
                <div className="h-20 flex items-center justify-center text-gray-600 text-xs border border-dashed border-[#334155] rounded-lg">
                    Empty Stage
                </div>
            )}
        </div>
    </div>
);

const getNextStatus = (current: Strategy['status']): Strategy['status'] => {
    if (current === 'hypothesis') return 'data_integrity';
    if (current === 'data_integrity') return 'forward_testing';
    if (current === 'forward_testing') return 'live';
    return 'live';
};

const getPrevStatus = (current: Strategy['status']): Strategy['status'] => {
    if (current === 'live') return 'forward_testing';
    if (current === 'forward_testing') return 'data_integrity';
    if (current === 'data_integrity') return 'hypothesis';
    return 'hypothesis';
};

export const StrategiesLab: React.FC = () => {
    const { strategies, addStrategy, moveStrategy } = useStrategiesStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState<Strategy['type']>('scalper');

    const handleCreate = () => {
        if (!newName) return;
        addStrategy(newName, newType);
        setNewName('');
        setIsCreating(false);
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col p-6 animate-fade-in relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                        <FlaskConical className="text-purple-500" />
                        The Lab
                    </h2>
                    <p className="text-gray-400 text-xs">Strategy Incubation & Development Pipeline</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus size={16} />
                    New Hypothesis
                </button>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
                <StatusColumn
                    title="Hypothesis"
                    status="hypothesis"
                    strategies={strategies.filter(s => s.status === 'hypothesis')}
                    icon={FlaskConical}
                    color="text-purple-400"
                    onMove={moveStrategy}
                />
                <StatusColumn
                    title="Data Integrity"
                    status="data_integrity"
                    strategies={strategies.filter(s => s.status === 'data_integrity')}
                    icon={Database}
                    color="text-blue-400"
                    onMove={moveStrategy}
                />
                <StatusColumn
                    title="Forward Testing"
                    status="forward_testing"
                    strategies={strategies.filter(s => s.status === 'forward_testing')}
                    icon={Play}
                    color="text-yellow-400"
                    onMove={moveStrategy}
                />
                <StatusColumn
                    title="Live Trading"
                    status="live"
                    strategies={strategies.filter(s => s.status === 'live')}
                    icon={Zap}
                    color="text-green-400"
                    onMove={moveStrategy}
                />
            </div>

            {/* Create Modal Overlay */}
            {isCreating && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-[#1a1f2e] border border-[#334155] p-6 rounded-xl w-96 shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-200 mb-4">New Strategy Hypothesis</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Strategy Name</label>
                                <input
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-[#334155] rounded p-2 text-sm text-gray-200 focus:border-purple-500 outline-none"
                                    placeholder="e.g. Asia Range Breakout"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Type</label>
                                <select
                                    value={newType}
                                    onChange={e => setNewType(e.target.value as any)}
                                    className="w-full bg-[#0a0a0a] border border-[#334155] rounded p-2 text-sm text-gray-200 focus:border-purple-500 outline-none"
                                >
                                    <option value="scalper">Scalper</option>
                                    <option value="swing">Swing</option>
                                    <option value="trend">Trend Following</option>
                                    <option value="mean_reversion">Mean Reversion</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-gray-200 text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium"
                                >
                                    Create Strategy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
