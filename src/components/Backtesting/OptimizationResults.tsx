import React, { useCallback, useMemo, useState } from 'react';
import { ArrowUpDown, BarChart3, ChevronDown, ChevronUp, RefreshCw, Search } from 'lucide-react';
import { SparkLine } from '../Common/SparkLine';

const CSV_PATH = '/optimization_results.csv'; // Served from public folder

type SortKey = 'strategy' | 'symbol' | 'timeframe' | 'netProfit' | 'maxDd' | 'sharpe' | 'winRate' | 'totalTrades';

interface OptimizationRow {
    strategy: string;
    symbol: string;
    timeframe: string;
    netProfit: number | null;
    maxDd: number | null;
    sharpe: number | null;
    winRate: number | null;
    totalTrades: number | null;
    equityCurve?: number[];
}

const parseNumber = (value?: string | null) => {
    if (value === undefined || value === null) return null;
    const trimmed = String(value).trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
};

const parseEquityCurve = (value?: string | null) => {
    if (!value) return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    if (trimmed.startsWith('[')) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                const numbers = parsed.map((item) => Number(item)).filter((item) => Number.isFinite(item));
                return numbers.length >= 2 ? numbers : undefined;
            }
        } catch {
            // Fall through to delimiter parsing
        }
    }

    const delimiter = trimmed.includes('|')
        ? '|'
        : trimmed.includes(';')
            ? ';'
            : trimmed.includes(',')
                ? ','
                : null;

    if (!delimiter) return undefined;

    const numbers = trimmed
        .split(delimiter)
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isFinite(item));

    return numbers.length >= 2 ? numbers : undefined;
};

const parseCsv = (text: string) => {
    const rows: string[][] = [];
    let current: string[] = [];
    let field = '';
    let inQuotes = false;

    const pushField = () => {
        current.push(field);
        field = '';
    };

    const pushRow = () => {
        if (current.length > 0) {
            rows.push(current);
        }
        current = [];
    };

    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        const next = text[i + 1];

        if (char === '"') {
            if (inQuotes && next === '"') {
                field += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === ',' && !inQuotes) {
            pushField();
            continue;
        }

        if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && next === '\n') {
                i += 1;
            }
            pushField();
            pushRow();
            continue;
        }

        field += char;
    }

    if (field.length > 0 || current.length > 0) {
        pushField();
        pushRow();
    }

    return rows;
};

const getValue = (row: Record<string, string>, keys: string[]) => {
    for (const key of keys) {
        if (key in row) return row[key];
    }
    return undefined;
};

export const OptimizationResults: React.FC = () => {
    const [rows, setRows] = useState<OptimizationRow[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('netProfit');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const loadCsv = useCallback(async () => {
        setStatus('loading');
        setError(null);
        try {
            const response = await fetch(CSV_PATH);
            if (!response.ok) {
                throw new Error(`Failed to load CSV (${response.status})`);
            }
            const text = await response.text();
            const parsedRows = parseCsv(text);
            if (parsedRows.length === 0) {
                setRows([]);
                setStatus('ready');
                return;
            }

            const header = parsedRows[0].map((value) => value.trim());
            const data = parsedRows.slice(1).flatMap((fields) => {
                const hasContent = fields.some((value) => value && value.trim());
                if (!hasContent) {
                    return [];
                }
                const record: Record<string, string> = {};
                header.forEach((key, index) => {
                    record[key] = fields[index] ?? '';
                });

                const equityValue = getValue(record, ['equity_curve', 'equityCurve', 'equity', 'equity_curve_data']);

                return [{
                    strategy: getValue(record, ['strategy', 'Strategy'])?.trim() || 'Unknown',
                    symbol: getValue(record, ['symbol', 'Symbol'])?.trim() || '—',
                    timeframe: getValue(record, ['timeframe', 'Timeframe'])?.trim() || '—',
                    netProfit: parseNumber(getValue(record, ['net_profit', 'netProfit', 'Net Profit'])),
                    maxDd: parseNumber(getValue(record, ['max_drawdown', 'max_dd', 'Max DD', 'Max Drawdown'])),
                    sharpe: parseNumber(getValue(record, ['sharpe_ratio', 'sharpe', 'Sharpe Ratio'])),
                    winRate: parseNumber(getValue(record, ['win_rate', 'winRate', 'Win Rate'])),
                    totalTrades: parseNumber(getValue(record, ['total_trades', 'totalTrades', 'Total Trades', 'trades'])),
                    equityCurve: parseEquityCurve(equityValue),
                } as OptimizationRow];
            });

            setRows(data.filter((row) => row.strategy));
            setStatus('ready');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load CSV');
            setStatus('error');
        }
    }, []);

    React.useEffect(() => {
        loadCsv();
    }, [loadCsv]);

    const hasEquityCurve = useMemo(() => rows.some((row) => row.equityCurve && row.equityCurve.length > 1), [rows]);

    const filteredRows = useMemo(() => {
        const query = filter.trim().toLowerCase();
        const filtered = query
            ? rows.filter((row) =>
                [row.strategy, row.symbol, row.timeframe].some((value) => value.toLowerCase().includes(query))
            )
            : rows;

        const sorted = [...filtered].sort((a, b) => {
            const direction = sortDirection === 'asc' ? 1 : -1;
            const valueA = a[sortKey as keyof OptimizationRow];
            const valueB = b[sortKey as keyof OptimizationRow];

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return valueA.localeCompare(valueB) * direction;
            }

            if (valueA === null || valueA === undefined) return 1;
            if (valueB === null || valueB === undefined) return -1;
            if (valueA === valueB) return 0;
            return (valueA > valueB ? 1 : -1) * direction;
        });

        return sorted;
    }, [rows, filter, sortKey, sortDirection]);

    const formatCurrency = (value: number | null) => {
        if (value === null) return '—';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    const formatNumber = (value: number | null, digits = 2) => {
        if (value === null) return '—';
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: digits }).format(value);
    };

    const formatPercent = (value: number | null) => {
        if (value === null) return '—';
        return `${formatNumber(value, 1)}%`;
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection(key === 'strategy' || key === 'symbol' || key === 'timeframe' ? 'asc' : 'desc');
        }
    };

    const SortIcon = ({ active }: { active: boolean }) => {
        if (!active) return <ArrowUpDown size={12} className="text-tertiary" />;
        return sortDirection === 'asc' ? (
            <ChevronUp size={12} className="text-brand" />
        ) : (
            <ChevronDown size={12} className="text-brand" />
        );
    };

    return (
        <div className="p-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <BarChart3 className="text-brand" size={30} />
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Optimization Results</h1>
                        <p className="text-xs text-tertiary font-mono">comprehensive_20260129_233805.csv</p>
                    </div>
                </div>
                <button
                    onClick={loadCsv}
                    disabled={status === 'loading'}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors border border-white/10 ${status === 'loading'
                        ? 'text-tertiary bg-white/5 cursor-not-allowed'
                        : 'text-secondary hover:text-primary hover:bg-white/5'
                        }`}
                >
                    <RefreshCw size={14} className={status === 'loading' ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="relative w-full max-w-xs">
                    <Search size={14} className="absolute left-3 top-2.5 text-tertiary" />
                    <input
                        value={filter}
                        onChange={(event) => setFilter(event.target.value)}
                        placeholder="Filter by strategy, symbol, timeframe..."
                        className="w-full bg-surface-highlight border border-white/5 rounded-lg pl-9 pr-3 py-2 text-xs text-primary focus:outline-none focus:border-brand/50 transition-all placeholder:text-tertiary"
                    />
                </div>
                <div className="flex items-center gap-3 text-xs text-tertiary">
                    <span>{filteredRows.length} rows</span>
                    <span className="h-3 w-px bg-white/10" />
                    <span className="font-mono">Source: {CSV_PATH.replace('file:///', '')}</span>
                </div>
            </div>

            <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-surface-highlight text-xs uppercase text-tertiary font-semibold border-b border-white/5">
                        <tr>
                            <th className="p-4 cursor-pointer" onClick={() => handleSort('strategy')}>
                                <div className="flex items-center gap-2">
                                    Strategy
                                    <SortIcon active={sortKey === 'strategy'} />
                                </div>
                            </th>
                            <th className="p-4 cursor-pointer" onClick={() => handleSort('symbol')}>
                                <div className="flex items-center gap-2">
                                    Symbol
                                    <SortIcon active={sortKey === 'symbol'} />
                                </div>
                            </th>
                            <th className="p-4 cursor-pointer" onClick={() => handleSort('timeframe')}>
                                <div className="flex items-center gap-2">
                                    Timeframe
                                    <SortIcon active={sortKey === 'timeframe'} />
                                </div>
                            </th>
                            {hasEquityCurve && <th className="p-4">Equity</th>}
                            <th className="p-4 text-right cursor-pointer" onClick={() => handleSort('netProfit')}>
                                <div className="flex items-center justify-end gap-2">
                                    Net Profit
                                    <SortIcon active={sortKey === 'netProfit'} />
                                </div>
                            </th>
                            <th className="p-4 text-right cursor-pointer" onClick={() => handleSort('maxDd')}>
                                <div className="flex items-center justify-end gap-2">
                                    Max DD
                                    <SortIcon active={sortKey === 'maxDd'} />
                                </div>
                            </th>
                            <th className="p-4 text-right cursor-pointer" onClick={() => handleSort('sharpe')}>
                                <div className="flex items-center justify-end gap-2">
                                    Sharpe Ratio
                                    <SortIcon active={sortKey === 'sharpe'} />
                                </div>
                            </th>
                            <th className="p-4 text-right cursor-pointer" onClick={() => handleSort('winRate')}>
                                <div className="flex items-center justify-end gap-2">
                                    Win Rate
                                    <SortIcon active={sortKey === 'winRate'} />
                                </div>
                            </th>
                            <th className="p-4 text-right cursor-pointer" onClick={() => handleSort('totalTrades')}>
                                <div className="flex items-center justify-end gap-2">
                                    Total Trades
                                    <SortIcon active={sortKey === 'totalTrades'} />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {status === 'loading' && (
                            <tr>
                                <td colSpan={hasEquityCurve ? 9 : 8} className="p-6 text-center text-tertiary">
                                    Loading optimization results...
                                </td>
                            </tr>
                        )}
                        {status === 'error' && (
                            <tr>
                                <td colSpan={hasEquityCurve ? 9 : 8} className="p-6 text-center text-loss">
                                    {error || 'Unable to load results.'}
                                </td>
                            </tr>
                        )}
                        {status === 'ready' && filteredRows.length === 0 && (
                            <tr>
                                <td colSpan={hasEquityCurve ? 9 : 8} className="p-6 text-center text-tertiary">
                                    No rows match your filter.
                                </td>
                            </tr>
                        )}
                        {status === 'ready' && filteredRows.map((row, index) => (
                            <tr key={`${row.strategy}-${row.symbol}-${row.timeframe}-${index}`} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-semibold text-primary">{row.strategy}</td>
                                <td className="p-4 text-secondary font-mono text-xs">{row.symbol}</td>
                                <td className="p-4 text-secondary font-mono text-xs">{row.timeframe}</td>
                                {hasEquityCurve && (
                                    <td className="p-4">
                                        {row.equityCurve ? (
                                            <SparkLine
                                                data={row.equityCurve}
                                                width={90}
                                                height={26}
                                                color={row.netProfit !== null && row.netProfit < 0 ? '#EF4444' : '#22C55E'}
                                            />
                                        ) : (
                                            <span className="text-xs text-tertiary">—</span>
                                        )}
                                    </td>
                                )}
                                <td className={`p-4 text-right font-mono ${row.netProfit !== null && row.netProfit < 0 ? 'text-loss' : 'text-profit'}`}>
                                    {formatCurrency(row.netProfit)}
                                </td>
                                <td className="p-4 text-right font-mono text-secondary">{formatCurrency(row.maxDd)}</td>
                                <td className="p-4 text-right font-mono text-secondary">{formatNumber(row.sharpe)}</td>
                                <td className="p-4 text-right font-mono text-secondary">{formatPercent(row.winRate)}</td>
                                <td className="p-4 text-right font-mono text-secondary">{formatNumber(row.totalTrades, 0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-xs text-tertiary">
                SparkLine equity curves are rendered only when an `equity_curve` column is present in the CSV.
            </div>
        </div>
    );
};
