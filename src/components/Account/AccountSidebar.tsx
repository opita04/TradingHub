import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Settings, MoreVertical } from 'lucide-react';
import { useAccountStore } from '../../stores/accountStore';
import { useStrategiesStore } from '../../stores/strategiesStore';

interface AccountSidebarProps {
    onAddAccount: () => void;
}

export const AccountSidebar: React.FC<AccountSidebarProps> = ({ onAddAccount }) => {
    const { accounts, selectedAccountId, selectAccount } = useAccountStore();
    const { strategies } = useStrategiesStore();
    const [strategiesOpen, setStrategiesOpen] = useState(false);
    const [accountsOpen, setAccountsOpen] = useState(true);

    return (
        <div className="w-56 h-full glass border-r border-white/5 flex flex-col">
            {/* User Header */}
            <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center ring-1 ring-white/10">
                        <span className="text-xs font-bold text-secondary">JB</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-primary">Jaime Bohl</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                <div className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-3 px-2">
                    Navigation
                </div>

                {/* Workstation */}
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors">
                    <Settings size={16} className="text-tertiary" />
                    Workstation
                </button>

                {/* Strategies */}
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors">
                    <Settings size={16} className="text-tertiary" />
                    Strategies
                </button>

                {/* Accounts Section */}
                <div className="pt-4">
                    <button
                        onClick={() => setAccountsOpen(!accountsOpen)}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold text-tertiary uppercase tracking-wider hover:text-secondary transition-colors"
                    >
                        <span>Accounts</span>
                        {accountsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>

                    {accountsOpen && (
                        <div className="mt-1 space-y-0.5">
                            {accounts.map((account) => (
                                <button
                                    key={account.id}
                                    onClick={() => selectAccount(account.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors group ${selectedAccountId === account.id
                                            ? 'bg-brand/10 text-brand'
                                            : 'text-secondary hover:text-primary hover:bg-white/5'
                                        }`}
                                >
                                    <span>{account.name}</span>
                                    <MoreVertical size={14} className="opacity-0 group-hover:opacity-100 text-tertiary" />
                                </button>
                            ))}

                            <button
                                onClick={onAddAccount}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-tertiary hover:text-brand hover:bg-brand/5 rounded-lg transition-colors"
                            >
                                <Plus size={14} />
                                Add Account
                            </button>
                        </div>
                    )}
                </div>

                {/* Strategies Submenu */}
                <div className="pt-2">
                    <button
                        onClick={() => setStrategiesOpen(!strategiesOpen)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <span>Strategies</span>
                        <ChevronRight size={14} className={`transition-transform ${strategiesOpen ? 'rotate-90' : ''}`} />
                    </button>

                    {strategiesOpen && (
                        <div className="ml-4 mt-1 space-y-0.5 border-l border-white/5 pl-2">
                            {strategies.slice(0, 5).map((strategy) => (
                                <button
                                    key={strategy.id}
                                    className="w-full text-left px-2 py-1.5 text-xs text-tertiary hover:text-primary transition-colors"
                                >
                                    {strategy.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-white/5">
                <button className="w-full px-3 py-2 text-xs text-loss hover:bg-loss/10 rounded-lg transition-colors">
                    Logout
                </button>
            </div>
        </div>
    );
};
