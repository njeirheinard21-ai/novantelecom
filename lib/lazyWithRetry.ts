import { lazy, ComponentType } from 'react';

export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      const hasRetried = sessionStorage.getItem('lazy_retry');
      if (!hasRetried) {
        sessionStorage.setItem('lazy_retry', 'true');
        return new Promise<{ default: T }>((resolve) => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      }
      throw error;
    }
  });
}
