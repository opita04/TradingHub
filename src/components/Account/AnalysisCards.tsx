import React from 'react';
import { HelpCircle } from 'lucide-react';

export const AnalysisCards: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Take Profit Analysis */}
            <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-brand" />
                    <span className="text-sm font-medium text-primary">Take Profit Analysis</span>
                    <HelpCircle size={14} className="text-tertiary" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                        <div className="text-xs text-tertiary mb-1">Trades Hit TP</div>
                        <div className="text-2xl font-bold text-primary">0</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-tertiary mb-1">Avg R After TP</div>
                        <div className="text-2xl font-bold text-brand">0R</div>
                    </div>
                </div>
            </div>

            {/* Break Even Analysis */}
            <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full border border-tertiary" />
                    <span className="text-sm font-medium text-primary">Break Even Analysis</span>
                    <HelpCircle size={14} className="text-tertiary" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                        <div className="text-xs text-tertiary mb-1">BE Trades</div>
                        <div className="text-2xl font-bold text-primary">0</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-tertiary mb-1">TP After BE</div>
                        <div className="text-2xl font-bold text-primary">0</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
