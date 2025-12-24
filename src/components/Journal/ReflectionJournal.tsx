import React, { useState, useEffect } from 'react';
import {
    Plus,
    Calendar,
    Smile,
    Frown,
    Meh,
    Sparkles,
    Send,
    Bot,
    Tag
} from 'lucide-react';
import { useJournalStore } from '../../stores/journalStore';
import { aiService } from '../../services/aiService';
import { format } from 'date-fns';

export const ReflectionJournal: React.FC = () => {
    const {
        entries,
        activeEntryId,
        selectEntry,
        addEntry,
        updateEntry,
        isAIAnalyzing,
        setAnalyzing
    } = useJournalStore();

    const [msgInput, setMsgInput] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const [mood, setMood] = useState(5);

    // Derived state
    const activeEntry = entries.find(e => e.id === activeEntryId);

    // Sync editor when active entry changes
    useEffect(() => {
        if (activeEntry) {
            setEditorContent(activeEntry.content);
            setMood(activeEntry.moodScore || 5);
        } else {
            setEditorContent('');
            setMood(5);
        }
    }, [activeEntryId, entries]);

    const handleCreateNew = () => {
        addEntry('', 5);
    };

    const handleSave = () => {
        if (activeEntryId) {
            updateEntry(activeEntryId, { content: editorContent, moodScore: mood });
        }
    };

    // Chat State (Local for now, could move to store)
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "Hello Jaime. I'm your Trading Psychologist. How was your session today? I'm noticing some hesitation in your recent logs." }
    ]);

    const handleSendMessage = async () => {
        if (!msgInput.trim()) return;

        const newMsg = { role: 'user' as const, content: msgInput };
        setMessages(prev => [...prev, newMsg]);
        setMsgInput('');

        // AI Response
        const response = await aiService.sendMessage(msgInput);
        setMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
    };

    const generateInsight = async () => {
        if (!activeEntryId) return;
        setAnalyzing(true);
        const insight = await aiService.analyzeEntry(editorContent);
        setMessages(prev => [...prev, { role: 'assistant', content: `**Analysis:** ${insight}` }]);
        setAnalyzing(false);
    };

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden gap-4 p-4 animate-fade-in">
            {/* Left: Entry List */}
            <div className="w-64 bg-[#1a1f2e] border border-[#27272a] rounded-xl flex flex-col">
                <div className="p-4 border-b border-[#27272a] flex justify-between items-center">
                    <h3 className="text-gray-200 font-semibold">Entries</h3>
                    <button
                        onClick={handleCreateNew}
                        className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {entries.map(entry => (
                        <div
                            key={entry.id}
                            onClick={() => selectEntry(entry.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${activeEntryId === entry.id ? 'bg-[#252b3b] border border-blue-500/30' : 'hover:bg-[#252b3b] border border-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-sm font-medium text-gray-200">
                                    {format(new Date(entry.date), 'MMM d, yyyy')}
                                </span>
                                {entry.moodScore && entry.moodScore >= 7 ? <Smile size={14} className="text-green-500" /> :
                                    entry.moodScore && entry.moodScore <= 4 ? <Frown size={14} className="text-red-500" /> :
                                        <Meh size={14} className="text-yellow-500" />}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">
                                {entry.content || 'No content...'}
                            </p>
                        </div>
                    ))}
                    {entries.length === 0 && (
                        <div className="text-center py-10 text-gray-500 text-xs">
                            No entries yet. Start journaling!
                        </div>
                    )}
                </div>
            </div>

            {/* Center: Editor */}
            <div className="flex-1 bg-[#1a1f2e] border border-[#27272a] rounded-xl flex flex-col relative">
                {activeEntryId ? (
                    <>
                        <div className="p-4 border-b border-[#27272a] flex justify-between items-center bg-[#1a1f2e] z-10 rounded-t-xl">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span className="text-gray-200 font-medium">
                                        {format(new Date(activeEntry!.date), 'MMMM d, yyyy - h:mm a')}
                                    </span>
                                </div>
                                <div className="h-4 w-px bg-gray-700" />
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">Mood:</span>
                                    <input
                                        type="range"
                                        min="1" max="10"
                                        value={mood}
                                        onChange={(e) => setMood(parseInt(e.target.value))}
                                        className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <span className={`text-xs font-bold ${mood >= 7 ? 'text-green-400' : mood <= 4 ? 'text-red-400' : 'text-yellow-400'}`}>
                                        {mood}/10
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleSave}
                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                        <textarea
                            value={editorContent}
                            onChange={(e) => setEditorContent(e.target.value)}
                            onBlur={handleSave}
                            placeholder="Reflect on your trading day..."
                            className="flex-1 w-full bg-[#141414] text-gray-200 p-6 resize-none focus:outline-none text-base leading-relaxed custom-scrollbar"
                        />
                        <div className="p-3 border-t border-[#27272a] flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg text-xs transition-colors" onClick={generateInsight}>
                                <Sparkles size={14} />
                                Generate AI Insight
                            </button>
                            <div className="flex-1" />
                            <button className="text-gray-500 hover:text-gray-300">
                                <Tag size={16} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <Calendar size={48} className="mb-4 opacity-50" />
                        <p>Select an entry or create a new one</p>
                    </div>
                )}
            </div>

            {/* Right: AI Chat */}
            <div className="w-80 bg-[#1a1f2e] border border-[#27272a] rounded-xl flex flex-col">
                <div className="p-4 border-b border-[#27272a] flex items-center gap-3 bg-gradient-to-r from-purple-900/10 to-transparent">
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                        <Bot size={18} className="text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200">Financial Therapist</h3>
                        <p className="text-[10px] text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Online
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-[#252b3b] text-gray-300 rounded-bl-none border border-[#334155]'
                                }`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isAIAnalyzing && (
                        <div className="flex justify-start">
                            <div className="bg-[#252b3b] px-4 py-2 rounded-2xl rounded-bl-none border border-[#334155] text-xs text-gray-400 animate-pulse">
                                Analyzing entry...
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-3 border-t border-[#27272a]">
                    <div className="flex items-center gap-2 bg-[#141414] rounded-lg px-3 py-2 border border-[#334155] focus-within:border-blue-500/50 transition-colors">
                        <input
                            type="text"
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask for advice..." // Fixed typo
                            className="flex-1 bg-transparent text-sm text-gray-200 focus:outline-none placeholder:text-gray-600"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
