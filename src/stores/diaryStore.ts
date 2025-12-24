import { create } from 'zustand';
import { storageService } from '../services/storage';
import type { DiaryEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface DiaryState {
    entries: DiaryEntry[];

    // Actions
    addEntry: (content: string, mood: string, tags: string[]) => void;
    updateEntry: (id: string, updates: Partial<DiaryEntry>) => void;
    deleteEntry: (id: string) => void;
}

export const useDiaryStore = create<DiaryState>((set) => ({
    entries: storageService.loadDiaryEntries() || [],

    addEntry: (content, mood, tags) => {
        set((state) => {
            const newEntry: DiaryEntry = {
                id: uuidv4(),
                date: new Date().toISOString(),
                title: `Entry ${new Date().toLocaleDateString()}`,
                content,
                mood,
                tags,
                connections: [],
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            const updated = [newEntry, ...state.entries];
            storageService.saveDiaryEntries(updated);
            return { entries: updated };
        });
    },

    updateEntry: (id, updates) => {
        set((state) => {
            const updated = state.entries.map(e =>
                e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e
            );
            storageService.saveDiaryEntries(updated);
            return { entries: updated };
        });
    },

    deleteEntry: (id) => {
        set((state) => {
            const updated = state.entries.filter(e => e.id !== id);
            storageService.saveDiaryEntries(updated);
            return { entries: updated };
        });
    }
}));
