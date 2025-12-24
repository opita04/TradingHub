interface DirectionToggleProps {
    value: 'buy' | 'sell';
    onChange: (value: 'buy' | 'sell') => void;
}

export function DirectionToggle({ value, onChange }: DirectionToggleProps) {
    return (
        <div className="flex bg-[#1a1f2e] p-1 rounded-lg border border-[#334155] w-full">
            <button
                type="button"
                onClick={() => onChange('buy')}
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${value === 'buy'
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
            >
                BUY (Long)
            </button>
            <button
                type="button"
                onClick={() => onChange('sell')}
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${value === 'sell'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-900/20'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
            >
                SELL (Short)
            </button>
        </div>
    );
}
