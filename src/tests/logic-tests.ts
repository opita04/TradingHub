
import { analyticsService } from '../services/analytics.ts';

const mockTrades = [
    {
        id: '1',
        date: '2023-12-01',
        pnl: 100,
        instrument: 'NQ',
        createdAt: 1000,
        session: 'NY AM'
    },
    {
        id: '2',
        date: '2023-12-02',
        pnl: 200,
        instrument: 'ES',
        createdAt: 2000,
        session: 'NY PM'
    },
    {
        id: '3',
        date: '2023-12-03',
        pnl: -150,
        instrument: 'NQ',
        createdAt: 3000,
        session: 'NY AM'
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
] as any[];

function runTests() {
    console.log('Running Analytics Service Tests...');

    // Test calculateStats
    const stats = analyticsService.calculateStats(mockTrades);
    console.log('Stats:', JSON.stringify(stats, null, 2));

    if (stats.totalTrades !== 3) throw new Error('Total trades should be 3');
    if (stats.winRate !== (2 / 3) * 100) throw new Error('Win rate should be 66.6%');
    if (stats.totalPnL !== 150) throw new Error('Total PnL should be 150');
    if (stats.profitFactor !== 300 / 150) throw new Error('Profit factor should be 2');
    if (stats.currentStreak !== -1) throw new Error('Current streak should be -1');
    if (stats.longestWinStreak !== 2) throw new Error('Longest win streak should be 2');

    // Test getPerformanceByInstrument
    const instrPerf = analyticsService.getPerformanceByInstrument(mockTrades);
    console.log('Instrument Perf:', JSON.stringify(instrPerf, null, 2));
    const nqValue = instrPerf.find(i => i.name === 'NQ')?.value;
    if (nqValue !== -50) throw new Error(`NQ PnL should be -50, got ${nqValue}`);

    console.log('✅ All Logic Tests Passed!');
}

try {
    runTests();
} catch (e) {
    console.error('❌ Test Failed:', (e as Error).message);
    throw e;
}
