import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimelineWindow, BenchmarkIndex } from '../types';

interface AppState {
    // Timeline State
    activeTimeline: TimelineWindow;
    customDateRange: { start: string; end: string } | null;
    setTimeline: (window: TimelineWindow) => void;
    setCustomDateRange: (range: { start: string; end: string } | null) => void;

    // Dashboard State
    selectedBenchmark: BenchmarkIndex;
    setSelectedBenchmark: (index: BenchmarkIndex) => void;

    // Navigation State
    activeTab: string;
    setActiveTab: (tab: string) => void;

    // Theme State
    isDarkMode: boolean;
    toggleTheme: () => void;

    // Modal State
    isNewTradeModalOpen: boolean;
    setNewTradeModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            activeTimeline: 'trailing_12m',
            customDateRange: null,
            setTimeline: (window) => set({ activeTimeline: window }),
            setCustomDateRange: (range) => set({ customDateRange: range }),

            selectedBenchmark: 'SPX',
            setSelectedBenchmark: (index) => set({ selectedBenchmark: index }),

            activeTab: 'overview',
            setActiveTab: (tab) => set({ activeTab: tab }),

            isDarkMode: true,
            toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

            isNewTradeModalOpen: false,
            setNewTradeModalOpen: (open) => set({ isNewTradeModalOpen: open }),
        }),
        {
            name: 'app-storage',
        }
    )
);

