import React, { useState } from 'react';
import { Building2, ExternalLink, ShieldCheck, AlertTriangle, Plus, ChevronDown, ChevronUp, Pencil, Trash2, MessageSquare } from 'lucide-react';
import { usePropFirmStore } from '../../stores/propFirmStore';
import { AddPropFirmModal } from './AddPropFirmModal';
import { EditPropFirmModal } from './EditPropFirmModal';
import type { PropFirm } from '../../types';

// Normalize URL to ensure it has a proper protocol
const normalizeUrl = (url: string): string => {
    if (!url || url === '#') return '#';
    // Already has a protocol
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // Add https:// if missing
    return `https://${url.startsWith('www.') ? url : url}`;
};

export const PropFirmList: React.FC = () => {
    const { firms, deleteFirm } = usePropFirmStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editModalFirm, setEditModalFirm] = useState<PropFirm | null>(null);
    const [expandedFirmId, setExpandedFirmId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const toggleExpanded = (firmId: string) => {
        setExpandedFirmId(expandedFirmId === firmId ? null : firmId);
    };

    const handleDelete = (firmId: string) => {
        deleteFirm(firmId);
        setDeleteConfirmId(null);
    };

    return (
        <div className="p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Building2 className="text-yellow-500" size={32} />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-100">Proprietary Firms</h1>
                        <p className="text-gray-400">Curated list of funding providers & their conditions.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus size={18} />
                    Add Firm
                </button>
            </div>

            <div className="bg-[#1a1f2e] border border-[#27272a] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#0a0a0a] text-xs uppercase text-gray-400 font-semibold border-b border-[#27272a]">
                        <tr>
                            <th className="p-4 w-10"></th>
                            <th className="p-4">Firm Name</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Drawdown Type</th>
                            <th className="p-4">Payout Schedule</th>
                            <th className="p-4">Scaling Plan</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a]">
                        {firms.map((firm) => (
                            <React.Fragment key={firm.id}>
                                <tr className="hover:bg-[#252b3b] transition-colors">
                                    {/* Expand Toggle */}
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleExpanded(firm.id)}
                                            className={`p-1.5 rounded-lg transition-colors ${firm.comments
                                                ? 'text-blue-400 hover:bg-blue-500/20'
                                                : 'text-gray-600 cursor-not-allowed'
                                                }`}
                                            disabled={!firm.comments}
                                            title={firm.comments ? 'View notes' : 'No notes available'}
                                        >
                                            {expandedFirmId === firm.id ? (
                                                <ChevronUp size={18} />
                                            ) : (
                                                <ChevronDown size={18} />
                                            )}
                                        </button>
                                    </td>
                                    {/* Firm Name */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <div className="font-bold text-gray-200">{firm.name}</div>
                                                <div className="flex text-yellow-500 text-xs mt-1">
                                                    {'★'.repeat(firm.rating)}{'☆'.repeat(5 - firm.rating)}
                                                </div>
                                            </div>
                                            {firm.comments && (
                                                <MessageSquare size={14} className="text-blue-400 opacity-50" />
                                            )}
                                        </div>
                                    </td>
                                    {/* Status */}
                                    <td className="p-4">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded flex w-fit items-center gap-1 ${firm.status === 'preferred' ? 'bg-green-500/20 text-green-400' :
                                            firm.status === 'verified' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-red-500/20 text-red-500'
                                            }`}>
                                            {firm.status === 'preferred' && <ShieldCheck size={12} />}
                                            {firm.status === 'caution' && <AlertTriangle size={12} />}
                                            {firm.status}
                                        </span>
                                    </td>
                                    {/* Drawdown Type */}
                                    <td className="p-4 text-sm text-gray-300">{firm.drawdownType}</td>
                                    {/* Payout */}
                                    <td className="p-4 text-sm text-gray-300">{firm.payout}</td>
                                    {/* Scaling */}
                                    <td className="p-4 text-sm text-gray-400 max-w-xs truncate">{firm.scaling}</td>
                                    {/* Actions */}
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={normalizeUrl(firm.link)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1.5 hover:bg-blue-500/10 rounded-lg"
                                            >
                                                Visit
                                                <ExternalLink size={12} />
                                            </a>
                                            <button
                                                onClick={() => setEditModalFirm(firm)}
                                                className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                                                title="Edit firm"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            {deleteConfirmId === firm.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDelete(firm.id)}
                                                        className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmId(null)}
                                                        className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirmId(firm.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete firm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                {/* Expanded Comments Row */}
                                {expandedFirmId === firm.id && firm.comments && (
                                    <tr className="bg-[#0d1117]">
                                        <td colSpan={7} className="p-0">
                                            <div className="p-4 pl-14 border-l-4 border-blue-500/50">
                                                <div className="flex items-start gap-3">
                                                    <MessageSquare size={16} className="text-blue-400 mt-0.5 shrink-0" />
                                                    <div>
                                                        <h4 className="text-xs uppercase font-semibold text-gray-400 mb-2">Additional Notes</h4>
                                                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{firm.comments}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 bg-blue-900/10 border border-blue-900/30 p-4 rounded-lg flex items-start gap-3">
                <ShieldCheck className="text-blue-500 shrink-0" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-blue-400">Due Diligence Reminder</h4>
                    <p className="text-xs text-gray-400 mt-1">
                        Funding space conditions change rapidly. Always verify current rules regarding HFT, consistency rules, and payout policies directly on the firm's website before purchasing a challenge.
                    </p>
                </div>
            </div>

            <AddPropFirmModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EditPropFirmModal
                isOpen={!!editModalFirm}
                onClose={() => setEditModalFirm(null)}
                firm={editModalFirm}
            />
        </div>
    );
};
