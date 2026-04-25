import { useState, useEffect, useCallback } from 'react';

const DEFAULT_AMOUNT = '10000';

function readHashAmount(): string {
  const hash = window.location.hash;
  const match = hash.match(/[#&]?amount=([0-9.]+)/);
  if (match) {
    const value = parseFloat(match[1]);
    if (!isNaN(value) && value >= 0) return match[1];
  }
  return DEFAULT_AMOUNT;
}

export function useHashAmount() {
  const [rawAmount, setRawAmountState] = useState<string>(readHashAmount);

  const setRawAmount = useCallback((value: string) => {
    setRawAmountState(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= 0) {
      const newHash = `#amount=${parsed}`;
      window.history.replaceState(null, '', newHash);
    }
  }, []);

  useEffect(() => {
    function onHashChange() {
      setRawAmountState(readHashAmount());
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return { rawAmount, setRawAmount };
}
