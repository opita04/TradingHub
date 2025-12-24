import type { AIMessage } from '../types';

export const aiService = {
    analyzeEntry: async (_content: string): Promise<string> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("I noticed you're feeling frustrated with your exit strategy. Remember our rule about sticking to the plan? Let's look at the data: your win rate is high, but the early exits are dragging down your R:R.");
            }, 1500);
        });
    },

    sendMessage: async (_message: string): Promise<AIMessage> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: "That's a valid concern. FOMO often triggers when we lack confidence in our edge. Have you backtested this setup recently? Seeing the stats might calm the impulse.",
                    timestamp: Date.now()
                });
            }, 1200);
        });
    }
};
