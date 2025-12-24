import { useRef } from 'react';
import { useTemplateStore } from '../../stores/templateStore';
import { TemplateButton } from './TemplateButton';
import type { Template } from '../../types';

interface QuickTemplateBarProps {
    onSelectTemplate: (template: Template) => void;
}

export function QuickTemplateBar({ onSelectTemplate }: QuickTemplateBarProps) {
    const templates = useTemplateStore((state) => state.templates);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const instruments = templates.filter(t => t.type === 'instrument');
    const sessions = templates.filter(t => t.type === 'session');
    const setups = templates.filter(t => t.type === 'setup');
    const emotions = templates.filter(t => t.type === 'emotion');

    return (
        <div className="w-full mb-6">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-400">Quick Templates</label>
                <button
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    onClick={() => {
                        // TODO: Open template manager
                        console.log('Manage templates clicked');
                    }}
                >
                    Customize
                </button>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {instruments.length > 0 && (
                    <div className="flex gap-2 items-center pr-4 border-r border-gray-700/50">
                        {instruments.map(t => (
                            <TemplateButton key={t.id} template={t} onClick={onSelectTemplate} />
                        ))}
                    </div>
                )}

                {sessions.length > 0 && (
                    <div className="flex gap-2 items-center pr-4 border-r border-gray-700/50">
                        {sessions.map(t => (
                            <TemplateButton key={t.id} template={t} onClick={onSelectTemplate} />
                        ))}
                    </div>
                )}

                {setups.length > 0 && (
                    <div className="flex gap-2 items-center pr-4 border-r border-gray-700/50">
                        {setups.map(t => (
                            <TemplateButton key={t.id} template={t} onClick={onSelectTemplate} />
                        ))}
                    </div>
                )}

                {emotions.length > 0 && (
                    <div className="flex gap-2 items-center">
                        {emotions.map(t => (
                            <TemplateButton key={t.id} template={t} onClick={onSelectTemplate} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
