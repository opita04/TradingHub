import React from 'react';
import { ChevronDown, Calendar, Wallet } from 'lucide-react';
import type { TradeFormData } from '../NewTradeModal';
import { useAccountStore } from '../../../stores/accountStore';

interface ContextTabProps {
    formData: TradeFormData;
    updateFormData: (updates: Partial<TradeFormData>) => void;
}

// Equity Index Futures (E-mini & Micro)
const EQUITY_FUTURES = ['ES', 'MES', 'NQ', 'MNQ', 'YM', 'MYM', 'RTY', 'M2K'];
// Energy Futures
const ENERGY_FUTURES = ['CL', 'MCL', 'NG', 'MNG'];
// Metals Futures
const METALS_FUTURES = ['GC', 'MGC', 'SI', 'SIL', 'HG', 'PA', 'PL'];
// Treasury Futures
const TREASURY_FUTURES = ['ZB', 'ZN', 'ZF', 'ZT', 'ZC'];
// Currency Futures
const CURRENCY_FUTURES = ['6E', 'M6E', '6B', 'M6B', '6J', '6A', '6C', '6S'];
// Forex Pairs
const FOREX = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'XAUUSD', 'XAGUSD'];
// Crypto
const CRYPTO = ['BTC', 'MBT', 'ETH', 'BTCUSD', 'ETHUSD'];

const INSTRUMENTS = [
    ...EQUITY_FUTURES,
    ...ENERGY_FUTURES,
    ...METALS_FUTURES,
    ...TREASURY_FUTURES,
    ...CURRENCY_FUTURES,
    ...FOREX,
    ...CRYPTO
];
const TIMEFRAMES = ['m1', 'm3', 'm5', 'm15', 'm30', 'h1', 'h4', 'd1'];

const SESSIONS = [
    { id: 'asia', name: 'Asia', subtitle: 'Tokyo, Hong Kong, Singapore Markets', image: '/asia-session.jpg' },
    { id: 'london', name: 'London', subtitle: 'European Markets', image: '/london-session.jpg' },
    { id: 'ny', name: 'New York', subtitle: 'US Markets', image: '/ny-session.jpg' }
];

export const ContextTab: React.FC<ContextTabProps> = ({ formData, updateFormData }) => {
    const { accounts } = useAccountStore();

    return (
        <div className="space-y-6">
            {/* Account Selector */}
            <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                    <span className="flex items-center gap-2">
                        <Wallet size={14} className="text-brand" />
                        Account
                    </span>
                </label>
                <div className="relative">
                    <select
                        value={formData.accountId}
                        onChange={(e) => updateFormData({ accountId: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-primary appearance-none cursor-pointer hover:bg-surface-highlight transition-colors"
                    >
                        <option value="">-- Select Account --</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.name} ({account.currency})
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none" />
                </div>
                {!formData.accountId && accounts.length > 0 && (
                    <p className="mt-1 text-xs text-amber-400">Select an account to link this trade</p>
                )}
                {accounts.length === 0 && (
                    <p className="mt-1 text-xs text-tertiary">No accounts found. Create one in the sidebar.</p>
                )}
            </div>

            {/* Instrument & Entry Timeframe */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Instrument</label>
                    <div className="relative">
                        <select
                            value={formData.instrument}
                            onChange={(e) => updateFormData({ instrument: e.target.value })}
                            className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-primary appearance-none cursor-pointer hover:bg-surface-highlight transition-colors"
                        >
                            {INSTRUMENTS.map((inst) => (
                                <option key={inst} value={inst}>{inst}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none" />
                    </div>
                    <p className="mt-1 text-xs text-tertiary">Selected: {formData.instrument}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Entry Timeframe</label>
                    <div className="relative">
                        <select
                            value={formData.entryTimeframe}
                            onChange={(e) => updateFormData({ entryTimeframe: e.target.value })}
                            className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-primary appearance-none cursor-pointer hover:bg-surface-highlight transition-colors"
                        >
                            {TIMEFRAMES.map((tf) => (
                                <option key={tf} value={tf}>{tf}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Direction Toggle - Border Style with Background */}
            <div>
                <label className="block text-sm font-medium text-secondary mb-2">Direction</label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => updateFormData({ direction: 'long' })}
                        className={`py-3.5 rounded-lg text-sm font-semibold transition-all duration-200 ${formData.direction === 'long'
                            ? 'bg-profit/20 border-2 border-profit text-profit shadow-glow-profit'
                            : 'bg-surface border border-white/10 text-secondary hover:border-white/20 hover:text-primary'
                            }`}
                    >
                        Long
                    </button>
                    <button
                        onClick={() => updateFormData({ direction: 'short' })}
                        className={`py-3.5 rounded-lg text-sm font-semibold transition-all duration-200 ${formData.direction === 'short'
                            ? 'bg-loss/20 border-2 border-loss text-loss shadow-glow-loss'
                            : 'bg-surface border border-white/10 text-secondary hover:border-white/20 hover:text-primary'
                            }`}
                    >
                        Short
                    </button>
                </div>
            </div>

            {/* Entry & Exit Date/Time */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Entry Date & Time</label>
                    <div className="relative">
                        <input
                            type="datetime-local"
                            value={`${formData.entryDate}T${formData.entryTime}`}
                            onChange={(e) => {
                                const [date, time] = e.target.value.split('T');
                                updateFormData({ entryDate: date, entryTime: time });
                            }}
                            className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 pr-10 text-primary [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                        <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Exit Date & Time</label>
                    <div className="relative">
                        <input
                            type="datetime-local"
                            value={`${formData.exitDate}T${formData.exitTime}`}
                            onChange={(e) => {
                                const [date, time] = e.target.value.split('T');
                                updateFormData({ exitDate: date, exitTime: time });
                            }}
                            className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 pr-10 text-primary [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                        <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Market Session Selector */}
            <div>
                <label className="block text-sm font-medium text-secondary mb-2">Market Session</label>
                <div className="grid grid-cols-3 gap-3">
                    {SESSIONS.map((session) => (
                        <button
                            key={session.id}
                            onClick={() => updateFormData({ session: session.id })}
                            className={`relative overflow-hidden rounded-lg h-32 transition-all ${formData.session === session.id
                                ? 'ring-2 ring-brand'
                                : 'ring-1 ring-white/10 hover:ring-white/20'
                                }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute inset-0 bg-surface-highlight" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h4 className={`text-sm font-bold ${formData.session === session.id ? 'text-brand' : 'text-primary'}`}>
                                    {session.name}
                                </h4>
                                <p className="text-[10px] text-tertiary mt-0.5">{session.subtitle}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
