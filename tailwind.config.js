/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-ink': 'var(--brand-ink)',
        'brand-ink-soft': 'var(--brand-ink-soft)',
        'brand-accent': 'var(--brand-accent)',
        'bg-canvas': 'var(--bg-canvas)',
        'bg-surface': 'var(--bg-surface)',
        'bg-surface-2': 'var(--bg-surface-2)',
        'bg-inset': 'var(--bg-inset)',
        line: 'var(--line)',
        'text-1': 'var(--text-1)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        positive: 'var(--positive)',
        negative: 'var(--negative)',
      },
      borderRadius: {
        'design-sm': 'var(--radius-sm)',
        'design-md': 'var(--radius-md)',
        'design-lg': 'var(--radius-lg)',
        'design-xl': 'var(--radius-xl)',
        'design-pill': 'var(--radius-pill)',
      },
      boxShadow: {
        'design-1': 'var(--shadow-1)',
        'design-2': 'var(--shadow-2)',
        'design-3': 'var(--shadow-3)',
      },
    },
  },
  plugins: [],
};
