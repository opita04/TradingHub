import type { Template } from '../../types';

interface TemplateButtonProps {
    template: Template;
    onClick: (template: Template) => void;
    selected?: boolean;
}

export function TemplateButton({ template, onClick, selected }: TemplateButtonProps) {
    // Determine text color based on background luminance or just use white for dark buttons
    // For simplicity in this dark theme, most colored buttons will look good with white text

    return (
        <button
            type="button"
            onClick={() => onClick(template)}
            className={`
        px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
        border border-transparent hover:brightness-110 active:scale-95
        ${selected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f1419]' : ''}
      `}
            style={{
                backgroundColor: template.color + '20', // 20% opacity
                color: template.color,
                borderColor: template.color + '40'
            }}
        >
            {template.name}
        </button>
    );
}
