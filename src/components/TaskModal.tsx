import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Priority, Status, Task } from "../types";
import { useTasks } from "../context/TaskContext";
import { formatDuration, formatHMS } from "../lib/time";
import { PRIORITY_LABEL, STATUS_LABEL } from "../lib/tags";
import { MultiSelect } from "./MultiSelect";

interface Props { taskId: string | null; onClose: () => void; }

const STATUSES:  Status[]   = ["todo","doing","done","onhold"];
const PRIORITIES: Priority[] = ["high","medium","low"];

export function TaskModal({ taskId, onClose }: Props) {
  const { tasks, allTags, updateTask, deleteTask, startTimer, pauseTimer, finishTask, setStatus, effectiveSeconds, addCustomTag } = useTasks();

  const task  = tasks.find(t => t.id === taskId) ?? null;
  const [draft, setDraft] = useState<Task | null>(task);

  useEffect(() => { setDraft(task); }, [task?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (task) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [task, onClose]);

  if (!task || !draft) return null;

  const isDoing  = task.status === "doing" && task.timerStartedAt !== null;
  const seconds  = effectiveSeconds(task);
  const commit   = (patch: Partial<Task>) => { setDraft({ ...draft, ...patch }); updateTask(task.id, patch); };

  return (
    <AnimatePresence>
      <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div
          className="modal task-modal" role="dialog" aria-modal="true"
          initial={{ opacity: 0, y: 14, scale: .98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: .98 }}
          transition={{ duration: 0.2 }}
          onClick={e => e.stopPropagation()}
        >
          <header className="modal-head">
            <span className="eyebrow">detalhes da tarefa</span>
            <button className="icon-btn dark" onClick={onClose} aria-label="fechar">✕</button>
          </header>

          <input
            className="title-input"
            value={draft.title}
            onChange={e => setDraft({ ...draft, title: e.target.value })}
            onBlur={() => commit({ title: draft.title.trim() || "Sem título" })}
          />

          <textarea
            className="desc-input"
            placeholder="descrição (opcional)"
            value={draft.description}
            onChange={e => setDraft({ ...draft, description: e.target.value })}
            onBlur={() => commit({ description: draft.description })}
          />

          <div className="modal-row">
            <label className="field">
              <span>data</span>
              <input type="date" value={draft.date} onChange={e => commit({ date: e.target.value })} />
            </label>
            <label className="field">
              <span>horário</span>
              <input type="time" value={draft.time} onChange={e => commit({ time: e.target.value })} />
            </label>
          </div>

          <div className="modal-row">
            <label className="field">
              <span>prioridade</span>
              <select value={draft.priority} onChange={e => commit({ priority: e.target.value as Priority })}>
                {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
              </select>
            </label>
            <label className="field">
              <span>status</span>
              <select value={draft.status} onChange={e => setStatus(task.id, e.target.value as Status)}>
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </label>
          </div>

          <div className="field">
            <span>tags</span>
            <MultiSelect
              options={allTags}
              value={draft.tags}
              onChange={next => commit({ tags: next })}
              onAddOption={addCustomTag}
              allowCreate
              placeholder="escolha uma ou mais"
            />
          </div>

          {/* Timer */}
          <div className="timer-box">
            <div>
              <div className="eyebrow">timer</div>
              <div className="timer-display big" aria-live="polite">
                {isDoing ? <span className="tick" aria-hidden /> : null}
                {formatHMS(seconds)}
              </div>
              {task.status === "done" && (
                <p className="timer-note">Você ficou <strong>{formatDuration(seconds)}</strong> nesta tarefa.</p>
              )}
            </div>
            <div className="timer-actions">
              {isDoing
                ? <button className="btn btn-ghost" onClick={() => pauseTimer(task.id)}>pause</button>
                : <button className="btn btn-primary" onClick={() => startTimer(task.id)}>iniciar</button>
              }
              <button className="btn btn-primary" onClick={() => finishTask(task.id)}>finalizar</button>
            </div>
          </div>

          <footer className="modal-foot">
            <button className="btn btn-danger" onClick={() => { if (confirm("Deletar esta tarefa?")) { deleteTask(task.id); onClose(); } }}>
              deletar
            </button>
            <button className="btn btn-ghost" onClick={onClose}>fechar</button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
