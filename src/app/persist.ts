const KEY = 'habit-tracker-state';

export function loadState<T>(): T | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch { return undefined; }
}

export function saveState<T>(state: T) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

export function throttle<T extends (...args: any[]) => void>(fn: T, wait = 1000) {
  let last = 0; let timeout: number | undefined;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      last = now; fn(...args);
    } else {
      if (timeout) clearTimeout(timeout);
      // @ts-ignore
      timeout = setTimeout(() => { last = Date.now(); fn(...args); }, remaining);
    }
  };
}