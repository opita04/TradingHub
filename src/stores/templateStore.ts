import { create } from 'zustand';
import type { Template } from '../types';
import { storageService } from '../services/storage';


interface TemplateStore {
    templates: Template[];
    addTemplate: (template: Template) => void;
    deleteTemplate: (id: string) => void;
    loadTemplates: () => void;
    initDefaults: () => void;
}

const defaultTemplates: Template[] = [
    // Instruments - E-mini
    { id: 't-nq-nav', name: 'NQ Long', type: 'instrument', prefill: { instrument: 'NQ', direction: 'long' }, color: '#10b981' }, // Green
    { id: 't-nq-sell', name: 'NQ Short', type: 'instrument', prefill: { instrument: 'NQ', direction: 'short' }, color: '#ef4444' }, // Red
    { id: 't-es-buy', name: 'ES Long', type: 'instrument', prefill: { instrument: 'ES', direction: 'long' }, color: '#10b981' },
    { id: 't-es-sell', name: 'ES Short', type: 'instrument', prefill: { instrument: 'ES', direction: 'short' }, color: '#ef4444' },
    // Instruments - Micro
    { id: 't-mnq-buy', name: 'MNQ Long', type: 'instrument', prefill: { instrument: 'MNQ', direction: 'long' }, color: '#10b981' },
    { id: 't-mnq-sell', name: 'MNQ Short', type: 'instrument', prefill: { instrument: 'MNQ', direction: 'short' }, color: '#ef4444' },
    { id: 't-mes-buy', name: 'MES Long', type: 'instrument', prefill: { instrument: 'MES', direction: 'long' }, color: '#10b981' },
    { id: 't-mes-sell', name: 'MES Short', type: 'instrument', prefill: { instrument: 'MES', direction: 'short' }, color: '#ef4444' },
    { id: 't-m2k-buy', name: 'M2K Long', type: 'instrument', prefill: { instrument: 'M2K', direction: 'long' }, color: '#10b981' },
    { id: 't-m2k-sell', name: 'M2K Short', type: 'instrument', prefill: { instrument: 'M2K', direction: 'short' }, color: '#ef4444' },


    // Sessions
    { id: 't-ny-am', name: 'NY AM', type: 'session', prefill: { session: 'NY AM' }, color: '#3b82f6' }, // Blue
    { id: 't-ny-pm', name: 'NY PM', type: 'session', prefill: { session: 'NY PM' }, color: '#8b5cf6' }, // Purple
    { id: 't-london', name: 'London', type: 'session', prefill: { session: 'London' }, color: '#f59e0b' }, // Amber
    { id: 't-asia', name: 'Asia', type: 'session', prefill: { session: 'Asia' }, color: '#ec4899' }, // Pink

    // Setups
    { id: 't-breakout', name: 'Breakout', type: 'setup', prefill: {}, color: '#06b6d4' },
    { id: 't-reversal', name: 'Reversal', type: 'setup', prefill: {}, color: '#84cc16' },
    { id: 't-trend', name: 'Trend', type: 'setup', prefill: {}, color: '#a855f7' },

    // Emotions
    { id: 't-confident', name: 'Confident', type: 'emotion', prefill: {}, color: '#10b981' },
    { id: 't-fomo', name: 'FOMO', type: 'emotion', prefill: {}, color: '#ef4444' },
    { id: 't-fearful', name: 'Fearful', type: 'emotion', prefill: {}, color: '#f59e0b' },
];

export const useTemplateStore = create<TemplateStore>((set) => ({
    templates: [],

    addTemplate: (template) => {
        set((state) => {
            const newTemplates = [...state.templates, template];
            storageService.saveTemplates(newTemplates);
            return { templates: newTemplates };
        });
    },

    deleteTemplate: (id) => {
        set((state) => {
            const newTemplates = state.templates.filter((t) => t.id !== id);
            storageService.saveTemplates(newTemplates);
            return { templates: newTemplates };
        });
    },

    loadTemplates: () => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9e8b917d-6254-43be-83b6-79fe8568963b', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'templateStore.ts:59', message: 'loadTemplates called', data: {}, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
        // #endregion
        try {
            const templates = storageService.loadTemplates();
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/9e8b917d-6254-43be-83b6-79fe8568963b', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'templateStore.ts:62', message: 'Templates loaded from storage', data: { templatesCount: templates.length, usingDefaults: templates.length === 0 }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
            // #endregion
            set({ templates: templates.length > 0 ? templates : defaultTemplates });
        } catch (error) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/9e8b917d-6254-43be-83b6-79fe8568963b', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'templateStore.ts:65', message: 'ERROR loading templates', data: { errorMessage: error instanceof Error ? error.message : String(error) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
            // #endregion
            throw error;
        }
    },

    initDefaults: () => {
        set({ templates: defaultTemplates });
        storageService.saveTemplates(defaultTemplates);
    }
}));
