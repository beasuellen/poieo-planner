import { useEffect, useRef, useState } from "react";

interface Props {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  onAddOption?: (tag: string) => void;
  placeholder?: string;
  allowCreate?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  onAddOption,
  placeholder = "selecionar…",
  allowCreate = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (tag: string) => {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);
  };

  const addCustom = () => {
    const v = draft.trim();
    if (!v) return;
    if (onAddOption) onAddOption(v);
    if (!value.includes(v)) onChange([...value, v]);
    setDraft("");
  };

  return (
    <div className="ms-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`ms-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ms-trigger-content">
          {value.length === 0 ? (
            <span className="ms-placeholder">{placeholder}</span>
          ) : (
            value.map((v) => (
              <span key={v} className="ms-selected-chip">
                {v}
              </span>
            ))
          )}
        </span>
        <span className="ms-caret" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <div className="ms-panel" role="listbox">
          {options.map((opt) => {
            const selected = value.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                className={`ms-option ${selected ? "selected" : ""}`}
                onClick={() => toggle(opt)}
              >
                <input type="checkbox" readOnly checked={selected} />
                <span>{opt}</span>
              </button>
            );
          })}
          {allowCreate ? (
            <div
              className="ms-add"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                placeholder="nova tag"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustom();
                  }
                }}
              />
              <button type="button" onClick={addCustom}>
                adicionar
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
