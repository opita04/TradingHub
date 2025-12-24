import React, { useState, useEffect } from 'react';
import { X, Star, Building2 } from 'lucide-react';
import { usePropFirmStore } from '../../stores/propFirmStore';
import type { PropFirm } from '../../types';

interface EditPropFirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    firm: PropFirm | null;
}

export const EditPropFirmModal: React.FC<EditPropFirmModalProps> = ({ isOpen, onClose, firm }) => {
    const { updateFirm } = usePropFirmStore();

    const [name, setName] = useState('');
    const [rating, setRating] = useState(3);
    const [scaling, setScaling] = useState('');
    const [drawdownType, setDrawdownType] = useState<PropFirm['drawdownType']>('Balance');
    const [payout, setPayout] = useState('');
    const [status, setStatus] = useState<PropFirm['status']>('verified');
    const [link, setLink] = useState('');
    const [comments, setComments] = useState('');

    useEffect(() => {
        if (firm) {
            setName(firm.name);
            setRating(firm.rating);
            setScaling(firm.scaling);
            setDrawdownType(firm.drawdownType);
            setPayout(firm.payout);
            setStatus(firm.status);
            setLink(firm.link);
            setComments(firm.comments || '');
        }
    }, [firm]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firm) return;

        updateFirm(firm.id, {
            name: name.trim(),
            rating,
            scaling: scaling.trim() || 'N/A',
            drawdownType,
            payout: payout.trim() || 'N/A',
            status,
            link: link.trim() || '#',
            comments: comments.trim() || undefined,
        });

        onClose();
    };

    if (!isOpen || !firm) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#1a1f2e] border border-[#27272a] rounded-xl w-full max-w-lg mx-4 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#27272a] sticky top-0 bg-[#1a1f2e] z-10">
                    <div className="flex items-center gap-3">
                        <Building2 className="text-yellow-500" size={24} />
                        <h2 className="text-lg font-bold text-gray-100">Edit Firm</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Firm Name */}
                    <div>
                        <label className="block text-xs uppercase text-gray-400 font-semibold mb-2">
                            Firm Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., FTMO, TopStep..."
                            className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#27272a] rounded-lg text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-xs uppercase text-gray-400 font-semibold mb-2">
                            Rating
                        </label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={24}
                                        className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status & Drawdown Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-gray-400 font-semibold mb-2">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as PropFirm['status'])}
                                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#27272a] rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="preferred">Preferred</option>
                                <option value="verified">Verified</option>
                                <option value="caution">Caution</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-400 font-semibold mb-2">
                                Drawdown Type
                            </label>
                            <select
                                value={drawdownType}
                                onChange={(e) => setDrawdownType(e.target.value as PropFirm['drawdownType'])}
                                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#27272a] rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="Balance">Balance</option>
                                <option value="Equity">Equity</option>
                                <option value="Relative">Relative</option>
                            </select>
                        </div>
                    </div>

                    {/* Payout & Scaling */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-gray-400 font-semibold mb-2">
                                Payout Schedule
                            </label>
                            <input
                                type="text"
                                value={payout}
                                onChange={(e) => setPayout(e.target.value)}
                                placeholder="e.g., Weekly, Bi-weekly"
                                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#27272a] rounded-lg text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-400 font-semibold mb-2">
                                Scaling Plan
                            </label>
                            <input
                                type="text"
                                value={scaling}
                                onChange={(e) => setScaling(e.target.value)}
                                placeholder="e.g., 25% every 4 months"
                                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#27272a] rounded-lg text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Website Link */}
                    <div>
                        <label className="block text-xs uppercase text-gray-400 font-semibold mb-2">
                            Website URL
                        </label>
                        <input
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="www.example.com or https://..."
                            className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#27272a] rounded-lg text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Comments / Additional Notes */}
                    <div>
                        <label className="block text-xs uppercase text-gray-400 font-semibold mb-2">
                            Additional Notes
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Any additional information, personal notes, or important details about this firm..."
                            rows={3}
                            className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#27272a] rounded-lg text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-[#27272a]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
