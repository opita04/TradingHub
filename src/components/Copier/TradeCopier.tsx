import React, { useState } from 'react';
import {
    Users,
    Shield,
    Power,
    Plus,
    Settings,
    Cpu
} from 'lucide-react';
import { useCopierStore } from '../../stores/copierStore';
import { ProcessVisualizer } from './ProcessVisualizer';

export const TradeCopier: React.FC = () => {
    const { groups, addGroup, toggleGroupActive } = useCopierStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    const handleCreate = () => {
        if (!newGroupName) return;
        // Mock Master ID for now
        addGroup(newGroupName, 'master-1');
        setNewGroupName('');
        setIsCreating(false);
    };

    return (
        <div className="w-full space-y-8 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center glass-panel p-6 rounded-xl">
                <div>
                    <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Cpu className="text-brand" />
                        Trade Copier
                    </h2>
                    <p className="text-secondary text-xs mt-1">Low-latency local trade replication & risk management</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-brand hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand/20"
                >
                    <Plus size={16} />
                    New Group
                </button>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {groups.map(group => (
                    <div key={group.id} className="glass-panel p-6 rounded-xl hover:border-brand/30 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors ${group.isActive ? 'bg-profit/10 text-profit shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-white/5 text-tertiary'}`}>
                                    <Power size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-primary">{group.name}</h3>
                                    <span className={`text-[10px] uppercase tracking-wider font-bold ${group.isActive ? 'text-profit' : 'text-tertiary'}`}>
                                        {group.isActive ? 'Active • Running' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                            <button className="text-tertiary hover:text-primary transition-colors p-2 hover:bg-white/5 rounded-lg">
                                <Settings size={18} />
                            </button>
                        </div>

                        {/* Visualization */}
                        <div className="mb-6">
                            <ProcessVisualizer
                                masterId="FTMO-188293"
                                isActive={group.isActive}
                                slaves={[
                                    { id: 'TFT-99201', name: 'The Funded Trader', latency: 12, status: group.isActive ? 'connected' : 'disconnected' },
                                    { id: 'MFF-33211', name: 'MyForexFunds', latency: 18, status: group.isActive ? 'connected' : 'disconnected' }
                                ]}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs bg-surface p-3 rounded-lg mb-4 border border-white/5">
                            <span className="text-secondary flex items-center gap-1.5">
                                <Shield size={14} className="text-orange-400" />
                                Risk Mode
                            </span>
                            <span className="text-primary font-mono font-bold uppercase tracking-wider">{group.riskMode}</span>
                        </div>

                        <button
                            onClick={() => toggleGroupActive(group.id)}
                            className={`w-full py-3 rounded-lg text-xs font-bold tracking-widest transition-all shadow-lg ${group.isActive
                                ? 'bg-loss/10 text-loss hover:bg-loss/20 border border-loss/20'
                                : 'bg-profit/10 text-profit hover:bg-profit/20 border border-profit/20 shadow-profit/10'
                                }`}
                        >
                            {group.isActive ? 'STOP ENGINE' : 'START ENGINE'}
                        </button>
                    </div>
                ))}

                {groups.length === 0 && (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-tertiary border border-dashed border-white/10 rounded-xl bg-surface/30">
                        <Users size={48} className="mb-4 opacity-50" />
                        <p className="text-sm font-medium">No replication groups active</p>
                        <p className="text-xs text-tertiary mt-2">Create a new group to start copying trades</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass p-6 rounded-2xl w-full max-w-md shadow-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-primary mb-4">New Copier Group</h3>
                        <input
                            value={newGroupName}
                            onChange={e => setNewGroupName(e.target.value)}
                            className="w-full bg-surface border border-white/10 rounded-lg p-3 text-sm text-primary mb-6 focus:border-brand outline-none focus:ring-1 focus:ring-brand"
                            placeholder="Group Name (e.g. Prop Firmware)"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-secondary hover:text-primary text-sm transition-colors">Cancel</button>
                            <button onClick={handleCreate} className="px-4 py-2 bg-brand hover:bg-cyan-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-brand/20 transition-all">Create Group</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

