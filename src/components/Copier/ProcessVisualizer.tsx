import React from 'react';
import { Server, Smartphone, Wifi, WifiOff } from 'lucide-react';

interface ProcessVisualizerProps {
    masterId: string;
    slaves: { id: string; name: string; latency?: number; status: 'connected' | 'disconnected' }[];
    isActive: boolean;
}

export const ProcessVisualizer: React.FC<ProcessVisualizerProps> = ({ masterId, slaves, isActive }) => {
    return (
        <div className="relative p-6 bg-app rounded-xl border border-white/5 overflow-hidden min-h-[200px] flex items-center justify-center gap-12">

            {/* Background Grid/Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* Master Node */}
            <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${isActive ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-surface border-white/10'}`}>
                    <Server size={32} className={isActive ? 'text-blue-400' : 'text-tertiary'} />
                </div>
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">Master</span>
                <span className="text-xs font-mono text-primary bg-surface px-2 py-0.5 rounded border border-white/5">{masterId}</span>
            </div>

            {/* Connections */}
            <div className="flex-1 max-w-[200px] relative h-20 flex items-center">
                {slaves.map((_slave, _index) => {
                    // Calculate vertical offset roughly to fan out lines if strictly using CSS/SVG, 
                    // but for simplicity in this pure React/Tailwind demo without complex SVG calc, 
                    // we'll just show a central pulsing line or proper SVG curves.
                    // Let's use a single main visual channel for now.
                    return null;
                })}

                {/* Visual Data Stream - Animated Line */}
                <div className="w-full h-0.5 bg-white/5 relative overflow-hidden rounded-full">
                    {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent w-1/2 animate-[shimmer_1s_infinite] opacity-75" />
                    )}
                </div>
            </div>

            {/* Slave Nodes (Vertical Stack if many, or simple row) */}
            <div className="relative z-10 flex flex-col gap-4">
                {slaves.map((slave) => (
                    <div key={slave.id} className="flex items-center gap-3 bg-surface border border-white/5 px-3 py-2 rounded-lg min-w-[180px]">
                        <div className={`p-1.5 rounded-lg ${slave.status === 'connected' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            <Smartphone size={16} />
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-xs font-medium text-gray-200">{slave.name}</span>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-tertiary font-mono">{slave.id}</span>
                                <div className="flex items-center gap-1">
                                    {isActive ? <Wifi size={10} className="text-green-500" /> : <WifiOff size={10} className="text-tertiary" />}
                                    <span className={`text-[10px] font-mono ${slave.latency && slave.latency < 20 ? 'text-green-400' : 'text-yellow-400'}`}>{slave.latency}ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};
