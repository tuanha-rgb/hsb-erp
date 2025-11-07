import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// Value must be your union type
export type RoleValue = "admin" | "student" | "lecturer" | "faculty" | "department";

type Option = { value: RoleValue; label: string };

interface Props {
  value: RoleValue;
  onChange: (v: RoleValue) => void;
  options: Option[];
  className?: string;
}

/**
 * Tailwind-styled, keyboard-accessible dropdown
 * - No external libs
 * - Click outside to close
 */
export default function RoleDropdown({ value, onChange, options, className }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (popRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const current = options.find(o => o.value === value)?.label ?? "Select";
const [currentRole, setCurrentRole] = useState<'student' | 'staff' | 'management'>('staff');

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        className="
          w-full px-3 py-2 rounded-xl
          bg-slate-800/60 hover:bg-slate-800
          border border-slate-600/50
          text-slate-100 text-sm
          flex items-center justify-between
          shadow-inner
        "
      >
        <span className="truncate">{current}</span>
        <ChevronDown size={16} className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          ref={popRef}
          className="
            absolute z-50 mt-2 w-full
            rounded-xl border border-slate-700/60
            bg-slate-800/95 backdrop-blur
            shadow-lg overflow-hidden
          "
        >
          <ul className="max-h-64 overflow-auto py-1">
            {options.map(opt => {
              const active = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`
                      w-full text-left px-3 py-2 text-sm
                      ${active ? "bg-slate-700 text-white" : "text-slate-100 hover:bg-slate-700/60"}
                    `}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
