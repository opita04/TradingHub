import React, { useState, useRef, useEffect } from 'react';
import {
    Home,

    Building2,
    Wallet,
    LineChart,
    Ghost,
    BookOpen,
    DollarSign,
    FlaskConical,
    Search,
    ChevronDown,
    ChevronRight,
    LogOut,
    Plus,
    Check,
    MoreVertical,
    Edit2,
    Trash2
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useAccountStore } from '../../stores/accountStore';
import { useBacktestStore } from '../../stores/backtestStore';
import { AddAccountModal, RenameAccountModal, DeleteAccountModal } from '../Account/AccountModals';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    id: string;
    hasSubmenu?: boolean;
    badge?: string;
    active: boolean;
    onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    icon: Icon,
    label,
    hasSubmenu,
    badge,
    active,
    onClick
}) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group relative mb-1 overflow-hidden
            ${active
                ? 'bg-brand/10 text-brand shadow-[inset_4px_0_0_0_#06B6D4]'
                : 'text-secondary hover:bg-white/5 hover:text-primary'
            }`}
    >
        {/* Active Glow Background */}
        {active && <div className="absolute inset-0 bg-brand/5 animate-pulse-slow" />}

        <div className="flex items-center gap-3 relative z-10">
            <Icon size={18} className={`transition-colors duration-200 ${active ? 'text-brand drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-tertiary group-hover:text-secondary'}`} />
            <span className="text-sm font-medium tracking-wide">{label}</span>
        </div>

        <div className="flex items-center gap-2 relative z-10">
            {badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge === 'AI'
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    : 'bg-brand/10 text-brand border-brand/20'
                    }`}>
                    {badge}
                </span>
            )}
            {hasSubmenu && <ChevronRight size={14} className="text-tertiary group-hover:text-secondary transition-colors" />}
        </div>
    </button>
);

const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-3 px-3 flex items-center gap-2">
            {title}
            <div className="h-px bg-white/5 flex-1" />
        </h3>
        <div className="space-y-0.5">
            {children}
        </div>
    </div>
);

// Accounts Dropdown with account selection and add functionality
interface AccountsDropdownProps {
    active: boolean;
    onClick: () => void;
}

const AccountsDropdown: React.FC<AccountsDropdownProps> = ({ active, onClick }) => {
    const { accounts, selectedAccountId, selectAccount, addAccount, updateAccount, deleteAccount } = useAccountStore();
    const [isOpen, setIsOpen] = useState(false);
    const [contextMenuId, setContextMenuId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Modal states
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [targetAccount, setTargetAccount] = useState<{ id: string; name: string } | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setContextMenuId(null);
            }
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setContextMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddAccount = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAddModalOpen(true);
    };

    const handleAddAccountSubmit = (name: string, currency: string, initialBalance: number) => {
        addAccount(name, undefined, initialBalance, currency);
    };

    const handleSelectAccount = (accountId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        selectAccount(accountId);
        onClick(); // Navigate to accounts page
    };

    const handleContextMenu = (accountId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setContextMenuId(contextMenuId === accountId ? null : accountId);
    };

    const handleRename = (accountId: string, currentName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setTargetAccount({ id: accountId, name: currentName });
        setRenameModalOpen(true);
        setContextMenuId(null);
    };

    const handleRenameSubmit = (newName: string) => {
        if (targetAccount) {
            updateAccount(targetAccount.id, { name: newName });
        }
    };

    const handleDelete = (accountId: string, accountName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setTargetAccount({ id: accountId, name: accountName });
        setDeleteModalOpen(true);
        setContextMenuId(null);
    };

    const handleDeleteConfirm = () => {
        if (targetAccount) {
            deleteAccount(targetAccount.id);
        }
    };

    const selectedAccount = accounts.find(a => a.id === selectedAccountId);

    return (
        <>
            <div ref={dropdownRef}>
                {/* Main Button */}
                <button
                    onClick={() => {
                        onClick();
                        setIsOpen(!isOpen);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden
                        ${active
                            ? 'bg-brand/10 text-brand shadow-[inset_4px_0_0_0_#06B6D4]'
                            : 'text-secondary hover:bg-white/5 hover:text-primary'
                        }`}
                >
                    {active && <div className="absolute inset-0 bg-brand/5 animate-pulse-slow" />}

                    <div className="flex items-center gap-3 relative z-10">
                        <Wallet size={18} className={`transition-colors duration-200 ${active ? 'text-brand drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-tertiary group-hover:text-secondary'}`} />
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium tracking-wide">Accounts</span>
                            {!isOpen && selectedAccount && (
                                <span className="text-[10px] text-tertiary">{selectedAccount.name}</span>
                            )}
                        </div>
                    </div>

                    <ChevronDown
                        size={14}
                        className={`text-tertiary group-hover:text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Expanded Account List - Inline */}
                {isOpen && (
                    <div className="mt-1 ml-4 pl-3 border-l border-white/10">
                        {/* Account List */}
                        {accounts.length > 0 ? (
                            <div className="space-y-0.5">
                                {accounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className={`relative flex items-center justify-between py-1.5 text-xs transition-colors group/item rounded-md
                                            ${selectedAccountId === account.id
                                                ? 'text-brand'
                                                : 'text-secondary hover:text-primary'
                                            }`}
                                    >
                                        <button
                                            onClick={(e) => handleSelectAccount(account.id, e)}
                                            className="flex items-center gap-2 flex-1"
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${account.isActive ? 'bg-profit' : 'bg-tertiary'}`} />
                                            <span>{account.name}</span>
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {selectedAccountId === account.id && (
                                                <Check size={12} className="text-brand" />
                                            )}

                                            {/* Three-dot menu button */}
                                            <button
                                                onClick={(e) => handleContextMenu(account.id, e)}
                                                className="p-0.5 rounded hover:bg-white/10 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                            >
                                                <MoreVertical size={12} className="text-tertiary" />
                                            </button>
                                        </div>

                                        {/* Context Menu */}
                                        {contextMenuId === account.id && (
                                            <div
                                                ref={contextMenuRef}
                                                className="absolute right-0 top-full mt-1 py-1 bg-surface border border-white/10 rounded-lg shadow-xl z-[60] min-w-[120px] animate-fade-in"
                                            >
                                                <button
                                                    onClick={(e) => handleRename(account.id, account.name, e)}
                                                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-secondary hover:bg-white/5 hover:text-primary transition-colors"
                                                >
                                                    <Edit2 size={12} />
                                                    Rename
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(account.id, account.name, e)}
                                                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-loss hover:bg-loss/10 transition-colors"
                                                >
                                                    <Trash2 size={12} />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-1.5 text-xs text-tertiary">No accounts yet</div>
                        )}

                        {/* Add Account Button */}
                        <button
                            onClick={handleAddAccount}
                            className="flex items-center gap-2 py-1.5 text-xs text-tertiary hover:text-brand transition-colors mt-1"
                        >
                            <Plus size={12} />
                            Add Account
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddAccountModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAdd={handleAddAccountSubmit}
            />
            <RenameAccountModal
                isOpen={renameModalOpen}
                currentName={targetAccount?.name || ''}
                onClose={() => {
                    setRenameModalOpen(false);
                    setTargetAccount(null);
                }}
                onRename={handleRenameSubmit}
            />
            <DeleteAccountModal
                isOpen={deleteModalOpen}
                accountName={targetAccount?.name || ''}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setTargetAccount(null);
                }}
                onDelete={handleDeleteConfirm}
            />
        </>
    );
};


export const Sidebar: React.FC = () => {
    const { activeTab, setActiveTab } = useAppStore();
    const { currentSession } = useBacktestStore();
    const isSessionActive = currentSession?.status === 'ACTIVE';

    return (
        <div className="w-64 h-full glass border-r border-white/5 flex flex-col relative z-20 shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-blue-600 flex items-center justify-center shadow-lg shadow-brand/20">
                        <span className="text-white font-bold text-lg">T</span>
                    </div>
                    <span className="text-sm font-bold text-primary tracking-tight">TradingHub</span>
                </div>

                <div className="relative group">
                    <Search size={14} className="absolute left-3 top-2.5 text-tertiary group-focus-within:text-brand transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-surface-highlight border border-white/5 rounded-lg pl-9 pr-12 py-2 text-xs text-primary focus:outline-none focus:border-brand/50 transition-all placeholder:text-tertiary focus:bg-surface-highlight/80"
                    />
                    <div className="absolute right-2 top-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-tertiary font-mono">
                        ⌘K
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar space-y-2">
                <SidebarItem
                    icon={Home}
                    label="Home"
                    id="overview"
                    active={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                />
                <SidebarItem
                    icon={LineChart}
                    label="Workstation"
                    id="workstation"
                    active={activeTab === 'workstation'}
                    onClick={() => setActiveTab('workstation')}
                />
                <SidebarItem
                    icon={FlaskConical}
                    label="Backtesting"
                    id="backtest"
                    badge={isSessionActive ? 'ACTIVE' : undefined}
                    active={activeTab === 'backtest'}
                    onClick={() => setActiveTab('backtest')}
                />


                <div className="mt-6" />

                <SidebarSection title="Trading">
                    {/* Accounts with Dropdown */}
                    <AccountsDropdown
                        active={activeTab === 'accounts'}
                        onClick={() => setActiveTab('accounts')}
                    />
                    <SidebarItem
                        icon={Building2}
                        label="Prop Firms"
                        id="prop-firms"
                        active={activeTab === 'prop-firms'}
                        onClick={() => setActiveTab('prop-firms')}
                    />
                    <SidebarItem
                        icon={LineChart}
                        label="Strategies"
                        id="strategies"
                        active={activeTab === 'strategies'}
                        onClick={() => setActiveTab('strategies')}
                    />
                    <SidebarItem
                        icon={Ghost}
                        label="Demon Hunter"
                        id="demon-hunter"
                        active={activeTab === 'demon-hunter'}
                        onClick={() => setActiveTab('demon-hunter')}
                    />
                    <SidebarItem
                        icon={BookOpen}
                        label="Journal"
                        id="journal"
                        badge="AI"
                        active={activeTab === 'journal'}
                        onClick={() => setActiveTab('journal')}
                    />
                </SidebarSection>

                <SidebarSection title="Lifestyle">
                    <SidebarItem
                        icon={DollarSign}
                        label="Finance"
                        id="finance"
                        active={activeTab === 'finance'}
                        onClick={() => setActiveTab('finance')}
                    />
                </SidebarSection>
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center ring-1 ring-white/10">
                            <span className="text-xs font-bold text-secondary group-hover:text-primary">JB</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-secondary group-hover:text-primary transition-colors">Jaime Bohl</span>
                            <span className="text-[10px] text-tertiary group-hover:text-brand transition-colors">Pro Plan</span>
                        </div>
                    </div>
                    <LogOut size={14} className="text-tertiary hover:text-loss transition-colors" />
                </div>
            </div>
        </div>
    );
};
