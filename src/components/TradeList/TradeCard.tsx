import { useState } from 'react';
import { format } from 'date-fns';
import type { Trade } from '../../types';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { ScreenshotGallery } from '../Screenshots/ScreenshotGallery';
import { useTradeStore } from '../../stores/tradeStore';

interface TradeCardProps {
    trade: Trade;
    globalShowScreenshots: boolean;
}

export function TradeCard({ trade, globalShowScreenshots }: TradeCardProps) {
    const deleteTrade = useTradeStore((state) => state.deleteTrade);
    const [isExpanded, setIsExpanded] = useState(false);

    // Formatters
    const formattedDate = format(new Date(trade.date + 'T' + trade.time), 'MMM d, yyyy HH:mm');
    const isWin = trade.pnl > 0;

    return (
        <div className={`
      card border-l-4 transition-all hover:bg-[#2f3646]
      ${isWin ? 'border-l-green-500' : 'border-l-red-500'}
    `}>
            {/* Header Row (Always Visible) */}
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-6">
                    <div className="w-16 text-center">
                        <span className={`block font-bold text-lg ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.direction === 'long' ? 'LONG' : 'SHORT'}
                        </span>
                        <span className="text-xs text-gray-500">{trade.instrument}</span>
                    </div>

                    <div>
                        <div className="font-semibold text-gray-200">{formattedDate}</div>
                        <div className="text-sm text-gray-500">{trade.session}</div>
                    </div>

                    <div className="hidden md:block">
                        <div className="text-sm text-gray-400">Position</div>
                        <div className="text-gray-300">{trade.positionSize || '-'}</div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className={`text-xl font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                        </div>
                        {trade.followedRules && (
                            <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">
                                Rules Followed
                            </span>
                        )}
                    </div>

                    <button className="text-gray-500 hover:text-gray-300 transition-colors">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {(isExpanded || globalShowScreenshots) && (
                <div className="mt-4 pt-4 border-t border-gray-700/50 animate-fade-in space-y-4">

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 block mb-1">Entry Price</span>
                            <span className="text-gray-200">{trade.entryPrice || '-'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">Exit Price</span>
                            <span className="text-gray-200">{trade.exitPrice || '-'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">Setups</span>
                            <div className="flex flex-wrap gap-1">
                                {(trade.setup || []).map((s, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">{s}</span>
                                ))}
                                {(!trade.setup || trade.setup.length === 0) && <span className="text-gray-600">-</span>}
                            </div>
                        </div>
                        <div>
                            <span className="text-gray-500 block mb-1">Emotions</span>
                            <div className="flex flex-wrap gap-1">
                                {(trade.emotion || []).map((e, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">{e}</span>
                                ))}
                                {(!trade.emotion || trade.emotion.length === 0) && <span className="text-gray-600">-</span>}
                            </div>
                        </div>
                    </div>

                    {trade.notes && (
                        <div className="bg-[#1a1f2e] p-3 rounded-lg border border-[#334155]">
                            <span className="text-xs font-medium text-gray-500 block mb-1">Notes</span>
                            <p className="text-sm text-gray-300 whitespace-pre-wrap">{trade.notes}</p>
                        </div>
                    )}

                    {trade.screenshots && trade.screenshots.length > 0 && (
                        <div>
                            <ScreenshotGallery
                                screenshots={trade.screenshots}
                                onRemove={() => { }} // Read only in list view ideally, or handle elsewhere
                                allowDelete={false}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => deleteTrade(trade.id)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                        {/* Edit button could go here */}
                    </div>
                </div>
            )}
        </div>
    );
}
