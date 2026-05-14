"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface ToastProps {
  type: "success" | "error";
  message: string;
  onDismiss: () => void;
}

export default function Toast({ type, message, onDismiss }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onDismiss, 3000);
    return () => clearTimeout(id);
  }, [onDismiss]);

  return (
    <div className={[
      "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg text-sm font-medium",
      type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white",
    ].join(" ")}>
      {type === "success"
        ? <CheckCircle className="h-4 w-4 shrink-0" />
        : <XCircle className="h-4 w-4 shrink-0" />
      }
      <span>{message}</span>
    </div>
  );
}
