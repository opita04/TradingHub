import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Code, Terminal, Sparkles, Maximize2, Minimize2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    type: 'text' | 'code' | 'analysis';
    timestamp: number;
}

export const AIIntegrationModule: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "I've analyzed your recent NQ trades. You seem to be entering too early on reversals. Would you like to review the specific setups?",
            type: 'analysis',
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            type: 'text',
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, newMessage]);
        setInput('');

        // Mock AI Response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Processing trade data... Here is a Python snippet to backtest that entry logic:",
                type: 'text',
                timestamp: Date.now()
            };
            const codeResponse: Message = {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: "def check_entry(price, ema20):\n    if price > ema20 and volume > avg_volume:\n        return True\n    return False",
                type: 'code',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiResponse, codeResponse]);
        }, 1000);
    };

    return (
        <div className={`glass-panel flex flex-col transition-all duration-500 overflow-hidden ${isExpanded ? 'fixed inset-4 z-50 h-auto' : 'h-[600px] rounded-xl'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand/10 rounded-lg text-brand border border-brand/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-primary flex items-center gap-2">
                            Trading Assistant
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand/10 text-brand border border-brand/20">BETA</span>
                        </h3>
                        <p className="text-[10px] text-tertiary">Powered by DeepSeek-V3</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
                    >
                        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-app/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-brand text-app shadow-[0_0_10px_#06B6D4]' : 'bg-surface-highlight text-secondary border border-white/10'
                            }`}>
                            {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                        </div>

                        <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`rounded-2xl p-4 text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-brand/10 text-primary border border-brand/20 rounded-tr-sm'
                                : 'bg-surface text-secondary border border-white/5 rounded-tl-sm'
                                }`}>
                                {msg.type === 'code' ? (
                                    <div className="font-mono text-xs bg-[#0d1117] p-3 rounded-lg border border-white/10 overflow-x-auto">
                                        <pre>{msg.content}</pre>
                                    </div>
                                ) : (
                                    <p>{msg.content}</p>
                                )}
                            </div>
                            <span className="text-[10px] text-tertiary mt-1 px-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface/50 border-t border-white/5 backdrop-blur-md">
                <div className="relative group">
                    <div className="absolute inset-0 bg-brand/5 rounded-xl blur-sm group-focus-within:bg-brand/10 transition-colors" />
                    <div className="relative bg-app/80 border border-white/10 rounded-xl overflow-hidden shadow-inner focus-within:border-brand/50 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all">
                        <div className="flex items-center px-3 py-2 bg-white/5 border-b border-white/5 gap-2">
                            <span className="text-[10px] font-mono text-brand flex items-center gap-1">
                                <Terminal size={12} />
                                CONSOLE_INPUT
                            </span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            placeholder="Ask me to analyze your trades or generate code..."
                            className="w-full bg-transparent border-none text-primary p-3 font-mono text-sm focus:ring-0 resize-none placeholder:text-tertiary min-h-[80px]"
                        />
                        <div className="flex justify-between items-center p-2 bg-white/5">
                            <div className="flex gap-2">
                                <button className="p-1.5 text-tertiary hover:text-primary rounded hover:bg-white/10 transition-colors">
                                    <Code size={16} />
                                </button>
                            </div>
                            <button
                                onClick={handleSend}
                                className="p-2 bg-brand text-white rounded-lg hover:bg-cyan-600 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
