import { useState, useEffect } from 'react';

const STORAGE_KEY = 'revolut-calc-dark-mode';

function storedPreference(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function savePreference(value: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore — storage unavailable
  }
}

function prefersColorSchemeDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

function getInitialDark(): boolean {
  const stored = storedPreference();
  if (stored !== null) return stored === 'true';
  return prefersColorSchemeDark();
}

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(getInitialDark);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    savePreference(String(dark));
  }, [dark]);

  // Follow OS preference changes only when user hasn't set an explicit preference
  useEffect(() => {
    let mq: MediaQueryList;
    try {
      mq = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return;
    }
    const handler = (e: MediaQueryListEvent) => {
      if (storedPreference() === null) setDark(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return { dark, toggle: () => setDark((d) => !d) };
}
