export function isoDay(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseIsoDay(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(iso: string, delta: number): string {
  const d = parseIsoDay(iso);
  d.setDate(d.getDate() + delta);
  return isoDay(d);
}

export function formatLongDate(iso: string): string {
  const d = parseIsoDay(iso);
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export function formatShortWeekday(iso: string): string {
  const d = parseIsoDay(iso);
  return d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
}

export function formatHMS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}min`;
  if (m > 0) return `${m}min`;
  return `${s}s`;
}

export function startOfWeek(iso: string): string {
  const d = parseIsoDay(iso);
  const wd = d.getDay();
  const diff = wd === 0 ? -6 : 1 - wd;
  d.setDate(d.getDate() + diff);
  return isoDay(d);
}

export function weekDays(anchorIso: string): string[] {
  const start = startOfWeek(anchorIso);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function buildMonthGrid(anchorIso: string): { days: (string | null)[]; monthLabel: string } {
  const base = parseIsoDay(anchorIso);
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const startWd = first.getDay();
  const offset = startWd === 0 ? 6 : startWd - 1;
  const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(base.getFullYear(), base.getMonth(), day);
    cells.push(isoDay(d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const monthLabel = base.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return { days: cells, monthLabel };
}
