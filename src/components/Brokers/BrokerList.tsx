import React from 'react';
import { Landmark, ExternalLink, Globe } from 'lucide-react';

interface Broker {
    name: string;
    type: 'ECN' | 'STP' | 'Market Maker';
    regulation: string[];
    assets: string[];
    spreads: string;
    location: string;
    link: string;
}

const BROKERS: Broker[] = [
    { name: 'IC Markets', type: 'ECN', regulation: ['ASIC', 'CySEC'], assets: ['Forex', 'Indices', 'Crypto'], spreads: 'Raw From 0.0', location: 'Australia', link: '#' },
    { name: 'Pepperstone', type: 'ECN', regulation: ['FCA', 'ASIC', 'BaFin'], assets: ['Forex', 'Commodities'], spreads: 'Competitive', location: 'Australia', link: '#' },
    { name: 'OANDA', type: 'Market Maker', regulation: ['NFA', 'FCA', 'ASIC'], assets: ['Forex', 'CFDs'], spreads: 'Variable', location: 'USA', link: '#' },
    { name: 'Interactive Brokers', type: 'ECN', regulation: ['SEC', 'FCA', 'SFC'], assets: ['Everything'], spreads: 'Direct Market', location: 'Global', link: '#' },
];

export const BrokerList: React.FC = () => {
    return (
        <div className="p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <Landmark className="text-green-500" size={32} />
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">Brokerage Directory</h1>
                    <p className="text-gray-400">Trusted execution venues and liquidity providers.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BROKERS.map((broker, i) => (
                    <div key={i} className="bg-[#1a1f2e] border border-[#27272a] rounded-xl p-5 hover:border-green-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-xl text-gray-200">{broker.name}</h3>
                            <div className="flex gap-2">
                                {broker.regulation.map(reg => (
                                    <span key={reg} className="text-[10px] bg-[#0a0a0a] border border-[#334155] px-2 py-0.5 rounded text-gray-400">{reg}</span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm border-b border-[#27272a] pb-2">
                                <span className="text-gray-500">Execution Type</span>
                                <span className="text-gray-300 font-medium">{broker.type}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-[#27272a] pb-2">
                                <span className="text-gray-500">Spreads</span>
                                <span className="text-green-400 font-mono">{broker.spreads}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Assets</span>
                                <span className="text-gray-300 max-w-[150px] text-right truncate">{broker.assets.join(', ')}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#27272a]">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Globe size={12} />
                                {broker.location}
                            </div>
                            <button className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                                Open Account <ExternalLink size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
