"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import { createPortal } from "react-dom";
import { HelpCircle } from "lucide-react";

export default function Tooltip({ content, children }: { content: string; children?: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!visible || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({
      top:  rect.top + window.scrollY,
      left: rect.left + rect.width / 2,
    });
  }, [visible]);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        ref={btnRef}
        type="button"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className={children ? "cursor-default" : "text-slate-500 hover:text-slate-300 transition-colors"}
        aria-label="도움말"
      >
        {children ?? <HelpCircle className="h-3.5 w-3.5" />}
      </button>

      {visible && typeof document !== "undefined" && createPortal(
        <span
          style={{
            position:  "absolute",
            top:       pos.top,
            left:      pos.left,
            transform: "translate(-50%, calc(-100% - 10px))",
            zIndex:    9999,
            pointerEvents: "none",
            width:     224,
          }}
          className="rounded-lg bg-slate-700 px-3 py-2 text-xs leading-relaxed text-slate-200 shadow-xl ring-1 ring-slate-600"
        >
          {content}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
        </span>,
        document.body
      )}
    </span>
  );
}
