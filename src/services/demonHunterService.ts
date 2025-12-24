import type { Trade, BehavioralDemon } from '../types';

export const demonHunterService = {
    analyzeDemons: (trades: Trade[]): BehavioralDemon[] => {
        // Mock analysis logic based on trade data
        // In real app, this would be complex pattern matching

        const totalTrades = trades.length;
        if (totalTrades === 0) return [];

        const sortedTrades = [...trades].sort((a, b) => a.createdAt - b.createdAt);
        const losses = trades.filter(t => t.pnl < 0);
        const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length) : 0;

        // 1. Oversizing: Losses > 2x Avg Loss
        const oversizingTrades = losses.filter(t => Math.abs(t.pnl) > avgLoss * 2);
        const oversizingImpact = oversizingTrades.reduce((sum, t) => sum + t.pnl, 0);

        // 2. Revenge Trading: Loss followed by another trade within 30 mins
        let revengeCount = 0;
        let revengeImpact = 0;
        for (let i = 0; i < sortedTrades.length - 1; i++) {
            if (sortedTrades[i].pnl < 0) {
                const current = sortedTrades[i];
                const next = sortedTrades[i + 1];
                const timeDiff = next.createdAt - current.createdAt;
                // 30 mins = 30 * 60 * 1000
                if (timeDiff < 30 * 60 * 1000) {
                    revengeCount++;
                    revengeImpact += next.pnl; // The result of the revenge trade
                }
            }
        }

        return [
            {
                id: 'oversizing',
                name: 'Oversizing',
                description: 'Position size exceeds risk tolerance (>2x Avg Loss)',
                severity: oversizingTrades.length > 3 ? 'critical' : 'medium',
                frequency: (oversizingTrades.length / totalTrades) * 100,
                impact: oversizingImpact,
                detectedCount: oversizingTrades.length,
                timeline: []
            },
            {
                id: 'revenge',
                name: 'Revenge Trading',
                description: 'Entering trades within 30m of a loss',
                severity: revengeCount > 3 ? 'critical' : 'high',
                frequency: (revengeCount / totalTrades) * 100,
                impact: revengeImpact,
                detectedCount: revengeCount,
                timeline: []
            },
            {
                id: 'hesitation',
                name: 'Hesitation',
                description: 'Late entries resulting in poor R:R',
                severity: 'medium',
                frequency: 10.6,
                impact: -1800,
                detectedCount: 5, // Placeholder
                timeline: []
            },
            {
                id: 'fomo',
                name: 'FOMO',
                description: 'Chasing moves outside of setup criteria',
                severity: 'critical',
                frequency: 19.7,
                impact: -8500,
                detectedCount: 12, // Placeholder
                timeline: []
            }
        ];
    },
    calculatePsychLevel: (demons: BehavioralDemon[]): 'OPTIMAL' | 'CAUTION' | 'UNSTABLE' | 'CRITICAL' => {
        const criticalCount = demons.filter(d => d.severity === 'critical').length;
        const highCount = demons.filter(d => d.severity === 'high').length;
        const mediumCount = demons.filter(d => d.severity === 'medium').length;

        if (criticalCount >= 2) return 'CRITICAL';
        if (criticalCount >= 1 || highCount >= 2) return 'UNSTABLE';
        if (highCount >= 1 || mediumCount >= 2) return 'CAUTION';
        return 'OPTIMAL';
    }
};
