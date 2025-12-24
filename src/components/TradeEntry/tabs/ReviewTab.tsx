import React, { useCallback } from 'react';
import { Image, Plus, X, Link } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { TradeFormData } from '../NewTradeModal';
import type { ChartAnalysis } from '../../../types';

interface ReviewTabProps {
    formData: TradeFormData;
    updateFormData: (updates: Partial<TradeFormData>) => void;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({ formData, updateFormData }) => {
    const analyses = formData.chartAnalysis || [];

    const addChartAnalysis = () => {
        const newAnalysis: ChartAnalysis = {
            id: uuidv4(),
            screenshotData: undefined,
            tradingViewLink: '',
            notes: ''
        };
        updateFormData({ chartAnalysis: [...analyses, newAnalysis] });
    };

    const updateAnalysis = (id: string, updates: Partial<ChartAnalysis>) => {
        updateFormData({
            chartAnalysis: analyses.map(a => a.id === id ? { ...a, ...updates } : a)
        });
    };

    const removeAnalysis = (id: string) => {
        updateFormData({
            chartAnalysis: analyses.filter(a => a.id !== id)
        });
    };

    const handleImageUpload = useCallback((analysisId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            updateAnalysis(analysisId, { screenshotData: base64 });
        };
        reader.readAsDataURL(file);
    }, [analyses]);

    // Initialize with one analysis card if empty
    React.useEffect(() => {
        if (analyses.length === 0) {
            addChartAnalysis();
        }
    }, []);

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary">Chart Analysis</h3>

            {/* Chart Analysis Cards */}
            {analyses.map((analysis, index) => (
                <div key={analysis.id} className="glass-card p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-tertiary">Analysis {index + 1}</span>
                        {analyses.length > 1 && (
                            <button
                                onClick={() => removeAnalysis(analysis.id)}
                                className="p-1 text-tertiary hover:text-loss transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Chart Screenshot Upload */}
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Chart Screenshot</label>
                            {analysis.screenshotData ? (
                                <div className="relative">
                                    <img
                                        src={analysis.screenshotData}
                                        alt="Chart"
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => updateAnalysis(analysis.id, { screenshotData: undefined })}
                                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-white/20 transition-colors">
                                    <Image size={24} className="text-tertiary mb-2" />
                                    <span className="text-xs text-tertiary">Upload chart image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(analysis.id, e)}
                                        className="hidden"
                                    />
                                </label>
                            )}

                            {/* TradingView Link */}
                            <div className="mt-3">
                                <div className="relative">
                                    <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
                                    <input
                                        type="url"
                                        placeholder="Paste your TradingView chart link here"
                                        value={analysis.tradingViewLink || ''}
                                        onChange={(e) => updateAnalysis(analysis.id, { tradingViewLink: e.target.value })}
                                        className="w-full bg-surface border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-primary placeholder:text-tertiary"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Notes</label>
                            <textarea
                                placeholder="Write your thoughts about this trade, lessons learned, or things to improve..."
                                value={analysis.notes || ''}
                                onChange={(e) => updateAnalysis(analysis.id, { notes: e.target.value })}
                                className="w-full h-44 bg-surface border border-white/10 rounded-lg p-3 text-sm text-primary placeholder:text-tertiary resize-none"
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* Add Chart Analysis Button */}
            <button
                onClick={addChartAnalysis}
                className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/10 rounded-lg text-sm text-tertiary hover:text-primary hover:border-white/20 transition-colors"
            >
                <Plus size={16} />
                Add Chart Analysis
            </button>

            {/* General Notes */}
            <div>
                <label className="block text-sm font-medium text-secondary mb-2">Additional Notes</label>
                <textarea
                    placeholder="Any other observations or notes about this trade..."
                    value={formData.notes || ''}
                    onChange={(e) => updateFormData({ notes: e.target.value })}
                    className="w-full h-24 bg-surface border border-white/10 rounded-lg p-3 text-sm text-primary placeholder:text-tertiary resize-none"
                />
            </div>
        </div>
    );
};
