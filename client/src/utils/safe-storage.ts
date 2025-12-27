export type SafeStorage = {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
};

function buildSafeStorage(getStorage: () => Storage | null): SafeStorage {
  return {
    get(key) {
      try {
        const s = getStorage();
        return s ? s.getItem(key) : null;
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        const s = getStorage();
        if (s) s.setItem(key, value);
      } catch {
        // ignore
      }
    },
    remove(key) {
      try {
        const s = getStorage();
        if (s) s.removeItem(key);
      } catch {
        // ignore
      }
    },
  };
}

export const safeLocal = buildSafeStorage(() =>
  typeof window !== "undefined" ? window.localStorage : null
);

export const safeSession = buildSafeStorage(() =>
  typeof window !== "undefined" ? window.sessionStorage : null
);
