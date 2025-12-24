import { create } from 'zustand';
import { storageService } from '../services/storage';
import type { PropFirm } from '../types';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_FIRMS: PropFirm[] = [
    { id: uuidv4(), name: 'FTMO', rating: 5, scaling: '25% every 4 months', drawdownType: 'Balance', payout: 'Bi-weekly', status: 'preferred', link: '#', comments: 'One of the most reputable prop firms. Strict rules but reliable payouts.' },
    { id: uuidv4(), name: 'The Funded Trader', rating: 4, scaling: 'Double every 3 months', drawdownType: 'Equity', payout: 'Bi-weekly', status: 'verified', link: '#', comments: 'Good scaling program, competitive pricing on challenges.' },
    { id: uuidv4(), name: 'TopStep', rating: 5, scaling: 'Custom', drawdownType: 'Balance', payout: 'Weekly', status: 'verified', link: '#', comments: 'Great for futures traders. Weekly payouts are a big plus.' },
    { id: uuidv4(), name: 'MyForexFunds', rating: 2, scaling: 'Aggressive', drawdownType: 'Equity', payout: 'Paused', status: 'caution', link: '#', comments: 'Currently experiencing payout issues. Exercise caution.' },
];

interface PropFirmState {
    firms: PropFirm[];
    loadFirms: () => void;
    addFirm: (firm: Omit<PropFirm, 'id'>) => void;
    updateFirm: (id: string, updates: Partial<PropFirm>) => void;
    deleteFirm: (id: string) => void;
}

export const usePropFirmStore = create<PropFirmState>((set) => ({
    firms: (() => {
        const stored = storageService.loadPropFirms();
        return stored.length > 0 ? stored : DEFAULT_FIRMS;
    })(),

    loadFirms: () => {
        const stored = storageService.loadPropFirms();
        set({ firms: stored.length > 0 ? stored : DEFAULT_FIRMS });
    },

    addFirm: (firmData) => {
        set((state) => {
            const newFirm: PropFirm = {
                ...firmData,
                id: uuidv4(),
            };
            const updated = [...state.firms, newFirm];
            storageService.savePropFirms(updated);
            return { firms: updated };
        });
    },

    updateFirm: (id, updates) => {
        set((state) => {
            const updated = state.firms.map(f =>
                f.id === id ? { ...f, ...updates } : f
            );
            storageService.savePropFirms(updated);
            return { firms: updated };
        });
    },

    deleteFirm: (id) => {
        set((state) => {
            const updated = state.firms.filter(f => f.id !== id);
            storageService.savePropFirms(updated);
            return { firms: updated };
        });
    }
}));
