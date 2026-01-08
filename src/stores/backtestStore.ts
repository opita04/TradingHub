import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { BacktestSession, BacktestTradeLog, Trade, SessionMode } from '../types';
import { storageService } from '../services/storage';
import { useTradeStore } from './tradeStore';

interface BacktestState {
    currentSession: BacktestSession | null;
    sessions: BacktestSession[];

    // Progress tracking
    loggedCount: number;
    elapsedSeconds: number;
    timerInterval: number | null;

    // Actions
    loadSessions: () => void;
    startSession: (config: {
        strategyId: string;
        strategyName: string;
        strategyType: string;
        market: string;
        timeframe: string;
        mode: SessionMode;
        target: number;
    }) => void;
    logTrade: (log: BacktestTradeLog) => void;
    endSession: () => void;
    abortSession: () => void;
    resetSession: () => void;

    // Helpers
    isSessionActive: () => boolean;
    getProgress: () => { current: number; target: number; percent: number };
}

export const useBacktestStore = create<BacktestState>((set, get) => ({
    currentSession: null,
    sessions: storageService.loadBacktestSessions(),
    loggedCount: 0,
    elapsedSeconds: 0,
    timerInterval: null,

    loadSessions: () => {
        set({ sessions: storageService.loadBacktestSessions() });
    },

    startSession: (config) => {
        const session: BacktestSession = {
            id: uuidv4(),
            strategyId: config.strategyId,
            strategyVersionId: uuidv4(), // Snapshot version
            strategySnapshot: {
                id: config.strategyId,
                name: config.strategyName,
                type: config.strategyType
            },
            market: config.market,
            timeframe: config.timeframe,
            mode: config.mode,
            target: config.target,
            startTime: Date.now(),
            status: 'ACTIVE'
        };

        let interval: any = null;
        if (config.mode === 'TIME') {
            interval = setInterval(() => {
                const { currentSession, elapsedSeconds, endSession } = get();
                if (!currentSession) return;

                const newElapsed = elapsedSeconds + 1;
                set({ elapsedSeconds: newElapsed });

                if (newElapsed >= currentSession.target * 60) {
                    endSession();
                }
            }, 1000);
        }

        set({
            currentSession: session,
            loggedCount: 0,
            elapsedSeconds: 0,
            timerInterval: interval
        });
    },

    logTrade: (log) => {
        const { currentSession, loggedCount, endSession } = get();
        if (!currentSession) return;

        const trade: Trade = {
            id: uuidv4(),
            tradeType: 'BACKTEST',
            sessionId: currentSession.id,
            strategyVersionId: currentSession.strategyVersionId,
            strategyId: currentSession.strategyId,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            instrument: currentSession.market,
            direction: 'long', // Default, backtest focus is on setup/entry/outcome
            pnl: log.outcome === 'WIN' ? (log.rMultiple || 1) : (log.outcome === 'LOSS' ? -1 : 0),
            riskReward: log.rMultiple,
            followedRules: log.entryValid,
            session: 'BACKTEST',
            setup: log.setupPresent ? ['BACKTEST_SETUP'] : [],
            screenshots: log.screenshots?.map((s, i) => ({
                id: uuidv4(),
                data: s,
                order: i
            })) || [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        // Add to trade store
        useTradeStore.getState().addTrade(trade);

        const newCount = loggedCount + 1;
        set({ loggedCount: newCount });

        // Auto-end if sample target reached
        if (currentSession.mode === 'SAMPLE' && newCount >= currentSession.target) {
            endSession();
        }
    },

    endSession: () => {
        const { currentSession, timerInterval, sessions } = get();
        if (!currentSession) return;

        if (timerInterval) clearInterval(timerInterval);

        const updatedSession: BacktestSession = {
            ...currentSession,
            status: 'COMPLETED',
            endTime: Date.now()
        };

        const newSessions = [updatedSession, ...sessions];
        storageService.saveBacktestSessions(newSessions);

        set({
            currentSession: updatedSession,
            sessions: newSessions,
            timerInterval: null
        });
    },

    abortSession: () => {
        const { currentSession, timerInterval, sessions } = get();
        if (!currentSession) return;

        if (timerInterval) clearInterval(timerInterval);

        // Map session list to include aborted session if it doesn't exist yet
        // or just add it if it's the current one.
        const updatedSession: BacktestSession = {
            ...currentSession,
            status: 'ABORTED',
            endTime: Date.now()
        };

        const sessionExists = sessions.some(s => s.id === updatedSession.id);
        const newSessions = sessionExists
            ? sessions.map(s => s.id === updatedSession.id ? updatedSession : s)
            : [updatedSession, ...sessions];

        storageService.saveBacktestSessions(newSessions);

        set({
            currentSession: null,
            sessions: newSessions,
            timerInterval: null
        });
    },

    resetSession: () => {
        const { timerInterval } = get();
        if (timerInterval) clearInterval(timerInterval);
        set({
            currentSession: null,
            timerInterval: null,
            loggedCount: 0,
            elapsedSeconds: 0
        });
    },

    isSessionActive: () => {
        return get().currentSession?.status === 'ACTIVE';
    },

    getProgress: () => {
        const { currentSession, loggedCount, elapsedSeconds } = get();
        if (!currentSession) return { current: 0, target: 0, percent: 0 };

        if (currentSession.mode === 'SAMPLE') {
            return {
                current: loggedCount,
                target: currentSession.target,
                percent: Math.min((loggedCount / currentSession.target) * 100, 100)
            };
        } else {
            const targetSeconds = currentSession.target * 60;
            return {
                current: elapsedSeconds,
                target: targetSeconds,
                percent: Math.min((elapsedSeconds / targetSeconds) * 100, 100)
            };
        }
    }
}));
