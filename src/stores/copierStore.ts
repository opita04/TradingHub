import { create } from 'zustand';
import { storageService } from '../services/storage';
import type { CopierGroup, TradingAccount } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface CopierState {
    groups: CopierGroup[];
    accounts: TradingAccount[]; // Dictionary or list of all known accounts

    // Actions
    addGroup: (name: string, masterId: string) => void;
    updateGroup: (id: string, updates: Partial<CopierGroup>) => void;
    deleteGroup: (id: string) => void;
    toggleGroupActive: (id: string) => void;

    // Account management
    addAccount: (account: TradingAccount) => void;
}

export const useCopierStore = create<CopierState>((set) => ({
    groups: storageService.loadCopierGroups() || [],
    accounts: [], // In real app, load from storageService or API

    addGroup: (name, masterId) => {
        set((state) => {
            const newGroup: CopierGroup = {
                id: uuidv4(),
                name,
                isActive: false,
                riskMode: 'multiplier',
                multiplier: 1,
                masterAccountId: masterId,
                slaveAccountIds: []
            };
            const updated = [...state.groups, newGroup];
            storageService.saveCopierGroups(updated);
            return { groups: updated };
        });
    },

    updateGroup: (id, updates) => {
        set((state) => {
            const updated = state.groups.map(g =>
                g.id === id ? { ...g, ...updates } : g
            );
            storageService.saveCopierGroups(updated);
            return { groups: updated };
        });
    },

    deleteGroup: (id) => {
        set((state) => {
            const updated = state.groups.filter(g => g.id !== id);
            storageService.saveCopierGroups(updated);
            return { groups: updated };
        });
    },

    toggleGroupActive: (id) => {
        set(state => {
            const updated = state.groups.map(g =>
                g.id === id ? { ...g, isActive: !g.isActive } : g
            );
            storageService.saveCopierGroups(updated);
            return { groups: updated };
        });
    },

    addAccount: (account) => {
        set(state => ({ accounts: [...state.accounts, account] }));
    }
}));
