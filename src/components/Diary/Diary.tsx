import React, { useState } from 'react';
import { Book, Plus, Search, Calendar, Tag } from 'lucide-react';
import { useDiaryStore } from '../../stores/diaryStore';
import { format } from 'date-fns';

export const Diary: React.FC = () => {
    const { entries, addEntry } = useDiaryStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newContent, setNewContent] = useState('');
    const [newMood, setNewMood] = useState('Neutral');

    const activeEntry = entries.find(e => e.id === selectedId);

    const handleSave = () => {
        if (!newContent) return;
        addEntry(newContent, newMood, ['daily']);
        setNewContent('');
        setIsCreating(false);
    };

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden animate-fade-in">
            {/* Sidebar List */}
            <div className="w-80 border-r border-[#1f2937] bg-[#0f1219] flex flex-col">
                <div className="p-4 border-b border-[#1f2937]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-gray-200 flex items-center gap-2">
                            <Book size={18} className="text-blue-500" />
                            My Diary
                        </h2>
                        <button
                            onClick={() => { setIsCreating(true); setSelectedId(null); }}
                            className="bg-blue-600 hover:bg-blue-500 p-1.5 rounded transition-colors"
                        >
                            <Plus size={16} className="text-white" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                        <input
                            placeholder="Search entries..."
                            className="w-full bg-[#1a1f2e] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {entries.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-xs">
                            No entries yet. Start writing!
                        </div>
                    )}
                    {entries.map(entry => (
                        <div
                            key={entry.id}
                            onClick={() => { setSelectedId(entry.id); setIsCreating(false); }}
                            className={`p-4 border-b border-[#1f2937] cursor-pointer hover:bg-[#1a1f2e] transition-colors ${selectedId === entry.id ? 'bg-[#1a1f2e] border-l-2 border-l-blue-500' : ''}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-400 font-mono">{format(new Date(entry.date), 'MMM dd, HH:mm')}</span>
                                <span className="text-[10px] bg-[#252b3b] px-1.5 py-0.5 rounded text-gray-400">{entry.mood}</span>
                            </div>
                            <h3 className="font-bold text-gray-200 text-sm truncate">{entry.title}</h3>
                            <p className="text-xs text-gray-500 truncate mt-1">{entry.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-[#0a0a0a] flex flex-col">
                {(isCreating || activeEntry) ? (
                    <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
                        {isCreating ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-100">New Entry</h2>
                                    <select
                                        value={newMood}
                                        onChange={e => setNewMood(e.target.value)}
                                        className="bg-[#1a1f2e] text-gray-300 border border-[#27272a] rounded px-3 py-1 text-sm outline-none"
                                    >
                                        <option>Energetic</option>
                                        <option>Calm</option>
                                        <option>Tired</option>
                                        <option>Anxious</option>
                                        <option>Neutral</option>
                                    </select>
                                </div>
                                <textarea
                                    value={newContent}
                                    onChange={e => setNewContent(e.target.value)}
                                    placeholder="What's on your mind today?"
                                    className="w-full h-96 bg-[#1a1f2e] border border-[#27272a] rounded-xl p-6 text-gray-200 focus:outline-none focus:border-blue-500/50 resize-none font-serif text-lg leading-relaxed"
                                    autoFocus
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Save Entry
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="border-b border-[#27272a] pb-6">
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {format(new Date(activeEntry!.date), 'MMMM dd, yyyy')}</span>
                                        <span className="flex items-center gap-1"><Tag size={14} /> {activeEntry!.tags.join(', ')}</span>
                                        <span className="px-2 py-0.5 bg-blue-900/20 text-blue-400 rounded text-xs">{activeEntry!.mood}</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-100">{activeEntry!.title}</h1>
                                </div>
                                <div className="prose prose-invert max-w-none text-gray-300 font-serif text-lg leading-relaxed whitespace-pre-wrap">
                                    {activeEntry!.content}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 flex-col gap-4">
                        <Book size={48} className="opacity-20" />
                        <p>Select an entry or start writing</p>
                    </div>
                )}
            </div>
        </div>
    );
};
