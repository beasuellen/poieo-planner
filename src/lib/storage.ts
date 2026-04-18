import type { Store } from "../types";

const KEY = "focus-planner-v1";

const empty: Store = { tasks: [], customTags: [] };

export function loadStore(): Store {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Store;
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      customTags: Array.isArray(parsed.customTags) ? parsed.customTags : [],
    };
  } catch {
    return empty;
  }
}

export function saveStore(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // quota or private mode — ignore
  }
}
