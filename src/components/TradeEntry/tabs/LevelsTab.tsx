import React, { useMemo } from 'react';
import type { TradeFormData } from '../NewTradeModal';

interface LevelsTabProps {
    formData: TradeFormData;
    updateFormData: (updates: Partial<TradeFormData>) => void;
}

// Futures instruments use "ticks", forex uses "pips"
// Comprehensive list: Equity Index (E-mini + Micro), Energy, Metals, Treasury, Currency futures
const FUTURES_INSTRUMENTS = [
    // Equity Index - E-mini
    'ES', 'NQ', 'YM', 'RTY',
    // Equity Index - Micro
    'MES', 'MNQ', 'MYM', 'M2K',
    // Energy
    'CL', 'MCL', 'NG', 'MNG', 'RB', 'HO',
    // Metals
    'GC', 'MGC', 'SI', 'SIL', 'HG', 'PA', 'PL',
    // Treasury
    'ZB', 'ZN', 'ZF', 'ZT', 'ZC',
    // Currency
    '6E', 'M6E', '6B', 'M6B', '6J', '6A', '6C', '6S',
    // Crypto Futures
    'BTC', 'MBT', 'ETH',
    // Legacy/Aliases
    'NAS100', 'NAS', 'SPX', 'NDX'
];

const isFuturesInstrument = (instrument: string): boolean => {
    const normalized = instrument.toUpperCase().trim();
    return FUTURES_INSTRUMENTS.some(futures =>
        normalized === futures ||
        normalized.startsWith(futures) ||
        normalized.includes(futures)
    );
};

export const LevelsTab: React.FC<LevelsTabProps> = ({ formData, updateFormData }) => {
    // Determine unit label based on instrument type
    const unitLabel = useMemo(() => {
        return isFuturesInstrument(formData.instrument) ? 'Ticks' : 'Pips';
    }, [formData.instrument]);

    // Calculate Risk-Reward Ratio
    const riskRewardRatio = useMemo(() => {
        if (!formData.entryPrice || !formData.stopLoss || !formData.takeProfit) {
            return { ratio: '0.00', display: '1:0.00' };
        }

        const entry = parseFloat(formData.entryPrice);
        const sl = parseFloat(formData.stopLoss);
        const tp = parseFloat(formData.takeProfit);

        if (isNaN(entry) || isNaN(sl) || isNaN(tp)) {
            return { ratio: '0.00', display: '1:0.00' };
        }

        const risk = Math.abs(entry - sl);
        const reward = Math.abs(tp - entry);

        if (risk === 0) return { ratio: '0.00', display: '1:0.00' };

        const ratio = (reward / risk).toFixed(2);
        return { ratio, display: `1:${ratio}` };
    }, [formData.entryPrice, formData.stopLoss, formData.takeProfit]);

    const Toggle: React.FC<{
        label: string;
        checked: boolean;
        onChange: (checked: boolean) => void;
    }> = ({ label, checked, onChange }) => (
        <button
            onClick={() => onChange(!checked)}
            className="flex items-center gap-2"
        >
            <span className="text-xs text-tertiary">{label}</span>
            <div className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-profit' : 'bg-surface-highlight'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-5' : 'left-0.5'}`} />
            </div>
        </button>
    );

    return (
        <div className="space-y-6">
            {/* Entry Price */}
            <div>
                <label className="block text-sm font-medium text-secondary mb-2">Entry Price</label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Enter entry price"
                    value={formData.entryPrice}
                    onChange={(e) => updateFormData({ entryPrice: e.target.value })}
                    className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-primary placeholder:text-tertiary"
                />
            </div>

            {/* Stop Loss & Take Profit */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-secondary">Stop Loss (price)</label>
                        <Toggle
                            label={unitLabel}
                            checked={formData.usePipsForSL}
                            onChange={(checked) => updateFormData({ usePipsForSL: checked })}
                        />
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        placeholder={formData.usePipsForSL ? `Enter in ${unitLabel.toLowerCase()}` : 'Enter in price'}
                        value={formData.stopLoss}
                        onChange={(e) => updateFormData({ stopLoss: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-primary placeholder:text-tertiary"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-secondary">Take Profit (price)</label>
                        <Toggle
                            label={unitLabel}
                            checked={formData.usePipsForTP}
                            onChange={(checked) => updateFormData({ usePipsForTP: checked })}
                        />
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        placeholder={formData.usePipsForTP ? `Enter in ${unitLabel.toLowerCase()}` : 'Enter in price'}
                        value={formData.takeProfit}
                        onChange={(e) => updateFormData({ takeProfit: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-primary placeholder:text-tertiary"
                    />
                </div>
            </div>

            {/* Dollar Risk & Lot Size */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Dollar Risk ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Enter dollar risk"
                        value={formData.dollarRisk}
                        onChange={(e) => updateFormData({ dollarRisk: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-primary placeholder:text-tertiary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Lot Size</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Enter lot size"
                        value={formData.lotSize}
                        onChange={(e) => updateFormData({ lotSize: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-primary placeholder:text-tertiary"
                    />
                </div>
            </div>

            {/* Risk-Reward Ratio Display */}
            <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-secondary">Risk-Reward Ratio</span>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                    {riskRewardRatio.display}
                </div>
                <p className="text-xs text-tertiary">
                    {formData.entryPrice && formData.stopLoss && formData.takeProfit
                        ? 'Calculated from entry, stop loss, and take profit'
                        : 'Enter prices to calculate ratio'}
                </p>
                {/* Visual Progress Bar */}
                <div className="mt-4 h-2 bg-surface rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-loss via-amber-500 to-profit transition-all"
                        style={{ width: `${Math.min(parseFloat(riskRewardRatio.ratio) * 33, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
