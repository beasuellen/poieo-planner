import { useTasks } from "../context/TaskContext";

export function TagFilter() {
  const { allTags, activeTag, setActiveTag, tasks } = useTasks();
  const counts = new Map<string, number>();
  tasks.forEach((t) => t.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));

  return (
    <div className="card tag-filter">
      <div className="card-label">filtrar por tag</div>
      <div className="tag-grid">
        <button
          className={`chip ${activeTag === null ? "chip-on" : ""}`}
          onClick={() => setActiveTag(null)}
        >
          todas
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`chip ${activeTag === tag ? "chip-on" : ""}`}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            {tag}
            {counts.get(tag) ? <em className="chip-count">{counts.get(tag)}</em> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
