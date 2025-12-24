import { useState } from 'react';
import { Download, Upload, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTradeStore } from '../../stores/tradeStore';
import { useTemplateStore } from '../../stores/templateStore';
import { storageService } from '../../services/storage';

export function Settings() {
    const loadTrades = useTradeStore(state => state.loadTrades);
    const initDefaults = useTemplateStore(state => state.initDefaults);

    const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    const handleExport = () => {
        const data = storageService.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tradehub_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = event.target?.result as string;
                const success = storageService.importData(json);
                if (success) {
                    loadTrades();
                    // Reload templates too if we had a load function exposed, but re-render works
                    setImportStatus('success');
                    setTimeout(() => setImportStatus('idle'), 3000);
                } else {
                    setImportStatus('error');
                }
            } catch {
                setImportStatus('error');
            }
        };
        reader.readAsText(file);
    };

    const handleResetData = () => {
        storageService.clearAllData();
        loadTrades();
        initDefaults(); // Reset templates to default
        setShowConfirmReset(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">

            {/* Data Management Section */}
            <div className="card space-y-6">
                <h3 className="text-xl font-bold border-b border-gray-700 pb-4">Data Management</h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#1a1f2e] border border-[#334155] rounded-lg">
                        <div>
                            <h4 className="font-semibold text-gray-200">Export Data</h4>
                            <p className="text-sm text-gray-400">Download a backup of all your trades and settings.</p>
                        </div>
                        <button
                            onClick={handleExport}
                            className="btn btn-primary"
                        >
                            <Download size={18} /> Export JSON
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#1a1f2e] border border-[#334155] rounded-lg">
                        <div>
                            <h4 className="font-semibold text-gray-200">Import Data</h4>
                            <p className="text-sm text-gray-400">Restore from a backup file.</p>
                            {importStatus === 'success' && <span className="text-green-400 text-xs flex items-center gap-1 mt-1"><CheckCircle size={12} /> Import Successful</span>}
                            {importStatus === 'error' && <span className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertTriangle size={12} /> Import Failed</span>}
                        </div>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <button className="btn btn-secondary">
                                <Upload size={18} /> Import JSON
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-900/10 border border-red-900/30 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-red-400">Danger Zone</h4>
                            <p className="text-sm text-red-300/60">Permanently delete all data.</p>
                        </div>

                        {!showConfirmReset ? (
                            <button
                                onClick={() => setShowConfirmReset(true)}
                                className="btn border border-red-500/50 text-red-400 hover:bg-red-500/10"
                            >
                                <Trash2 size={18} /> Clear All Data
                            </button>
                        ) : (
                            <div className="flex gap-2 animate-fade-in">
                                <button
                                    onClick={() => setShowConfirmReset(false)}
                                    className="btn btn-ghost text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResetData}
                                    className="btn bg-red-600 text-white hover:bg-red-700 text-xs"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="card space-y-4">
                <h3 className="text-xl font-bold border-b border-gray-700 pb-4">App Info</h3>
                <div className="text-sm text-gray-400 space-y-2">
                    <p>TradeHub v1.0.0</p>
                    <p>Local-first trading journal with analytics.</p>
                    <p className="pt-2 text-xs text-gray-600">Built with React, Vite, Tailwind, Zustand & Chart.js</p>
                </div>
            </div>

        </div>
    );
}
