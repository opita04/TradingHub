import React from 'react';
import { XCircle, Clock, FileText, Target, TrendingUp, PlayCircle } from 'lucide-react';
import type { TradeFormData } from '../NewTradeModal';

interface DemonTabProps {
    formData: TradeFormData;
    updateFormData: (updates: Partial<TradeFormData>) => void;
}

export const DEMONS = [
    { id: 'entered-too-soon', name: 'Entered too soon', description: 'Entered position before proper setup', icon: Clock },
    { id: 'entered-too-late', name: 'Entered too late', description: 'Missed optimal entry point', icon: Clock },
    { id: 'exited-too-soon', name: 'Exited too soon', description: 'Closed position prematurely', icon: XCircle },
    { id: 'exited-too-late', name: 'Exited too late', description: 'Held position too long', icon: Clock },
    { id: 'not-in-plan', name: 'Not in trading plan', description: "Trade didn't follow planned strategy", icon: FileText },
    { id: 'incorrect-stop', name: 'Incorrect stop placement', description: 'Stop loss positioned incorrectly', icon: Target },
    { id: 'wrong-size', name: 'Wrong size trade', description: 'Incorrect position sizing', icon: TrendingUp },
    { id: 'missed-trade', name: "Didn't take planned trade", description: 'Missed a planned trading opportunity', icon: PlayCircle }
];

export const DemonTab: React.FC<DemonTabProps> = ({ formData, updateFormData }) => {
    const toggleDemon = (id: string) => {
        const current = formData.demons || [];
        const updated = current.includes(id)
            ? current.filter(d => d !== id)
            : [...current, id];
        updateFormData({ demons: updated });
    };

    const selectedDemons = formData.demons || [];

    return (
        <div className="space-y-4">
            {/* Demon List */}
            <div className="space-y-3">
                {DEMONS.map((demon) => {
                    const isSelected = selectedDemons.includes(demon.id);
                    const Icon = demon.icon;

                    return (
                        <button
                            key={demon.id}
                            onClick={() => toggleDemon(demon.id)}
                            className={`
                                w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-200
                                ${isSelected
                                    ? 'bg-[#2a1215] border-2 border-[#8b2635] shadow-[0_0_20px_rgba(139,38,53,0.3)]'
                                    : 'bg-[#1a1a1c] border border-transparent hover:bg-[#222224]'
                                }
                            `}
                        >
                            {/* Radio Button */}
                            <div className={`
                                flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                                transition-all duration-200
                                ${isSelected
                                    ? 'border-[#d64550] bg-transparent'
                                    : 'border-white/20 bg-transparent'
                                }
                            `}>
                                {isSelected && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#d64550]" />
                                )}
                            </div>

                            {/* Icon */}
                            <Icon
                                size={18}
                                className={`flex-shrink-0 ${isSelected ? 'text-[#d64550]' : 'text-white/50'}`}
                            />

                            {/* Text Content */}
                            <div className="flex-1 flex items-baseline gap-2">
                                <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-white/90'}`}>
                                    {demon.name}:
                                </span>
                                <span className="text-sm text-white/40">
                                    {demon.description}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Selected Demons Summary */}
            {selectedDemons.length > 0 && (
                <div className="bg-[#1a1a1c] rounded-xl p-4 mt-6 border border-white/5">
                    <h4 className="text-sm font-medium text-white/60 mb-3">
                        Selected Demons ({selectedDemons.length}):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedDemons.map((id) => {
                            const demon = DEMONS.find(d => d.id === id);
                            return (
                                <span
                                    key={id}
                                    className="px-3 py-1.5 bg-[#2a1215] rounded-lg text-xs text-[#d64550] border border-[#8b2635]/50"
                                >
                                    {demon?.name}:
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
