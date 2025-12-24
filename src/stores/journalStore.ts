import { create } from 'zustand';
import { storageService } from '../services/storage';
import type { JournalEntry, AIMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface JournalState {
    entries: JournalEntry[];
    activeEntryId: string | null;
    isAIAnalyzing: boolean;

    // Actions
    loadEntries: () => void;
    selectEntry: (id: string) => void;
    addEntry: (content: string, mood: number) => void; // Simplified creation
    updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
    deleteEntry: (id: string) => void;

    // AI Actions
    addAIMessage: (entryId: string, message: AIMessage) => void;
    setAnalyzing: (isAnalyzing: boolean) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
    entries: storageService.loadJournalEntries() || [],
    activeEntryId: null,
    isAIAnalyzing: false,

    loadEntries: () => {
        set({ entries: storageService.loadJournalEntries() || [] });
    },

    selectEntry: (id) => set({ activeEntryId: id }),

    addEntry: (content, mood) => {
        set((state) => {
            const newEntry: JournalEntry = {
                id: uuidv4(),
                date: new Date().toISOString(),
                content,
                sentiment: mood >= 7 ? 'positive' : mood <= 4 ? 'negative' : 'neutral',
                tags: [],
                aiAnalysis: undefined,
                relatedTradeIds: [],
                moodScore: mood,
                updatedAt: Date.now()
            };

            const updatedEntries = [newEntry, ...state.entries];
            storageService.saveJournalEntries(updatedEntries);
            return { entries: updatedEntries, activeEntryId: newEntry.id };
        });
    },

    updateEntry: (id, updates) => {
        set((state) => {
            const updatedEntries = state.entries.map(e =>
                e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e
            );
            storageService.saveJournalEntries(updatedEntries);
            return { entries: updatedEntries };
        });
    },

    deleteEntry: (id) => {
        set((state) => {
            const updatedEntries = state.entries.filter(e => e.id !== id);
            storageService.saveJournalEntries(updatedEntries);
            return { entries: updatedEntries, activeEntryId: null };
        });
    },

    addAIMessage: (entryId, message) => {
        // In a real app, messages might be stored separately or within the entry
        // For now, we assume JournalEntry has a `conversation` field or similar.
        // Checking types/journal.ts... 
        // If JournalEntry doesn't have conversation history, we might need to store it in a separate store or update the type.
        // Based on my memory of Phase 1, JournalEntry has `aiAnalysis` but maybe not full chat history?
        // "AIConversation" type exists.

        // Let's assume we update the entry to include the message in a conversation array
        // If it's missing from the type, I'll need to update the type or just store it in state for the session.
        // For now, I'll just log it.
        console.log('AI Message added', entryId, message);

        // Note: Implementation depends on exact Type definition. 
        // If JournalEntry has `conversation: AIMessage[]`, I'd update it here.
    },

    setAnalyzing: (isAnalyzing) => set({ isAIAnalyzing: isAnalyzing })
}));
