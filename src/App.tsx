import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AuthGate } from "./components/AuthGate";
import { TaskProvider, useTasks } from "./context/TaskContext";
import { Header } from "./components/Header";
import { MiniCalendar } from "./components/MiniCalendar";
import { DayProgress } from "./components/DayProgress";
import { DoingBanner } from "./components/DoingBanner";
import { WeekChart } from "./components/WeekChart";
import { TaskList } from "./components/TaskList";
import { TaskModal } from "./components/TaskModal";
import { NewTaskModal } from "./components/NewTaskModal";

export default function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <AppContent />
      </AuthGate>
    </AuthProvider>
  );
}

function fmt(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function TitleSync() {
  const { doingTask, effectiveSeconds } = useTasks();

  useEffect(() => {
    if (doingTask?.timerStartedAt) {
      const secs = effectiveSeconds(doingTask);
      document.title = `▶ ${fmt(secs)} · ${doingTask.title}`;
    } else if (doingTask) {
      document.title = `⏸ ${doingTask.title} · Poieo`;
    } else {
      document.title = "Poieo · Planner";
    }
  });

  return null;
}

function AppContent() {
  const [newOpen, setNewOpen] = useState(false);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "n" && !newOpen && !openTaskId) {
        const el = document.activeElement;
        if (el && /INPUT|TEXTAREA/.test(el.tagName)) return;
        setNewOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [newOpen, openTaskId]);

  return (
    <TaskProvider>
      <TitleSync />
      <div className="app-shell">
        <Header />
        <DoingBanner onOpen={setOpenTaskId} />
        <main className="app-main">
          <aside className="side">
            <MiniCalendar />
          </aside>
          <section className="center">
            <DayProgress />
            <TaskList onOpen={setOpenTaskId} />
          </section>
          <aside className="side side-right">
            <WeekChart />
            <div className="card hint-card">
              <div className="card-label">[ dica ]</div>
              <p>
                Aperte <kbd>N</kbd> para criar uma nova tarefa. Só uma tarefa pode estar
                <strong> em andamento</strong> por vez — foco real, sem multitarefa.
              </p>
            </div>
          </aside>
        </main>
        <button
          className="fab"
          onClick={() => setNewOpen(true)}
          aria-label="Nova tarefa"
        >
          +
        </button>
        <NewTaskModal open={newOpen} onClose={() => setNewOpen(false)} />
        <TaskModal taskId={openTaskId} onClose={() => setOpenTaskId(null)} />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              fontFamily: "'Instrument Sans', system-ui, sans-serif",
              borderRadius: 14,
              padding: "10px 14px",
              background: "#570303",
              color: "#fff",
              fontSize: 14,
            },
          }}
        />
      </div>
    </TaskProvider>
  );
}
