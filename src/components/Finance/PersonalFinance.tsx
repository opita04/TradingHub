import React, { useState } from 'react';
import { DollarSign, Wallet, TrendingUp, PiggyBank, CreditCard, ArrowUpRight, ArrowDownRight, Plus, X, Trash2 } from 'lucide-react';
import { useFinanceStore } from '../../stores/financeStore';
import { format } from 'date-fns';

// Add Transaction Modal Component
const AddTransactionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const addTransaction = useFinanceStore(state => state.addTransaction);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense' as 'income' | 'expense',
        category: 'General',
        recurring: false
    });

    const handleSubmit = () => {
        if (!formData.description || !formData.amount) return;

        const amount = parseFloat(formData.amount);
        addTransaction({
            date: new Date().toISOString(),
            description: formData.description,
            amount: formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
            type: formData.type,
            category: formData.category,
            recurring: formData.recurring
        });

        setFormData({ description: '', amount: '', type: 'expense', category: 'General', recurring: false });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#15171B] border border-white/10 rounded-xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-100">Add Transaction</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full bg-[#0a0a0a] border border-[#334155] rounded-lg p-3 text-gray-200 focus:border-green-500 outline-none"
                            placeholder="e.g., Prop Firm Payout"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                            className="w-full bg-[#0a0a0a] border border-[#334155] rounded-lg p-3 text-gray-200 focus:border-green-500 outline-none"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                            className={`py-2 rounded-lg text-sm font-medium transition-all ${formData.type === 'income'
                                    ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                                    : 'bg-[#0a0a0a] border border-[#334155] text-gray-400'
                                }`}
                        >
                            Income
                        </button>
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                            className={`py-2 rounded-lg text-sm font-medium transition-all ${formData.type === 'expense'
                                    ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                                    : 'bg-[#0a0a0a] border border-[#334155] text-gray-400'
                                }`}
                        >
                            Expense
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full bg-[#0a0a0a] border border-[#334155] rounded-lg p-3 text-gray-200 outline-none"
                        >
                            <option value="Trading">Trading</option>
                            <option value="Business">Business</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Investments">Investments</option>
                            <option value="Bills">Bills</option>
                            <option value="General">General</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-gray-200">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium"
                    >
                        Add Transaction
                    </button>
                </div>
            </div>
        </div>
    );
};

// Add Goal Modal Component
const AddGoalModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const addGoal = useFinanceStore(state => state.addGoal);
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        color: '#a855f7'
    });

    const handleSubmit = () => {
        if (!formData.name || !formData.targetAmount) return;

        addGoal({
            name: formData.name,
            targetAmount: parseFloat(formData.targetAmount),
            currentAmount: parseFloat(formData.currentAmount) || 0,
            color: formData.color
        });

        setFormData({ name: '', targetAmount: '', currentAmount: '0', color: '#a855f7' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#15171B] border border-white/10 rounded-xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-100">Add Financial Goal</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Goal Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-[#0a0a0a] border border-[#334155] rounded-lg p-3 text-gray-200 focus:border-purple-500 outline-none"
                            placeholder="e.g., Emergency Fund"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Target Amount ($)</label>
                            <input
                                type="number"
                                value={formData.targetAmount}
                                onChange={e => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                                className="w-full bg-[#0a0a0a] border border-[#334155] rounded-lg p-3 text-gray-200 focus:border-purple-500 outline-none"
                                placeholder="10000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Current Amount ($)</label>
                            <input
                                type="number"
                                value={formData.currentAmount}
                                onChange={e => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                                className="w-full bg-[#0a0a0a] border border-[#334155] rounded-lg p-3 text-gray-200 focus:border-purple-500 outline-none"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-gray-200">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium"
                    >
                        Add Goal
                    </button>
                </div>
            </div>
        </div>
    );
};

export const PersonalFinance: React.FC = () => {
    const { entries, goals, getNetWorth, deleteTransaction, deleteGoal } = useFinanceStore();
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);

    const netWorth = getNetWorth();

    // Calculate income vs expenses
    const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + Math.abs(e.amount), 0);

    // Get recent transactions (last 10)
    const recentTransactions = entries.slice(0, 10);

    return (
        <div className="p-6 animate-fade-in space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <DollarSign className="text-green-500" size={32} />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-100">Personal Finance</h1>
                        <p className="text-gray-400">Total wealth tracking & runway analysis.</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowTransactionModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus size={18} />
                    Add Transaction
                </button>
            </div>

            {/* Net Worth Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1a1f2e] border border-[#27272a] rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10">
                        <Wallet size={100} />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">Net Worth</span>
                    <div className={`text-4xl font-bold mt-2 ${netWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${netWorth.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                        <TrendingUp size={16} />
                        {entries.length} transactions recorded
                    </div>
                </div>

                <div className="bg-[#1a1f2e] border border-[#27272a] rounded-xl p-6">
                    <span className="text-gray-400 text-sm font-medium">Total Income</span>
                    <div className="text-2xl font-bold text-green-400 mt-2">${totalIncome.toLocaleString()}</div>
                    <div className="mt-4 flex gap-2">
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">All Time</span>
                    </div>
                </div>

                <div className="bg-[#1a1f2e] border border-[#27272a] rounded-xl p-6">
                    <span className="text-gray-400 text-sm font-medium">Total Expenses</span>
                    <div className="text-2xl font-bold text-red-400 mt-2">${totalExpenses.toLocaleString()}</div>
                    <div className="mt-4 w-full h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-red-500"
                            style={{ width: `${totalIncome > 0 ? Math.min((totalExpenses / totalIncome) * 100, 100) : 0}%` }}
                        />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 block">
                        {totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0}% of income
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-[#1a1f2e] border border-[#27272a] rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-200">Recent Transactions</h3>
                        <span className="text-xs text-gray-500">{entries.length} total</span>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {recentTransactions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <DollarSign size={48} className="mx-auto mb-2 opacity-30" />
                                <p>No transactions yet</p>
                                <p className="text-xs mt-1">Click "Add Transaction" to get started</p>
                            </div>
                        ) : (
                            recentTransactions.map(tx => (
                                <div key={tx.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#334155] rounded-lg hover:border-gray-500 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-200 text-sm">{tx.description || 'Transaction'}</div>
                                            <div className="text-xs text-gray-500">
                                                {format(new Date(tx.date), 'MMM dd')} • {tx.category}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-mono font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.type === 'income' ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </span>
                                        <button
                                            onClick={() => deleteTransaction(tx.id)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Goals */}
                <div className="bg-[#1a1f2e] border border-[#27272a] rounded-xl p-6">
                    <h3 className="font-bold text-gray-200 mb-6 flex items-center gap-2">
                        <PiggyBank size={18} className="text-purple-400" />
                        Financial Goals
                    </h3>
                    <div className="space-y-6">
                        {goals.length === 0 ? (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                No goals set yet
                            </div>
                        ) : (
                            goals.map(goal => {
                                const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                                return (
                                    <div key={goal.id} className="group">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-300">{goal.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 font-mono">{percent}%</span>
                                                <button
                                                    onClick={() => deleteGoal(goal.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-[#0a0a0a] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${percent}%`, backgroundColor: goal.color }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                                            <span>${goal.currentAmount.toLocaleString()}</span>
                                            <span>${goal.targetAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <button
                        onClick={() => setShowGoalModal(true)}
                        className="w-full mt-6 py-2 border border-dashed border-[#334155] rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                        <CreditCard size={14} />
                        Add New Goal
                    </button>
                </div>
            </div>

            {/* Modals */}
            <AddTransactionModal isOpen={showTransactionModal} onClose={() => setShowTransactionModal(false)} />
            <AddGoalModal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} />
        </div>
    );
};
