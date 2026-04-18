import { motion } from "framer-motion";
import { useTasks } from "../context/TaskContext";
import { formatDuration, formatLongDate, isoDay } from "../lib/time";
import { PoieoMonograma } from "./Logo";

export function DayProgress() {
  const { selectedDate, tasksForDate, streak, effectiveSeconds } = useTasks();
  const tasks = tasksForDate(selectedDate);
  const total = tasks.length;
  const done  = tasks.filter(t => t.status === "done").length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);
  const seconds = tasks.reduce((acc, t) => acc + effectiveSeconds(t), 0);
  const isToday = selectedDate === isoDay();

  const headline =
    total === 0 ? "sem tarefas ainda."
    : done === total && total > 0 ? "tudo feito. 🎉"
    : `${done} de ${total} concluídas.`;

  return (
    <section className="billboard" aria-label="progresso do dia">
      {/* ── Panel 1 – RED ─────────────────────────────── */}
      <div className="billboard-panel bb-red">
        <div>
          <p className="bb-eyebrow">
            {isToday ? "seu dia" : formatLongDate(selectedDate)}
          </p>
          <h2 className="bb-headline">{headline}</h2>
        </div>
        <p className="bb-subline">
          {seconds > 0 ? `${formatDuration(seconds)} focada hoje` : "clique ▶ para começar"}
        </p>
      </div>

      {/* ── Panel 2 – WHITE / bracket percentage ──────── */}
      <div className="billboard-panel bb-white">
        <div>
          <p className="bb-eyebrow">progresso</p>
          <div className="bracket-wrap">
            <span className="bracket">[</span>
            <span className="bb-pct">{pct}%</span>
            <span className="bracket">]</span>
          </div>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
          <p className="bb-task-count">
            {total === 0 ? "nenhuma tarefa" : `${done} / ${total} tarefas`}
          </p>
        </div>
      </div>

      {/* ── Panel 3 – LILAC / logo + streak ───────────── */}
      <div className="billboard-panel bb-lilac">
        <div className="bb-eyebrow">poieo</div>
        <div className="bb-logo-area">
          <PoieoMonograma size={72} />
        </div>
        <div className="bb-metrics">
          <div className="bb-metric-row">
            <span className="bb-streak-num">{streak}</span>
            <span className="bb-streak-label">dias de streak</span>
          </div>
          <div className="bb-metric-row">
            <span className="bb-metric-val">{done}</span>
            <span className="bb-metric-lbl">finalizadas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
