/**
 * Analytics Service Test Suite
 * 
 * Run with: npm test
 */

import { describe, it, expect } from 'vitest';
import { analyticsService } from '../services/analytics.ts';
import type { Trade } from '../types/index.ts';

function createMockTrade(overrides: Partial<Trade> = {}): Trade {
    return {
        id: Math.random().toString(36).slice(2),
        tradeType: 'LIVE',
        date: '2023-12-01',
        time: '09:30',
        instrument: 'NQ',
        direction: 'long',
        session: 'NY AM',
        pnl: 0,
        followedRules: true,
        screenshots: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...overrides
    };
}

describe('Analytics Service', () => {

    describe('calculateStats', () => {
        it('AS-001: should return zero stats for empty array', () => {
            const result = analyticsService.calculateStats([]);
            expect(result.totalTrades).toBe(0);
            expect(result.winRate).toBe(0);
            expect(result.totalPnL).toBe(0);
        });

        it('AS-002: should count total trades correctly', () => {
            const trades = [
                createMockTrade({ pnl: 100, createdAt: 1000 }),
                createMockTrade({ pnl: 200, createdAt: 2000 }),
                createMockTrade({ pnl: -150, createdAt: 3000 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.totalTrades).toBe(3);
        });

        it('AS-003: should calculate win rate (66.67%)', () => {
            const trades = [
                createMockTrade({ pnl: 100 }),
                createMockTrade({ pnl: 200 }),
                createMockTrade({ pnl: -150 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.winRate).toBeCloseTo(66.67, 1);
        });

        it('AS-004: should calculate profit factor', () => {
            const trades = [
                createMockTrade({ pnl: 100 }),
                createMockTrade({ pnl: 200 }),
                createMockTrade({ pnl: -150 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.profitFactor).toBe(2);
        });

        it('AS-005: should handle profit factor with no losses', () => {
            const trades = [
                createMockTrade({ pnl: 100 }),
                createMockTrade({ pnl: 200 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.profitFactor).toBe(300);
        });

        it('AS-006: should calculate current win streak', () => {
            const trades = [
                createMockTrade({ pnl: 100, createdAt: 1000 }),
                createMockTrade({ pnl: 100, createdAt: 2000 }),
                createMockTrade({ pnl: 100, createdAt: 3000 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.currentStreak).toBe(3);
        });

        it('AS-007: should calculate current losing streak', () => {
            const trades = [
                createMockTrade({ pnl: 100, createdAt: 1000 }),
                createMockTrade({ pnl: 100, createdAt: 2000 }),
                createMockTrade({ pnl: -50, createdAt: 3000 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.currentStreak).toBe(-1);
        });

        it('AS-008: should find longest win streak', () => {
            const trades = [
                createMockTrade({ pnl: 100, createdAt: 1000 }),
                createMockTrade({ pnl: 100, createdAt: 2000 }),
                createMockTrade({ pnl: -50, createdAt: 3000 }),
                createMockTrade({ pnl: 100, createdAt: 9999 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.longestWinStreak).toBe(2);
        });

        it('AS-009: should find longest lose streak', () => {
            const trades = [
                createMockTrade({ pnl: -50 }),
                createMockTrade({ pnl: -50 }),
                createMockTrade({ pnl: 100 }),
                createMockTrade({ pnl: -50 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.longestLoseStreak).toBe(2);
        });

        it('AS-010: should calculate average win', () => {
            const trades = [
                createMockTrade({ pnl: 100 }),
                createMockTrade({ pnl: 200 }),
                createMockTrade({ pnl: 300 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.avgWin).toBe(200);
        });

        it('AS-011: should calculate average loss', () => {
            const trades = [
                createMockTrade({ pnl: -50 }),
                createMockTrade({ pnl: -100 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.avgLoss).toBe(75);
        });

        it('AS-012: should find best trade', () => {
            const trades = [
                createMockTrade({ pnl: 100 }),
                createMockTrade({ pnl: 500 }),
                createMockTrade({ pnl: 200 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.bestTrade).toBe(500);
        });

        it('AS-013: should find worst trade', () => {
            const trades = [
                createMockTrade({ pnl: 100 }),
                createMockTrade({ pnl: -300 }),
                createMockTrade({ pnl: -100 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.worstTrade).toBe(-300);
        });

        it('AS-014: should calculate total PnL', () => {
            const trades = [
                createMockTrade({ pnl: 100 }),
                createMockTrade({ pnl: 200 }),
                createMockTrade({ pnl: -150 })
            ];
            const result = analyticsService.calculateStats(trades);
            expect(result.totalPnL).toBe(150);
        });
    });

    describe('getEquityCurve', () => {
        it('AS-015: should return cumulative equity values', () => {
            const trades = [
                createMockTrade({ pnl: 100, date: '2023-12-01', createdAt: 1000 }),
                createMockTrade({ pnl: 50, date: '2023-12-02', createdAt: 2000 }),
                createMockTrade({ pnl: -30, date: '2023-12-03', createdAt: 3000 })
            ];
            const result = analyticsService.getEquityCurve(trades);
            expect(result.length).toBe(3);
            expect(result[0].value).toBe(100);
            expect(result[1].value).toBe(150);
            expect(result[2].value).toBe(120);
        });
    });

    describe('getPerformanceByInstrument', () => {
        it('AS-016: should group performance by instrument', () => {
            const trades = [
                createMockTrade({ pnl: 100, instrument: 'NQ' }),
                createMockTrade({ pnl: 200, instrument: 'ES' }),
                createMockTrade({ pnl: -150, instrument: 'NQ' })
            ];
            const result = analyticsService.getPerformanceByInstrument(trades);

            const nq = result.find(r => r.name === 'NQ');
            const es = result.find(r => r.name === 'ES');

            expect(result.length).toBeGreaterThanOrEqual(2);
            expect(nq?.value).toBe(-50);
            expect(es?.value).toBe(200);
        });
    });

    describe('getPerformanceBySession', () => {
        it('should group performance by session', () => {
            const trades = [
                createMockTrade({ pnl: 100, session: 'NY AM' }),
                createMockTrade({ pnl: 200, session: 'NY PM' }),
                createMockTrade({ pnl: -50, session: 'NY AM' })
            ];
            const result = analyticsService.getPerformanceBySession(trades);

            const nyAm = result.find(r => r.name === 'NY AM');
            const nyPm = result.find(r => r.name === 'NY PM');

            expect(nyAm?.value).toBe(50);
            expect(nyPm?.value).toBe(200);
        });
    });
});
