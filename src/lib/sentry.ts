import * as Sentry from '@sentry/react';

export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn || import.meta.env.DEV) {
    return;
  }

  Sentry.init({
    dsn,
    environment: 'production',
    tracesSampleRate: 0.1,
    release: import.meta.env.VITE_APP_VERSION,
    allowUrls: [/^https?:\/\/juanjecilla\.github\.io(?::\d+)?(?:\/|$)/],
    ignoreErrors: ['ResizeObserver loop limit exceeded', 'Non-Error promise rejection captured'],
    beforeSend(event) {
      if (event.user) {
        delete event.user.ip_address;
        delete event.user.email;
      }
      return event;
    },
  });
}
