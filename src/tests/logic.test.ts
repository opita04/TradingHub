import { describe, it, expect } from 'vitest';
import { analyticsService } from '../services/analytics';
import { demonHunterService } from '../services/demonHunterService';
import type { Trade } from '../types';

describe('Analytics & Demon Hunter Logic', () => {
    // Helper to create mock trades
    const createTrade = (pnl: number, dateStr: string, timeStr: string, risk?: number): Trade => ({
        id: Math.random().toString(),
        date: dateStr,
        time: timeStr,
        instrument: 'NQ',
        direction: 'long',
        session: 'NY AM',
        pnl,
        riskReward: risk ? pnl / risk : undefined,
        createdAt: new Date(`${dateStr}T${timeStr}`).getTime(),
        updatedAt: Date.now(),
        followedRules: true,
        screenshots: [],
        demons: []
    });

    it('calculates Max Drawdown correctly', () => {
        const trades = [
            createTrade(100, '2024-01-01', '10:00'), // Peak 100
            createTrade(-50, '2024-01-02', '10:00'), // 50 (DD 50)
            createTrade(-30, '2024-01-03', '10:00'), // 20 (DD 80)
            createTrade(200, '2024-01-04', '10:00'), // 220 (New Peak)
            createTrade(-10, '2024-01-05', '10:00'), // 210 (DD 10)
        ];
        const stats = analyticsService.calculateStats(trades);
        expect(stats.maxDrawdown).toBe(80);
    });

    it('detects Oversizing (Loss > 2x Avg)', () => {
        const trades = [
            createTrade(-50, '2024-01-01', '10:00'),
            createTrade(-50, '2024-01-02', '10:00'),
            // Avg Loss = (50+50+250)/3 = 116.6. Limit 233.
            createTrade(-250, '2024-01-03', '10:00'), // Oversizing (250 > 233)
        ];
        const demons = demonHunterService.analyzeDemons(trades);
        const oversizing = demons.find(d => d.id === 'oversizing');
        expect(oversizing?.detectedCount).toBe(1);
    });

    it('detects Revenge Trading (<30m intervals)', () => {
        const trades = [
            createTrade(-100, '2024-01-01', '10:00:00'),
            createTrade(-100, '2024-01-01', '10:15:00'), // Revenge (< 30m)
            createTrade(-100, '2024-01-01', '11:00:00'), // Safe (> 30m from prev)
        ];
        const demons = demonHunterService.analyzeDemons(trades);
        const revenge = demons.find(d => d.id === 'revenge');
        expect(revenge?.detectedCount).toBe(1);
    });

    it('calculates Psych Level', () => {
        const criticalDemons: any = [{ severity: 'critical' }, { severity: 'critical' }];
        expect(demonHunterService.calculatePsychLevel(criticalDemons)).toBe('CRITICAL');

        const safeDemons: any = [];
        expect(demonHunterService.calculatePsychLevel(safeDemons)).toBe('OPTIMAL');
    });
});
