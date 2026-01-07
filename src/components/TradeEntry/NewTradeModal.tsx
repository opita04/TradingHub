import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ContextTab } from './tabs/ContextTab';
import { LevelsTab } from './tabs/LevelsTab';
import { StrategyTab } from './tabs/StrategyTab';
import { DemonTab } from './tabs/DemonTab';
import { ReviewTab } from './tabs/ReviewTab';
import { useTradeStore } from '../../stores/tradeStore';
import { useAccountStore } from '../../stores/accountStore';
import { v4 as uuidv4 } from 'uuid';
import type { Trade, ChartAnalysis } from '../../types';
import { storageService } from '../../services/storage';

type TabId = 'context' | 'levels' | 'strategy' | 'demon' | 'review';

interface NewTradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface TradeFormData {
    accountId: string;
    instrument: string;
    timeZone: string;
    direction: 'long' | 'short';
    entryDate: string;
    entryTime: string;
    exitDate: string;
    exitTime: string;
    entryTimeframe: string;
    session: string;
    entryPrice: string;
    stopLoss: string;
    takeProfit: string;
    usePipsForSL: boolean;
    usePipsForTP: boolean;
    dollarRisk: string;
    lotSize: string;
    strategyId: string;
    setupQuality: number;
    confluences: string[];
    demons: string[];
    chartAnalysis: ChartAnalysis[];
    notes: string;
}

const INITIAL_FORM_DATA: TradeFormData = {
    accountId: '',
    instrument: 'NAS100',
    timeZone: 'America/New_York',
    direction: 'long',
    entryDate: new Date().toISOString().split('T')[0],
    entryTime: '12:00',
    exitDate: new Date().toISOString().split('T')[0],
    exitTime: '12:00',
    entryTimeframe: 'm3',
    session: 'asia',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    usePipsForSL: false,
    usePipsForTP: true,
    dollarRisk: '',
    lotSize: '',
    strategyId: '',
    setupQuality: 0,
    confluences: [],
    demons: [],
    chartAnalysis: [],
    notes: ''
};

const TABS: { id: TabId; label: string }[] = [
    { id: 'context', label: 'Context' },
    { id: 'levels', label: 'Levels' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'demon', label: 'Demon' },
    { id: 'review', label: 'Review' }
];

export const NewTradeModal: React.FC<NewTradeModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<TabId>('context');
    const [formData, setFormData] = useState<TradeFormData>(INITIAL_FORM_DATA);
    const addTrade = useTradeStore((state) => state.addTrade);
    const selectedAccountId = useAccountStore((state) => state.selectedAccountId);

    // Reset form when modal opens, load saved defaults
    useEffect(() => {
        if (isOpen) {
            const savedDefaults = storageService.loadFormDefaults();
            setFormData({
                ...INITIAL_FORM_DATA,
                // Apply saved defaults if available
                ...(savedDefaults && {
                    instrument: savedDefaults.instrument || INITIAL_FORM_DATA.instrument,
                    direction: savedDefaults.direction || INITIAL_FORM_DATA.direction,
                    entryTimeframe: savedDefaults.entryTimeframe || INITIAL_FORM_DATA.entryTimeframe,
                    session: savedDefaults.session || INITIAL_FORM_DATA.session,
                }),
                accountId: selectedAccountId || ''
            });
            setActiveTab('context');
        }
    }, [isOpen, selectedAccountId]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const updateFormData = (updates: Partial<TradeFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleBack = () => {
        const currentIndex = TABS.findIndex(t => t.id === activeTab);
        if (currentIndex > 0) {
            setActiveTab(TABS[currentIndex - 1].id);
        }
    };

    const handleNext = () => {
        const currentIndex = TABS.findIndex(t => t.id === activeTab);
        if (currentIndex < TABS.length - 1) {
            setActiveTab(TABS[currentIndex + 1].id);
        }
    };

    const handleSubmit = () => {
        // Calculate risk-reward from form data
        let riskReward: number | undefined;
        if (formData.entryPrice && formData.stopLoss && formData.takeProfit) {
            const entry = parseFloat(formData.entryPrice);
            const sl = parseFloat(formData.stopLoss);
            const tp = parseFloat(formData.takeProfit);
            const risk = Math.abs(entry - sl);
            const reward = Math.abs(tp - entry);
            if (risk > 0) {
                riskReward = parseFloat((reward / risk).toFixed(2));
            }
        }

        const newTrade: Trade = {
            id: uuidv4(),
            date: formData.entryDate,
            time: formData.entryTime,
            instrument: formData.instrument,
            direction: formData.direction,
            session: formData.session,
            pnl: 0, // Will be calculated when trade closes
            followedRules: true,
            screenshots: [],
            timeZone: formData.timeZone,
            entryTimeframe: formData.entryTimeframe,
            exitDate: formData.exitDate,
            exitTime: formData.exitTime,
            entryPrice: formData.entryPrice ? parseFloat(formData.entryPrice) : undefined,
            stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
            takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
            usePipsForSL: formData.usePipsForSL,
            usePipsForTP: formData.usePipsForTP,
            dollarRisk: formData.dollarRisk ? parseFloat(formData.dollarRisk) : undefined,
            lotSize: formData.lotSize ? parseFloat(formData.lotSize) : undefined,
            strategyId: formData.strategyId || undefined,
            setupQuality: formData.setupQuality,
            confluences: formData.confluences,
            demons: formData.demons,
            chartAnalysis: formData.chartAnalysis,
            notes: formData.notes || undefined,
            riskReward,
            accountId: formData.accountId || undefined,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        addTrade(newTrade);

        // Save form defaults for next time
        storageService.saveFormDefaults({
            instrument: formData.instrument,
            direction: formData.direction,
            entryTimeframe: formData.entryTimeframe,
            session: formData.session,
        });

        onClose();
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'context':
                return <ContextTab formData={formData} updateFormData={updateFormData} />;
            case 'levels':
                return <LevelsTab formData={formData} updateFormData={updateFormData} />;
            case 'strategy':
                return <StrategyTab formData={formData} updateFormData={updateFormData} />;
            case 'demon':
                return <DemonTab formData={formData} updateFormData={updateFormData} />;
            case 'review':
                return <ReviewTab formData={formData} updateFormData={updateFormData} />;
            default:
                return null;
        }
    };

    const isFirstTab = activeTab === 'context';
    const isLastTab = activeTab === 'review';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#15171B] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex items-center border-b border-white/10">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                ? 'text-primary bg-white/5'
                                : 'text-tertiary hover:text-secondary hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
                            )}
                        </button>
                    ))}
                    <button
                        onClick={onClose}
                        className="p-3 text-tertiary hover:text-primary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderTabContent()}
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between p-4 border-t border-white/10">
                    <button
                        onClick={handleBack}
                        disabled={isFirstTab}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isFirstTab
                            ? 'text-tertiary cursor-not-allowed'
                            : 'text-secondary hover:text-primary hover:bg-white/5'
                            }`}
                    >
                        ← Back
                    </button>

                    {isLastTab ? (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-profit hover:bg-profit/90 text-white rounded-lg transition-colors"
                        >
                            Complete Trade ✓
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
                        >
                            Next →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
