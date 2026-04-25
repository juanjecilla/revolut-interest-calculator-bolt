import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { isRatesStale, daysSinceRatesUpdate } from '@/utils/rates';
import { RATES_LAST_UPDATED } from '@/constants/plans';

const DISMISS_KEY = 'revolut-calc-rates-dismissed';

function isDismissedInSession(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === 'true';
  } catch {
    return false;
  }
}

function persistDismiss(): void {
  try {
    sessionStorage.setItem(DISMISS_KEY, 'true');
  } catch {
    // ignore — storage unavailable
  }
}

export function StaleRatesWarning() {
  const [dismissed, setDismissed] = useState(isDismissedInSession);

  if (!isRatesStale() || dismissed) return null;

  const days = daysSinceRatesUpdate();

  function handleDismiss() {
    persistDismiss();
    setDismissed(true);
  }

  return (
    <div
      role="alert"
      className="max-w-4xl mx-auto mb-6 flex items-start gap-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded-xl px-4 py-3"
    >
      <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="text-sm flex-1">
        <strong>Rates may be outdated.</strong> The plan data was last verified{' '}
        <strong>{days} days ago</strong> ({RATES_LAST_UPDATED}).{' '}
        <a
          href="https://www.revolut.com/legal/fees"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Verify current rates at revolut.com
        </a>
        .
      </p>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss rates warning"
        className="shrink-0 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
