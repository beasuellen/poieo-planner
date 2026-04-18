import { motion } from "framer-motion";
import type { Task } from "../types";
import { useTasks } from "../context/TaskContext";
import { formatDuration, formatHMS } from "../lib/time";
import { PRIORITY_LABEL, STATUS_LABEL } from "../lib/tags";

interface Props {
  task: Task;
  onOpen: (id: string) => void;
}

export function TaskCard({ task, onOpen }: Props) {
  const { startTimer, pauseTimer, effectiveSeconds, setStatus } = useTasks();
  const seconds = effectiveSeconds(task);
  const isDoing = task.status === "doing" && task.timerStartedAt !== null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className={`task-card status-${task.status} priority-${task.priority}${isDoing ? " is-doing" : ""}`}
      onClick={() => onOpen(task.id)}
    >
      <div className="task-left">
        {/* Done toggle */}
        <button
          className="status-dot"
          aria-label="marcar como feita"
          onClick={e => {
            e.stopPropagation();
            setStatus(task.id, task.status === "done" ? "todo" : "done");
          }}
        >
          {task.status === "done" ? "✓" : ""}
        </button>

        <div className="task-body">
          <div className="task-line">
            {task.time ? <span className="task-time">{task.time}</span> : null}
            <h3 className="task-title">{task.title}</h3>
          </div>
          {task.description ? <p className="task-desc">{task.description}</p> : null}
          <div className="task-meta">
            <span className="pill priority-pill">{PRIORITY_LABEL[task.priority]}</span>
            <span className="pill status-pill">{STATUS_LABEL[task.status]}</span>
            {task.tags.map(tag => (
              <span key={tag} className="pill tag-pill">{tag}</span>
            ))}
            {seconds > 0 ? (
              <span className="pill time-pill">
                [{task.status === "done" ? formatDuration(seconds) : formatHMS(seconds)}]
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Timer action */}
      <div className="task-actions" onClick={e => e.stopPropagation()}>
        {isDoing ? (
          <button className="btn btn-ghost" onClick={() => pauseTimer(task.id)} aria-label="pausar">⏸</button>
        ) : (
          <button className="btn-play" aria-label="iniciar timer" onClick={() => startTimer(task.id)}>▶</button>
        )}
      </div>
    </motion.article>
  );
}
