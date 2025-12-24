/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Backgrounds
                app: '#0B0D10', // Deepest Charcoal/Black
                surface: '#15171B', // Slightly lighter cool-toned dark grey
                'surface-highlight': '#1E2128',

                // Accents - Neon
                profit: '#22C55E', // Neon Mint/Green
                loss: '#EF4444',   // Vivid Red
                brand: '#06B6D4',  // Electric Blue/Cyan

                // Text
                primary: '#FFFFFF',
                secondary: '#94A3B8',
                tertiary: '#64748B',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'], // Good for tabular data
            },
            boxShadow: {
                'glow-profit': '0 0 12px rgba(34, 197, 94, 0.4)',
                'glow-loss': '0 0 12px rgba(239, 68, 68, 0.4)',
                'glow-brand': '0 0 12px rgba(6, 182, 212, 0.4)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
