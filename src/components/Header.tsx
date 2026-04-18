import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { addDays, formatLongDate, isoDay } from "../lib/time";
import { PoieoWordmark } from "./Logo";

export function Header() {
  const { selectedDate, setSelectedDate } = useTasks();
  const { signOut } = useAuth();
  const isToday = selectedDate === isoDay();

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-logo-wrap">
          <PoieoWordmark size={20} />
        </div>
      </div>

      <div className="header-date">
        <button
          className="icon-btn"
          aria-label="dia anterior"
          onClick={() => setSelectedDate(addDays(selectedDate, -1))}
        >
          ‹
        </button>
        <div className="header-date-text">
          <span className="date-eyebrow">{isToday ? "hoje" : "selecionado"}</span>
          <span className="date-long">{formatLongDate(selectedDate)}</span>
        </div>
        <button
          className="icon-btn"
          aria-label="próximo dia"
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
        >
          ›
        </button>
      </div>

      <button
        className="icon-btn header-signout"
        aria-label="Sair da conta"
        onClick={signOut}
        title="Sair da conta"
      >
        ↩
      </button>
    </header>
  );
}
