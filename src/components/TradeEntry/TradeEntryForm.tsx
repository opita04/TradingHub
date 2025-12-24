import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Save, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useTradeStore } from '../../stores/tradeStore';
import type { Trade, Template, Screenshot } from '../../types';
import { QuickTemplateBar } from '../Templates/QuickTemplateBar';
import { DirectionToggle } from './DirectionToggle';
import { DateTimePicker } from '../Common/DateTimePicker';
import { ScreenshotDropzone } from '../Screenshots/ScreenshotDropzone';
import { ScreenshotGallery } from '../Screenshots/ScreenshotGallery';

const INITIAL_STATE: Partial<Trade> = {
    instrument: '',
    direction: 'long', // Default
    session: '',
    pnl: 0,
    setup: [],
    emotion: [],
    followedRules: true,
    notes: '',
    screenshots: [] // Initial empty array
};

export function TradeEntryForm() {
    const addTrade = useTradeStore((state) => state.addTrade);

    // Form State
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [time, setTime] = useState(format(new Date(), 'HH:mm'));

    const [formData, setFormData] = useState<Partial<Trade>>(INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Auto-clear success message
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleTemplateSelect = (template: Template) => {
        // Merge template data into form
        // If template has specific type logic, handle it here

        // For setup/emotion arrays, we might want to append instead of replace if needed
        // But for quick fill, replacement or simple merging is usually best.

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newValues: any = { ...template.prefill };

        // Special handling for array fields if we want to toggle/append (optional enhancement)
        // For now, let's just merge what's in the template.

        setFormData(prev => ({
            ...prev,
            ...newValues
        }));
    };

    const handleScreenshotsAdded = (newScreenshots: Screenshot[]) => {
        setFormData(prev => ({
            ...prev,
            screenshots: [...(prev.screenshots || []), ...newScreenshots]
        }));
    };

    const handleRemoveScreenshot = (id: string) => {
        setFormData(prev => ({
            ...prev,
            screenshots: prev.screenshots?.filter(s => s.id !== id) || []
        }));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (field: keyof Trade, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create new trade object
            const newTrade: Trade = {
                id: uuidv4(),
                date,
                time,
                instrument: formData.instrument || 'Unknown',
                direction: formData.direction || 'long',
                session: formData.session || '',
                pnl: Number(formData.pnl) || 0,
                setup: formData.setup || [],
                emotion: formData.emotion || [],
                followedRules: formData.followedRules || false,
                notes: formData.notes || '',
                entryPrice: formData.entryPrice ? Number(formData.entryPrice) : undefined,
                exitPrice: formData.exitPrice ? Number(formData.exitPrice) : undefined,
                positionSize: formData.positionSize ? Number(formData.positionSize) : undefined,
                screenshots: formData.screenshots || [],
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            addTrade(newTrade);

            // Reset form (keep date/time current? or maybe just reset dynamic fields)
            setFormData(INITIAL_STATE);
            setSuccessMessage('Trade logged successfully!');

        } catch (error) {
            console.error('Failed to log trade', error);
            // Show error handling
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <QuickTemplateBar onSelectTemplate={handleTemplateSelect} />

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Main Card: Core Details */}
                <div className="card space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-700/50">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                            Trade Details
                        </h3>
                        <div className="text-sm text-gray-400">
                            {/* Optional header actions */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <DateTimePicker
                                date={date}
                                time={time}
                                onDateChange={setDate}
                                onTimeChange={setTime}
                            />

                            <div>
                                <label className="label-text">Instrument</label>
                                <input
                                    type="text"
                                    placeholder="e.g. NQ, ES, AAPL"
                                    value={formData.instrument}
                                    onChange={(e) => handleChange('instrument', e.target.value.toUpperCase())}
                                    className="input-field w-full uppercase"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label-text mb-2 block">Direction</label>
                                <DirectionToggle
                                    value={formData.direction as 'buy' | 'sell'}
                                    onChange={(val) => handleChange('direction', val)}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="label-text">Session</label>
                                <input
                                    type="text"
                                    placeholder="e.g. NY AM, London"
                                    value={formData.session}
                                    onChange={(e) => handleChange('session', e.target.value)}
                                    className="input-field w-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label-text">Entry Price</label>
                                    <input
                                        type="number"
                                        step="0.25"
                                        value={formData.entryPrice || ''}
                                        onChange={(e) => handleChange('entryPrice', e.target.value)}
                                        className="input-field w-full"
                                    />
                                </div>
                                <div>
                                    <label className="label-text">Exit Price</label>
                                    <input
                                        type="number"
                                        step="0.25"
                                        value={formData.exitPrice || ''}
                                        onChange={(e) => handleChange('exitPrice', e.target.value)}
                                        className="input-field w-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label-text">Position Size</label>
                                <input
                                    type="number"
                                    value={formData.positionSize || ''}
                                    onChange={(e) => handleChange('positionSize', e.target.value)}
                                    className="input-field w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Outcome Card */}
                <div className="card grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-200">Result</h3>
                        <div>
                            <label className="text-sm font-medium text-gray-400 mb-1 block">PnL ($)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.pnl || ''}
                                    onChange={(e) => handleChange('pnl', e.target.value)}
                                    placeholder="0.00"
                                    className={`w-full bg-[#1a1f2e] border rounded-lg py-3 pl-8 pr-4 text-lg font-bold transition-colors ${Number(formData.pnl) > 0
                                        ? 'border-green-500/50 text-green-400 focus:ring-green-500/20'
                                        : Number(formData.pnl) < 0
                                            ? 'border-red-500/50 text-red-400 focus:ring-red-500/20'
                                            : 'border-gray-600 focus:border-blue-500'
                                        }`}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={formData.followedRules}
                                    onChange={(e) => handleChange('followedRules', e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-600 bg-[#1a1f2e] text-blue-500 focus:ring-offset-[#1a1f2e]"
                                />
                                <span className="text-sm text-gray-300">Followed Rules?</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4 border-l border-gray-700/50 pl-0 md:pl-6">
                        <h3 className="text-lg font-semibold text-gray-200">Psychology</h3>
                        {/* 
                 TODO: Replace with TagInput component later
                 For now just a simple read-only display or input, 
                 but since we have templates filling this, we rely on that mostly 
               */}
                        <div className="text-sm text-gray-400 italic">
                            Tags allow you to track setups and emotions. Use the quick templates above or type them in notes below for now.
                        </div>
                    </div>
                </div>

                {/* Notes & Screenshots */}
                <div className="card space-y-4">
                    <h3 className="text-lg font-semibold text-gray-200">Notes & Evidence</h3>

                    <textarea
                        value={formData.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        placeholder="Write your trade analysis here..."
                        className="w-full h-32 bg-[#1a1f2e] border border-[#334155] rounded-lg p-4 text-sm resize-none focus:border-blue-500 transition-colors"
                    />

                    <ScreenshotGallery
                        screenshots={formData.screenshots || []}
                        onRemove={handleRemoveScreenshot}
                    />

                    <ScreenshotDropzone onScreenshotsAdded={handleScreenshotsAdded} />
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    {successMessage && (
                        <span className="text-green-400 text-sm font-medium animate-fade-in">
                            {successMessage}
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={() => setFormData(INITIAL_STATE)}
                        className="btn btn-ghost"
                    >
                        <RefreshCw size={18} />
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary px-8 py-2.5 text-base shadow-lg shadow-blue-900/20"
                    >
                        <Save size={18} />
                        {isSubmitting ? 'Saving...' : 'Save Trade'}
                    </button>
                </div>

            </form>
        </div>
    );
}


