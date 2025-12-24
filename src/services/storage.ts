import type {
    Trade,
    Template,
    LifestyleEntry,
    CustomHabit,
    JournalEntry,
    DiaryEntry,
    PersonalFinanceEntry,
    CopierGroup,
    Strategy,
    PropFirm
} from '../types';

const TRADES_KEY = 'tradinghub_trades';
const TEMPLATES_KEY = 'tradinghub_templates';
const LIFESTYLE_KEY = 'tradinghub_lifestyle';
const CUSTOM_HABITS_KEY = 'tradinghub_custom_habits';
const JOURNAL_KEY = 'tradinghub_journal';
const DIARY_KEY = 'tradinghub_diary';
const FINANCE_KEY = 'tradinghub_finance';
const COPIER_KEY = 'tradinghub_copier';
const STRATEGIES_KEY = 'tradinghub_strategies';
const PROP_FIRMS_KEY = 'tradinghub_prop_firms';

export const storageService = {
    // Trades
    saveTrades: (trades: Trade[]) => {
        try {
            localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
        } catch (error) {
            console.error('Error saving trades to localStorage', error);
        }
    },

    loadTrades: (): Trade[] => {
        try {
            const data = localStorage.getItem(TRADES_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading trades from localStorage', error);
            return [];
        }
    },

    // Templates
    saveTemplates: (templates: Template[]) => {
        try {
            localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
        } catch (error) {
            console.error('Error saving templates to localStorage', error);
        }
    },

    loadTemplates: (): Template[] => {
        try {
            const data = localStorage.getItem(TEMPLATES_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading templates from localStorage', error);
            return [];
        }
    },

    // Lifestyle
    saveLifestyleEntries: (entries: LifestyleEntry[]) => {
        localStorage.setItem(LIFESTYLE_KEY, JSON.stringify(entries));
    },

    loadLifestyleEntries: (): LifestyleEntry[] => {
        const data = localStorage.getItem(LIFESTYLE_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveCustomHabits: (habits: CustomHabit[]) => {
        localStorage.setItem(CUSTOM_HABITS_KEY, JSON.stringify(habits));
    },

    loadCustomHabits: (): CustomHabit[] => {
        const data = localStorage.getItem(CUSTOM_HABITS_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Journal & Diary
    saveJournalEntries: (entries: JournalEntry[]) => {
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
    },

    loadJournalEntries: (): JournalEntry[] => {
        const data = localStorage.getItem(JOURNAL_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveDiaryEntries: (entries: DiaryEntry[]) => {
        localStorage.setItem(DIARY_KEY, JSON.stringify(entries));
    },

    loadDiaryEntries: (): DiaryEntry[] => {
        const data = localStorage.getItem(DIARY_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Finance
    saveFinanceEntries: (entries: PersonalFinanceEntry[]) => {
        localStorage.setItem(FINANCE_KEY, JSON.stringify(entries));
    },

    loadFinanceEntries: (): PersonalFinanceEntry[] => {
        const data = localStorage.getItem(FINANCE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Copier
    saveCopierGroups: (groups: CopierGroup[]) => {
        localStorage.setItem(COPIER_KEY, JSON.stringify(groups));
    },

    loadCopierGroups: (): CopierGroup[] => {
        const data = localStorage.getItem(COPIER_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Strategies
    saveStrategies: (strategies: Strategy[]) => {
        localStorage.setItem(STRATEGIES_KEY, JSON.stringify(strategies));
    },

    loadStrategies: (): Strategy[] => {
        const data = localStorage.getItem(STRATEGIES_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Prop Firms
    savePropFirms: (firms: PropFirm[]) => {
        localStorage.setItem(PROP_FIRMS_KEY, JSON.stringify(firms));
    },

    loadPropFirms: (): PropFirm[] => {
        const data = localStorage.getItem(PROP_FIRMS_KEY);
        return data ? JSON.parse(data) : [];
    },

    clearAllData: () => {
        localStorage.clear();
    },

    exportData: () => {
        const data = {
            trades: JSON.parse(localStorage.getItem(TRADES_KEY) || '[]'),
            templates: JSON.parse(localStorage.getItem(TEMPLATES_KEY) || '[]'),
            lifestyle: JSON.parse(localStorage.getItem(LIFESTYLE_KEY) || '[]'),
            customHabits: JSON.parse(localStorage.getItem(CUSTOM_HABITS_KEY) || '[]'),
            journal: JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]'),
            diary: JSON.parse(localStorage.getItem(DIARY_KEY) || '[]'),
            finance: JSON.parse(localStorage.getItem(FINANCE_KEY) || '[]'),
            copier: JSON.parse(localStorage.getItem(COPIER_KEY) || '[]'),
            strategies: JSON.parse(localStorage.getItem(STRATEGIES_KEY) || '[]'),
        };
        return JSON.stringify(data, null, 2);
    },

    importData: (jsonData: string) => {
        try {
            const data = JSON.parse(jsonData);
            if (data.trades) localStorage.setItem(TRADES_KEY, JSON.stringify(data.trades));
            if (data.templates) localStorage.setItem(TEMPLATES_KEY, JSON.stringify(data.templates));
            if (data.lifestyle) localStorage.setItem(LIFESTYLE_KEY, JSON.stringify(data.lifestyle));
            if (data.customHabits) localStorage.setItem(CUSTOM_HABITS_KEY, JSON.stringify(data.customHabits));
            if (data.journal) localStorage.setItem(JOURNAL_KEY, JSON.stringify(data.journal));
            if (data.diary) localStorage.setItem(DIARY_KEY, JSON.stringify(data.diary));
            if (data.finance) localStorage.setItem(FINANCE_KEY, JSON.stringify(data.finance));
            if (data.copier) localStorage.setItem(COPIER_KEY, JSON.stringify(data.copier));
            if (data.strategies) localStorage.setItem(STRATEGIES_KEY, JSON.stringify(data.strategies));
            return true;
        } catch (error) {
            console.error('Error importing data', error);
            return false;
        }
    }
};
