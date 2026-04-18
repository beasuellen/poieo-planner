import { useTasks } from "../context/TaskContext";
import { formatShortWeekday, isoDay } from "../lib/time";

export function WeekChart() {
  const { weekStats, selectedDate, setSelectedDate } = useTasks();
  const maxCompleted = Math.max(1, ...weekStats.map(d => d.completed));
  const today = isoDay();

  return (
    <section className="card week-card">
      <div className="card-label">semana</div>
      <div className="week-chart">
        {weekStats.map(d => {
          const pct = (d.completed / maxCompleted) * 100;
          const isSelected = d.iso === selectedDate;
          const isToday = d.iso === today;
          return (
            <button
              key={d.iso}
              className={`week-bar${isSelected ? " active" : ""}${isToday ? " is-today" : ""}`}
              onClick={() => setSelectedDate(d.iso)}
              title={d.iso}
            >
              <div className="bar-track">
                <div className="bar-fill" style={{ height: `${pct}%` }} />
              </div>
              <span className="bar-label">{formatShortWeekday(d.iso)}</span>
              <span className="bar-value">{d.completed}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
