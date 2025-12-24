import { create } from 'zustand';
import type { Trade, FilterOptions } from '../types';
import { storageService } from '../services/storage';

interface TradeStore {
    trades: Trade[];
    filter: FilterOptions;
    setFilter: (filter: FilterOptions) => void;
    addTrade: (trade: Trade) => void;
    updateTrade: (id: string, trade: Trade) => void;
    deleteTrade: (id: string) => void;
    loadTrades: () => void;

    // Computed (helper)
    getFilteredTrades: () => Trade[];
}

export const useTradeStore = create<TradeStore>((set, get) => ({
    trades: [],
    filter: {
        dateRange: null,
        instruments: [],
        sessions: [],
        setups: [],
    },

    setFilter: (filter) => set({ filter }),

    addTrade: (trade) => {
        set((state) => {
            const newTrades = [trade, ...state.trades];
            storageService.saveTrades(newTrades);
            return { trades: newTrades };
        });
    },

    updateTrade: (id, updatedTrade) => {
        set((state) => {
            const newTrades = state.trades.map((t) => (t.id === id ? updatedTrade : t));
            storageService.saveTrades(newTrades);
            return { trades: newTrades };
        });
    },

    deleteTrade: (id) => {
        set((state) => {
            const newTrades = state.trades.filter((t) => t.id !== id);
            storageService.saveTrades(newTrades);
            return { trades: newTrades };
        });
    },

    loadTrades: () => {
        try {
            const trades = storageService.loadTrades();
            set({ trades });
        } catch (error) {
            console.error('Error loading trades:', error);
            throw error;
        }
    },

    getFilteredTrades: () => {
        const { trades } = get();
        // Basic implementation - we can expand this logic later
        return trades;
    }
}));
