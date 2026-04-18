import { useMemo, useState } from "react";
import { useTasks } from "../context/TaskContext";
import { addDays, buildMonthGrid, isoDay, parseIsoDay } from "../lib/time";

const WD = ["S","T","Q","Q","S","S","D"];

export function MiniCalendar() {
  const { selectedDate, setSelectedDate, tasks } = useTasks();
  const [anchor, setAnchor] = useState(selectedDate);
  const today = isoDay();

  const { days, monthLabel } = useMemo(() => buildMonthGrid(anchor), [anchor]);

  const taskDays = useMemo(() => {
    const map = new Map<string, { total: number; done: number }>();
    tasks.forEach(t => {
      const cur = map.get(t.date) ?? { total: 0, done: 0 };
      cur.total += 1;
      if (t.status === "done") cur.done += 1;
      map.set(t.date, cur);
    });
    return map;
  }, [tasks]);

  const shiftMonth = (delta: number) => {
    const d = parseIsoDay(anchor);
    d.setMonth(d.getMonth() + delta, 1);
    setAnchor(isoDay(d));
  };

  return (
    <div className="card mini-cal">
      <div className="mini-cal-head">
        <button className="icon-btn dark" onClick={() => shiftMonth(-1)} aria-label="mês anterior">‹</button>
        <span className="mini-cal-title">{monthLabel}</span>
        <button className="icon-btn dark" onClick={() => shiftMonth(1)} aria-label="próximo mês">›</button>
      </div>

      <div className="mini-cal-weekdays">
        {WD.map((w, i) => <span key={i}>{w}</span>)}
      </div>

      <div className="mini-cal-grid">
        {days.map((iso, idx) => {
          if (!iso) return <span key={idx} className="mini-cal-cell empty" />;
          const info = taskDays.get(iso);
          const classes = ["mini-cal-cell"];
          if (iso === today)         classes.push("today");
          if (iso === selectedDate)  classes.push("selected");
          if (info)                  classes.push("has-tasks");
          return (
            <button key={iso} className={classes.join(" ")} onClick={() => setSelectedDate(iso)}>
              <span>{Number(iso.split("-")[2])}</span>
              {info ? <em>{info.done}/{info.total}</em> : null}
            </button>
          );
        })}
      </div>

      <div className="mini-cal-footer">
        <button className="text-btn" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>‹ ontem</button>
        <button className="text-btn" onClick={() => { setSelectedDate(today); setAnchor(today); }}>hoje</button>
        <button className="text-btn" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>amanhã ›</button>
      </div>
    </div>
  );
}
