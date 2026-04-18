import { AnimatePresence } from "framer-motion";
import { useTasks } from "../context/TaskContext";
import { TaskCard } from "./TaskCard";

export function TaskList({ onOpen }: { onOpen: (id: string) => void }) {
  const { selectedDate, tasksForDate, activeTag } = useTasks();
  const list = tasksForDate(selectedDate).filter(t =>
    activeTag ? t.tags.includes(activeTag) : true,
  );

  if (list.length === 0) {
    return (
      <div className="empty-card">
        <div className="empty-bracket">[ ]</div>
        <h3 className="empty-title">nada no planner ainda</h3>
        <p className="empty-text">
          Planeje o dia com leveza. Clique em <strong>Nova tarefa</strong> ou pressione <kbd>N</kbd>.
        </p>
      </div>
    );
  }

  const groups: Record<string, typeof list> = { doing: [], todo: [], onhold: [], done: [] };
  list.forEach(t => groups[t.status].push(t));

  const groupLabels: Record<string, string> = {
    doing:  "em andamento",
    todo:   "a fazer",
    onhold: "em espera",
    done:   "concluídas",
  };

  return (
    <div className="task-list">
      <AnimatePresence initial={false}>
        {(["doing", "todo", "onhold", "done"] as const).map(status => {
          if (groups[status].length === 0) return null;
          return (
            <section key={status} className="task-group">
              <h4 className="group-label">{groupLabels[status]}</h4>
              {groups[status].map(task => (
                <TaskCard key={task.id} task={task} onOpen={onOpen} />
              ))}
            </section>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
