import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Priority, Status, Store, Task } from "../types";
import { loadStore, saveStore } from "../lib/storage";
import { addDays, isoDay, weekDays } from "../lib/time";
import { DEFAULT_TAGS } from "../lib/tags";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export interface NewTaskInput {
  title: string;
  description?: string;
  date: string;
  time?: string;
  tags: string[];
  priority: Priority;
}

interface Ctx {
  tasks: Task[];
  allTags: string[];
  selectedDate: string;
  activeTag: string | null;
  doingTask: Task | null;
  now: number;
  setSelectedDate: (d: string) => void;
  setActiveTag: (t: string | null) => void;
  createTask: (input: NewTaskInput) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setStatus: (id: string, status: Status) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  finishTask: (id: string) => void;
  addCustomTag: (tag: string) => void;
  tasksForDate: (iso: string) => Task[];
  effectiveSeconds: (task: Task) => number;
  streak: number;
  weekStats: { iso: string; completed: number; seconds: number }[];
}

const TaskCtx = createContext<Ctx | null>(null);

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ── Supabase row helpers ─────────────────────────────────────────────────────

function taskToRow(task: Task, userId: string) {
  return {
    id: task.id,
    user_id: userId,
    title: task.title,
    description: task.description,
    date: task.date,
    time: task.time,
    tags: task.tags,
    priority: task.priority,
    status: task.status,
    created_at: task.createdAt,
    completed_at: task.completedAt ?? null,
    time_spent: task.timeSpent,
    timer_started_at: task.timerStartedAt ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTask(row: Record<string, any>): Task {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? "",
    date: row.date as string,
    time: (row.time as string) ?? "",
    tags: (row.tags as string[]) ?? [],
    priority: row.priority as Priority,
    status: row.status as Status,
    createdAt: row.created_at as number,
    completedAt: (row.completed_at as number) ?? null,
    timeSpent: (row.time_spent as number) ?? 0,
    timerStartedAt: (row.timer_started_at as number) ?? null,
  };
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [store, setStore] = useState<Store>(() => loadStore());
  const [selectedDate, setSelectedDate] = useState<string>(isoDay());
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  const tickRef = useRef<number | null>(null);
  const storeRef = useRef(store);
  const userIdRef = useRef(userId);

  // Keep refs up to date
  useEffect(() => { storeRef.current = store; }, [store]);
  useEffect(() => { userIdRef.current = userId; }, [userId]);

  // Persist to localStorage
  useEffect(() => { saveStore(store); }, [store]);

  // Clock tick
  useEffect(() => {
    tickRef.current = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { if (tickRef.current) window.clearInterval(tickRef.current); };
  }, []);

  // ── Supabase: load on login ──────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;

    // Load tasks from Supabase
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .then(({ data, error }) => {
        if (error || !data) return;

        if (data.length > 0) {
          // Supabase has data → use it as source of truth
          setStore((prev) => ({ ...prev, tasks: data.map(rowToTask) }));
        } else {
          // Supabase is empty → upload local tasks
          const localTasks = storeRef.current.tasks;
          if (localTasks.length > 0) {
            const rows = localTasks.map((t) => taskToRow(t, userId));
            supabase.from("tasks").upsert(rows).then();
          }
        }
      });

    // Load custom tags from Supabase
    supabase
      .from("custom_tags")
      .select("tags")
      .eq("user_id", userId)
      .single()
      .then(({ data }) => {
        if (data?.tags?.length) {
          setStore((prev) => ({ ...prev, customTags: data.tags as string[] }));
        } else {
          // Upload local tags
          const localTags = storeRef.current.customTags;
          if (localTags.length > 0) {
            supabase
              .from("custom_tags")
              .upsert({ user_id: userId, tags: localTags })
              .then();
          }
        }
      });
  }, [userId]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const allTags = useMemo(() => {
    const set = new Set<string>([...DEFAULT_TAGS, ...store.customTags]);
    return Array.from(set);
  }, [store.customTags]);

  const doingTask = useMemo(
    () => store.tasks.find((t) => t.status === "doing" && t.timerStartedAt !== null) ?? null,
    [store.tasks],
  );

  const effectiveSeconds = useCallback(
    (task: Task) => {
      if (task.timerStartedAt) {
        return task.timeSpent + Math.floor((now - task.timerStartedAt) / 1000);
      }
      return task.timeSpent;
    },
    [now],
  );

  const mutate = useCallback((fn: (s: Store) => Store) => {
    setStore((prev) => fn(prev));
  }, []);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const createTask = useCallback<Ctx["createTask"]>(
    (input) => {
      const task: Task = {
        id: uid(),
        title: input.title.trim(),
        description: input.description?.trim() ?? "",
        date: input.date,
        time: input.time ?? "",
        tags: input.tags,
        priority: input.priority,
        status: "todo",
        createdAt: Date.now(),
        completedAt: null,
        timeSpent: 0,
        timerStartedAt: null,
      };
      mutate((s) => ({ ...s, tasks: [...s.tasks, task] }));

      const uid_ = userIdRef.current;
      if (uid_) supabase.from("tasks").insert(taskToRow(task, uid_)).then();

      toast.success("Tarefa criada");
      return task;
    },
    [mutate],
  );

  const updateTask = useCallback<Ctx["updateTask"]>(
    (id, patch) => {
      mutate((s) => ({
        ...s,
        tasks: s.tasks.map((t) => {
          if (t.id !== id) return t;
          const updated = { ...t, ...patch };
          const uid_ = userIdRef.current;
          if (uid_) supabase.from("tasks").upsert(taskToRow(updated, uid_)).then();
          return updated;
        }),
      }));
    },
    [mutate],
  );

  const deleteTask = useCallback<Ctx["deleteTask"]>(
    (id) => {
      mutate((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
      const uid_ = userIdRef.current;
      if (uid_) supabase.from("tasks").delete().eq("id", id).then();
      toast("Tarefa removida", { icon: "🗑️" });
    },
    [mutate],
  );

  const startTimer = useCallback<Ctx["startTimer"]>(
    (id) => {
      const ts = Date.now();
      mutate((s) => {
        const tasks = s.tasks.map((t) => {
          if (t.id === id) {
            const updated = { ...t, status: "doing" as Status, timerStartedAt: ts };
            const uid_ = userIdRef.current;
            if (uid_) supabase.from("tasks").upsert(taskToRow(updated, uid_)).then();
            return updated;
          }
          if (t.timerStartedAt) {
            const extra = Math.floor((ts - t.timerStartedAt) / 1000);
            const updated = { ...t, timeSpent: t.timeSpent + extra, timerStartedAt: null };
            const uid_ = userIdRef.current;
            if (uid_) supabase.from("tasks").upsert(taskToRow(updated, uid_)).then();
            return updated;
          }
          return t;
        });
        return { ...s, tasks };
      });
    },
    [mutate],
  );

  const pauseTimer = useCallback<Ctx["pauseTimer"]>(
    (id) => {
      const ts = Date.now();
      mutate((s) => ({
        ...s,
        tasks: s.tasks.map((t) => {
          if (t.id !== id) return t;
          if (!t.timerStartedAt) return t;
          const extra = Math.floor((ts - t.timerStartedAt) / 1000);
          const updated = { ...t, timeSpent: t.timeSpent + extra, timerStartedAt: null };
          const uid_ = userIdRef.current;
          if (uid_) supabase.from("tasks").upsert(taskToRow(updated, uid_)).then();
          return updated;
        }),
      }));
    },
    [mutate],
  );

  const setStatus = useCallback<Ctx["setStatus"]>(
    (id, status) => {
      const ts = Date.now();
      mutate((s) => ({
        ...s,
        tasks: s.tasks.map((t) => {
          if (t.id !== id) return t;
          let timeSpent = t.timeSpent;
          let timerStartedAt = t.timerStartedAt;
          if (t.timerStartedAt && status !== "doing") {
            timeSpent += Math.floor((ts - t.timerStartedAt) / 1000);
            timerStartedAt = null;
          }
          const completedAt = status === "done" ? ts : null;
          const updated = { ...t, status, timeSpent, timerStartedAt, completedAt };
          const uid_ = userIdRef.current;
          if (uid_) supabase.from("tasks").upsert(taskToRow(updated, uid_)).then();
          return updated;
        }),
      }));
    },
    [mutate],
  );

  const finishTask = useCallback<Ctx["finishTask"]>(
    (id) => {
      const ts = Date.now();
      let totalSeconds = 0;
      mutate((s) => {
        const tasks = s.tasks.map((t) => {
          if (t.id !== id) return t;
          let timeSpent = t.timeSpent;
          if (t.timerStartedAt) timeSpent += Math.floor((ts - t.timerStartedAt) / 1000);
          totalSeconds = timeSpent;
          const updated = {
            ...t,
            status: "done" as Status,
            completedAt: ts,
            timeSpent,
            timerStartedAt: null,
          };
          const uid_ = userIdRef.current;
          if (uid_) supabase.from("tasks").upsert(taskToRow(updated, uid_)).then();
          return updated;
        });
        return { ...s, tasks };
      });
      celebrate();
      const mins = Math.max(1, Math.round(totalSeconds / 60));
      toast.success(`Finalizou em ${mins}min ✨`);
    },
    [mutate],
  );

  const addCustomTag = useCallback<Ctx["addCustomTag"]>(
    (tag) => {
      const trimmed = tag.trim();
      if (!trimmed) return;
      mutate((s) => {
        if (s.customTags.includes(trimmed) || DEFAULT_TAGS.includes(trimmed)) return s;
        const newTags = [...s.customTags, trimmed];
        const uid_ = userIdRef.current;
        if (uid_) {
          supabase
            .from("custom_tags")
            .upsert({ user_id: uid_, tags: newTags })
            .then();
        }
        return { ...s, customTags: newTags };
      });
    },
    [mutate],
  );

  const tasksForDate = useCallback<Ctx["tasksForDate"]>(
    (iso) =>
      store.tasks
        .filter((t) => t.date === iso)
        .sort((a, b) => {
          if (a.time && b.time) return a.time.localeCompare(b.time);
          if (a.time) return -1;
          if (b.time) return 1;
          return a.createdAt - b.createdAt;
        }),
    [store.tasks],
  );

  const streak = useMemo(() => {
    const days = new Set(
      store.tasks
        .filter((t) => t.status === "done" && t.completedAt)
        .map((t) => isoDay(new Date(t.completedAt!))),
    );
    if (days.size === 0) return 0;
    let count = 0;
    let cursor = isoDay();
    if (!days.has(cursor)) cursor = addDays(cursor, -1);
    while (days.has(cursor)) {
      count += 1;
      cursor = addDays(cursor, -1);
    }
    return count;
  }, [store.tasks]);

  const weekStats = useMemo(() => {
    const days = weekDays(selectedDate);
    return days.map((iso) => {
      const dayTasks = store.tasks.filter((t) => t.date === iso);
      const completed = dayTasks.filter((t) => t.status === "done").length;
      const seconds = dayTasks.reduce((acc, t) => acc + t.timeSpent, 0);
      return { iso, completed, seconds };
    });
  }, [store.tasks, selectedDate]);

  const value: Ctx = {
    tasks: store.tasks,
    allTags,
    selectedDate,
    activeTag,
    doingTask,
    now,
    setSelectedDate,
    setActiveTag,
    createTask,
    updateTask,
    deleteTask,
    setStatus,
    startTimer,
    pauseTimer,
    finishTask,
    addCustomTag,
    tasksForDate,
    effectiveSeconds,
    streak,
    weekStats,
  };

  return <TaskCtx.Provider value={value}>{children}</TaskCtx.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskCtx);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}

function celebrate() {
  const origin = { y: 0.35 };
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 45,
    origin,
    colors: ["#CC0420", "#EBD1FF", "#D4F83C", "#A4FEF2", "#ffffff", "#570303"],
  });
}
