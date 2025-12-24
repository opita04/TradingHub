import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { Trade } from '../../types';
import { SparkLine } from '../Common/SparkLine';

interface TradeTableProps {
    trades: Trade[];
    onRowClick?: (trade: Trade) => void;
}

export const TradeTable: React.FC<TradeTableProps> = ({ trades, onRowClick }) => {
    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    // Helper to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 text-xs font-bold text-tertiary uppercase tracking-wider">
                        <th className="py-4 px-4 font-medium">Date</th>
                        <th className="py-4 px-4 font-medium">Instrument</th>
                        <th className="py-4 px-4 font-medium">Direction</th>
                        <th className="py-4 px-4 font-medium">Setup</th>
                        <th className="py-4 px-4 font-medium text-right">Price</th>
                        <th className="py-4 px-4 font-medium text-right">P&L</th>
                        <th className="py-4 px-4 font-medium text-center">Outcome</th>
                        <th className="py-4 px-4 font-medium"></th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {trades.map((trade) => (
                        <tr
                            key={trade.id}
                            onClick={() => onRowClick?.(trade)}
                            className="group border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <td className="py-3 px-4 text-secondary font-mono text-xs">
                                {formatDate(trade.date)}
                            </td>
                            <td className="py-3 px-4">
                                <span className="font-bold text-primary">{trade.instrument}</span>
                            </td>
                            <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${trade.direction === 'long'
                                    ? 'bg-profit/10 text-profit border border-profit/20'
                                    : 'bg-loss/10 text-loss border border-loss/20'
                                    }`}>
                                    {trade.direction}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex gap-1 flex-wrap">
                                    {trade.setup?.map(s => (
                                        <span key={s} className="text-[10px] text-tertiary border border-white/10 px-1.5 rounded">{s}</span>
                                    ))}
                                </div>
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-secondary">
                                {trade.entryPrice}
                            </td>
                            <td className={`py-3 px-4 text-right font-mono font-bold ${trade.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                                {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                            </td>
                            <td className="py-3 px-4 w-24 opacity-50 group-hover:opacity-100 transition-opacity">
                                <SparkLine
                                    data={trade.pnl > 0 ? [10, 12, 15, 14, 20, 18, 25] : [25, 22, 18, 20, 15, 10, 5]}
                                    width={60}
                                    height={20}
                                    color={trade.pnl >= 0 ? '#22C55E' : '#EF4444'}
                                />
                            </td>
                            <td className="py-3 px-4 text-right">
                                <button className="p-1 hover:bg-white/10 rounded text-tertiary hover:text-primary transition-colors">
                                    <MoreHorizontal size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
