import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';

// -------------------- Add Account Modal --------------------
interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, currency: string, initialBalance: number) => void;
}

const CURRENCIES = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'JPY', label: 'JPY' },
    { value: 'AUD', label: 'AUD' },
    { value: 'CAD', label: 'CAD' },
    { value: 'CHF', label: 'CHF' },
];

export const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [initialBalance, setInitialBalance] = useState('0');
    const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setName('');
            setCurrency('USD');
            setInitialBalance('0');
            // Focus the input after a short delay to ensure modal is rendered
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setCurrencyDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd(name.trim(), currency, parseFloat(initialBalance) || 0);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#0D0D0D] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 pb-2">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-primary">Add New Trading Account</h2>
                            <p className="text-sm text-tertiary mt-1">Create a new trading account to track your performance</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 text-tertiary hover:text-primary transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
                    {/* Account Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary">
                            Account Name
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Trading Account"
                            className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus:border-brand/50 transition-colors"
                        />
                    </div>

                    {/* Currency */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary">
                            Currency
                        </label>
                        <div ref={dropdownRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border border-brand/50 rounded-lg text-primary focus:outline-none transition-colors"
                            >
                                <span>{currency}</span>
                                <ChevronDown
                                    size={16}
                                    className={`text-tertiary transition-transform duration-200 ${currencyDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {currencyDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-10 overflow-hidden">
                                    {CURRENCIES.map((curr) => (
                                        <button
                                            key={curr.value}
                                            type="button"
                                            onClick={() => {
                                                setCurrency(curr.value);
                                                setCurrencyDropdownOpen(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${currency === curr.value
                                                ? 'bg-brand/10 text-brand'
                                                : 'text-secondary hover:bg-white/5 hover:text-primary'
                                                }`}
                                        >
                                            {curr.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Initial Balance */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary">
                            Initial Balance
                        </label>
                        <input
                            type="number"
                            value={initialBalance}
                            onChange={(e) => setInitialBalance(e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus:border-brand/50 transition-colors"
                        />
                        <p className="text-xs text-tertiary">
                            Current balance will be calculated automatically from your trades
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-secondary hover:text-primary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="px-5 py-2.5 text-sm font-medium bg-white/10 hover:bg-white/15 text-primary border border-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Account
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

// -------------------- Rename Account Modal --------------------
interface RenameAccountModalProps {
    isOpen: boolean;
    currentName: string;
    onClose: () => void;
    onRename: (newName: string) => void;
}

export const RenameAccountModal: React.FC<RenameAccountModalProps> = ({ isOpen, currentName, onClose, onRename }) => {
    const [name, setName] = useState(currentName);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setName(currentName);
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 100);
        }
    }, [isOpen, currentName]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || name.trim() === currentName) return;
        onRename(name.trim());
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-[#0D0D0D] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 pb-2">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-primary">Rename Account</h2>
                            <p className="text-sm text-tertiary mt-1">Enter a new name for this account</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 text-tertiary hover:text-primary transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary">
                            Account Name
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Account name"
                            className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus:border-brand/50 transition-colors"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-secondary hover:text-primary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim() || name.trim() === currentName}
                            className="px-5 py-2.5 text-sm font-medium bg-brand/10 hover:bg-brand/20 text-brand border border-brand/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Rename
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

// -------------------- Delete Account Modal --------------------
interface DeleteAccountModalProps {
    isOpen: boolean;
    accountName: string;
    onClose: () => void;
    onDelete: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, accountName, onClose, onDelete }) => {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onDelete();
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-[#0D0D0D] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 pb-2">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-loss">Delete Account</h2>
                            <p className="text-sm text-tertiary mt-1">This action cannot be undone</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 text-tertiary hover:text-primary transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <p className="text-sm text-secondary">
                        Are you sure you want to delete <span className="font-semibold text-primary">"{accountName}"</span>?
                        All associated data will be permanently removed.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 p-6 pt-2">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-secondary hover:text-primary transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-5 py-2.5 text-sm font-medium bg-loss/10 hover:bg-loss/20 text-loss border border-loss/20 rounded-lg transition-colors"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
