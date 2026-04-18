import { AnimatePresence, motion } from "framer-motion";
import { useTasks } from "../context/TaskContext";
import { formatHMS } from "../lib/time";

export function DoingBanner({ onOpen }: { onOpen: (id: string) => void }) {
  const { doingTask, effectiveSeconds, pauseTimer, finishTask, tasksForDate, selectedDate, startTimer } =
    useTasks();

  const pausedDoing = !doingTask
    ? tasksForDate(selectedDate).find(t => t.status === "doing")
    : null;

  const firstAvailable = !doingTask && !pausedDoing
    ? tasksForDate(selectedDate).find(t => t.status === "todo" || t.status === "onhold") ?? null
    : null;

  return (
    <AnimatePresence mode="wait">
      {doingTask ? (
        <motion.section
          key={`running-${doingTask.id}`}
          className="doing-banner running"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          <div className="doing-left">
            <span className="pulse-dot" aria-hidden />
            <div>
              <div className="doing-meta">fazendo agora</div>
              <button className="doing-title link" onClick={() => onOpen(doingTask.id)}>
                {doingTask.title}
              </button>
            </div>
          </div>
          <div className="doing-right">
            <span className="timer-display" aria-live="polite">
              <span className="tick" aria-hidden />
              {formatHMS(effectiveSeconds(doingTask))}
            </span>
            <button className="btn btn-ghost" onClick={() => pauseTimer(doingTask.id)}>pause</button>
            <button className="btn btn-primary" onClick={() => finishTask(doingTask.id)}>finalizar</button>
          </div>
        </motion.section>

      ) : pausedDoing ? (
        <motion.section
          key={`paused-${pausedDoing.id}`}
          className="doing-banner paused"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          <div className="doing-left">
            <span className="pulse-dot" aria-hidden />
            <div>
              <div className="doing-meta">pausada</div>
              <button className="doing-title link" onClick={() => onOpen(pausedDoing.id)}>
                {pausedDoing.title}
              </button>
            </div>
          </div>
          <div className="doing-right">
            <span className="timer-display" aria-live="polite">
              {formatHMS(effectiveSeconds(pausedDoing))}
            </span>
            <button className="btn btn-primary" onClick={() => startTimer(pausedDoing.id)}>retomar</button>
            <button className="btn btn-ghost" onClick={() => finishTask(pausedDoing.id)}>finalizar</button>
          </div>
        </motion.section>

      ) : firstAvailable ? (
        <motion.section
          key={`idle-${firstAvailable.id}`}
          className="doing-banner idle"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          <div className="doing-left">
            <span className="pulse-dot" aria-hidden />
            <div>
              <div className="doing-meta" style={{ color: "var(--ink-muted)" }}>próxima</div>
              <button className="doing-title link" onClick={() => onOpen(firstAvailable.id)}>
                {firstAvailable.title}
              </button>
            </div>
          </div>
          <div className="doing-right">
            <button className="btn btn-primary" onClick={() => startTimer(firstAvailable.id)}>
              ▶ iniciar timer
            </button>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
