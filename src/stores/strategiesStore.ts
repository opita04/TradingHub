import { create } from 'zustand';
import { storageService } from '../services/storage';
import type { Strategy } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useBacktestStore } from './backtestStore';

interface StrategiesState {
    strategies: Strategy[];

    // Actions
    loadStrategies: () => void;
    addStrategy: (name: string, type: Strategy['type']) => void;
    moveStrategy: (id: string, newStatus: Strategy['status']) => void;
    updateStrategy: (id: string, updates: Partial<Strategy>) => void;
    deleteStrategy: (id: string) => void;
}

export const useStrategiesStore = create<StrategiesState>((set) => ({
    strategies: storageService.loadStrategies() || [],

    loadStrategies: () => {
        set({ strategies: storageService.loadStrategies() || [] });
    },

    addStrategy: (name, type) => {
        set((state) => {
            const newStrategy: Strategy = {
                id: uuidv4(),
                name,
                type,
                status: 'hypothesis',
                progress: 0,
                winRate: 0,
                profitFactor: 0,
                returnPercent: 0,
                maxDrawdown: 0,
                totalTrades: 0,
                equityCurve: []
            };
            const updated = [...state.strategies, newStrategy];
            storageService.saveStrategies(updated);
            return { strategies: updated };
        });
    },

    moveStrategy: (id, newStatus) => {
        const { currentSession } = useBacktestStore.getState();
        if (currentSession?.status === 'ACTIVE' && currentSession.strategyId === id) {
            console.warn('Cannot move strategy during active backtest session');
            return;
        }
        set((state) => {
            const updated = state.strategies.map(s =>
                s.id === id ? { ...s, status: newStatus } : s
            );
            storageService.saveStrategies(updated);
            return { strategies: updated };
        });
    },

    updateStrategy: (id, updates) => {
        const { currentSession } = useBacktestStore.getState();
        if (currentSession?.status === 'ACTIVE' && currentSession.strategyId === id) {
            console.warn('Cannot update strategy during active backtest session');
            return;
        }
        set((state) => {
            const updated = state.strategies.map(s =>
                s.id === id ? { ...s, ...updates } : s
            );
            storageService.saveStrategies(updated);
            return { strategies: updated };
        });
    },

    deleteStrategy: (id) => {
        const { currentSession } = useBacktestStore.getState();
        if (currentSession?.status === 'ACTIVE' && currentSession.strategyId === id) {
            console.warn('Cannot delete strategy during active backtest session');
            return;
        }
        set((state) => {
            const updated = state.strategies.filter(s => s.id !== id);
            storageService.saveStrategies(updated);
            return { strategies: updated };
        });
    }
}));
