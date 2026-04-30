import { Sun, Moon } from 'lucide-react';

interface Props {
  dark: boolean;
  onToggle: () => void;
}

export function DarkModeToggle({ dark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      className="p-2 transition-colors"
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid var(--line)',
        background: 'var(--bg-surface-2)',
        color: 'var(--text-2)',
      }}
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
