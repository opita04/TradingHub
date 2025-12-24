import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersonalFinanceEntry, FinancialGoal, RecurringBill } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface FinanceState {
    entries: PersonalFinanceEntry[]; // Acts as transactions
    goals: FinancialGoal[];
    bills: RecurringBill[];

    // Transaction Actions
    addTransaction: (entry: Omit<PersonalFinanceEntry, 'id' | 'createdAt'>) => void;
    deleteTransaction: (id: string) => void;

    // Goal Actions
    addGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
    updateGoal: (id: string, currentAmount: number) => void;
    deleteGoal: (id: string) => void;

    // Computed
    getNetWorth: () => number;
    getMonthlyIncome: () => number;
    getMonthlyExpenses: () => number;
}

export const useFinanceStore = create<FinanceState>()(
    persist(
        (set, get) => ({
            entries: [],
            goals: [],
            bills: [],

            addTransaction: (data) => {
                set((state) => {
                    const newEntry: PersonalFinanceEntry = {
                        id: uuidv4(),
                        ...data,
                        createdAt: Date.now()
                    };
                    return { entries: [newEntry, ...state.entries] };
                });
            },

            deleteTransaction: (id) => {
                set((state) => ({
                    entries: state.entries.filter(e => e.id !== id)
                }));
            },

            addGoal: (data) => {
                set(state => ({
                    goals: [...state.goals, { id: uuidv4(), ...data }]
                }));
            },

            updateGoal: (id, amount) => {
                set(state => ({
                    goals: state.goals.map(g => g.id === id ? { ...g, currentAmount: amount } : g)
                }));
            },

            deleteGoal: (id) => {
                set(state => ({
                    goals: state.goals.filter(g => g.id !== id)
                }));
            },

            getNetWorth: () => {
                const { entries } = get();
                return entries.reduce((sum, e) => {
                    if (e.type === 'income' || e.type === 'asset') {
                        return sum + e.amount;
                    } else {
                        return sum - Math.abs(e.amount);
                    }
                }, 0);
            },

            getMonthlyIncome: () => {
                const { entries } = get();
                const thisMonth = new Date().getMonth();
                const thisYear = new Date().getFullYear();
                return entries
                    .filter(e => {
                        const entryDate = new Date(e.date);
                        return e.type === 'income' &&
                            entryDate.getMonth() === thisMonth &&
                            entryDate.getFullYear() === thisYear;
                    })
                    .reduce((sum, e) => sum + e.amount, 0);
            },

            getMonthlyExpenses: () => {
                const { entries } = get();
                const thisMonth = new Date().getMonth();
                const thisYear = new Date().getFullYear();
                return entries
                    .filter(e => {
                        const entryDate = new Date(e.date);
                        return e.type === 'expense' &&
                            entryDate.getMonth() === thisMonth &&
                            entryDate.getFullYear() === thisYear;
                    })
                    .reduce((sum, e) => sum + Math.abs(e.amount), 0);
            }
        }),
        {
            name: 'finance-storage'
        }
    )
);
