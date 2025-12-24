import React from 'react';
import { ChevronDown, Info, CheckCircle } from 'lucide-react';
import { useStrategiesStore } from '../../../stores/strategiesStore';
import type { TradeFormData } from '../NewTradeModal';

interface StrategyTabProps {
    formData: TradeFormData;
    updateFormData: (updates: Partial<TradeFormData>) => void;
}

const CONFLUENCES = [
    { id: 'setup-confirmation', name: 'Setup Confluence', description: 'Primary setup confirmation', weight: 100 },
    { id: 'trend-alignment', name: 'Trend Alignment', description: 'Price aligned with higher timeframe trend', weight: 15 },
    { id: 'structure-break', name: 'Structure Break', description: 'Clear break of market structure', weight: 20 },
    { id: 'liquidity-grab', name: 'Liquidity Grab', description: 'Stop hunt or liquidity sweep observed', weight: 15 },
    { id: 'order-block', name: 'Order Block', description: 'Entry at valid order block', weight: 15 },
    { id: 'fair-value-gap', name: 'Fair Value Gap', description: 'Entry fills a fair value gap', weight: 10 },
    { id: 'session-timing', name: 'Session Timing', description: 'Trade within optimal session window', weight: 10 },
    { id: 'news-clear', name: 'News Clear', description: 'No high-impact news during trade', weight: 5 }
];

export const StrategyTab: React.FC<StrategyTabProps> = ({ formData, updateFormData }) => {
    const { strategies } = useStrategiesStore();

    const toggleConfluence = (id: string) => {
        const current = formData.confluences || [];
        const updated = current.includes(id)
            ? current.filter(c => c !== id)
            : [...current, id];

        // Calculate quality score
        const quality = CONFLUENCES
            .filter(c => updated.includes(c.id))
            .reduce((sum, c) => sum + c.weight, 0);

        updateFormData({
            confluences: updated,
            setupQuality: Math.min(quality, 100)
        });
    };

    return (
        <div className="space-y-6">
            {/* Strategy Selector */}
            <div>
                <label className="block text-sm font-medium text-secondary mb-2">Strategy</label>
                <div className="relative">
                    <select
                        value={formData.strategyId}
                        onChange={(e) => updateFormData({ strategyId: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-primary appearance-none cursor-pointer hover:bg-surface-highlight transition-colors"
                    >
                        <option value="">Select a strategy...</option>
                        {strategies.map((strategy) => (
                            <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none" />
                </div>
            </div>

            {/* Setup Quality Assessment */}
            <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${formData.setupQuality >= 50 ? 'bg-profit' : 'bg-brand'}`} />
                        <span className="text-sm font-medium text-primary">Setup Quality Assessment</span>
                    </div>
                    <span className={`text-lg font-bold ${formData.setupQuality >= 70 ? 'text-profit' :
                            formData.setupQuality >= 40 ? 'text-amber-400' : 'text-brand'
                        }`}>
                        {formData.setupQuality}%
                    </span>
                </div>

                {/* Confluence Checkboxes */}
                <div className="space-y-3">
                    {CONFLUENCES.map((confluence) => (
                        <button
                            key={confluence.id}
                            onClick={() => toggleConfluence(confluence.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${formData.confluences?.includes(confluence.id)
                                    ? 'bg-brand/10 border-brand/30'
                                    : 'bg-surface border-white/5 hover:bg-surface-highlight'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded flex items-center justify-center ${formData.confluences?.includes(confluence.id)
                                    ? 'bg-brand text-white'
                                    : 'bg-surface-highlight border border-white/10'
                                }`}>
                                {formData.confluences?.includes(confluence.id) && (
                                    <CheckCircle size={14} />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-primary">{confluence.name}</span>
                                    <span className={`text-xs ${formData.confluences?.includes(confluence.id) ? 'text-brand' : 'text-tertiary'
                                        }`}>
                                        {confluence.weight}%
                                    </span>
                                </div>
                                <p className="text-xs text-tertiary mt-0.5">{confluence.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-brand/5 border border-brand/20 rounded-lg">
                <Info size={16} className="text-brand flex-shrink-0 mt-0.5" />
                <p className="text-xs text-brand">
                    Check off the confluences present in this setup. Quality score helps track which setups perform best.
                </p>
            </div>
        </div>
    );
};
