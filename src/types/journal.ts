export interface JournalEntry {
    id: string;
    date: string;
    time?: string;
    title?: string;
    content: string; // Rich text / markdown
    tags: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    aiAnalysis?: string;
    type?: 'daily' | 'revelation' | 'review';
    moodScore?: number;
    relatedTradeIds?: string[];
    createdAt?: number;
    updatedAt: number;
}

export interface DiaryEntry {
    id: string;
    date: string;
    title: string;
    content: string;
    mood: string; // Tired, Energetic, Anxious, etc.
    tags: string[];
    connections: string[]; // IDs of related entries
    createdAt: number;
    updatedAt: number;
}

export interface AIConversation {
    id: string;
    entryId: string;
    messages: AIMessage[];
}

export interface AIMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface Tag {
    id: string;
    name: string;
    color: string;
    category: 'psychology' | 'execution' | 'health' | 'other';
}
