import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Priority } from "../types";
import { useTasks } from "../context/TaskContext";
import { PRIORITY_LABEL } from "../lib/tags";
import { MultiSelect } from "./MultiSelect";

interface Props { open: boolean; onClose: () => void; }
const PRIORITIES: Priority[] = ["high","medium","low"];

export function NewTaskModal({ open, onClose }: Props) {
  const { allTags, selectedDate, createTask, addCustomTag } = useTasks();
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [date,        setDate]        = useState(selectedDate);
  const [time,        setTime]        = useState("");
  const [priority,    setPriority]    = useState<Priority>("medium");
  const [tags,        setTags]        = useState<string[]>([]);

  useEffect(() => {
    if (open) { setTitle(""); setDescription(""); setDate(selectedDate); setTime(""); setPriority("medium"); setTags([]); }
  }, [open, selectedDate]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTask({ title, description, date, time, tags, priority });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.form
            onSubmit={submit}
            className="modal new-task-modal"
            initial={{ opacity: 0, y: 14, scale: .98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: .98 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
          >
            <header className="modal-head">
              <span className="eyebrow">nova tarefa</span>
              <button type="button" className="icon-btn dark" onClick={onClose}>✕</button>
            </header>

            <input
              autoFocus
              className="title-input"
              placeholder="O que você quer fazer?"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <textarea
              className="desc-input"
              placeholder="descrição (opcional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <div className="modal-row">
              <label className="field">
                <span>data</span>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </label>
              <label className="field">
                <span>horário</span>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} />
              </label>
            </div>

            <div className="modal-row">
              <label className="field">
                <span>prioridade</span>
                <select value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
                </select>
              </label>
              <div className="field">
                <span>tags</span>
                <MultiSelect
                  options={allTags}
                  value={tags}
                  onChange={setTags}
                  onAddOption={addCustomTag}
                  allowCreate
                  placeholder="escolha uma ou mais"
                />
              </div>
            </div>

            <footer className="modal-foot">
              <button type="button" className="btn btn-ghost" onClick={onClose}>cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={!title.trim()}>criar tarefa</button>
            </footer>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
