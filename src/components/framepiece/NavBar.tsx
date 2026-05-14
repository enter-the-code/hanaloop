"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Menu, X, Leaf } from "lucide-react";

const NAV = [
  { href: "/",      label: "Overview", icon: LayoutDashboard },
  { href: "/notes", label: "Notes",    icon: FileText        },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const content = (
    <div className="flex h-full flex-col bg-slate-950 w-56">
      <div className="flex h-14 items-center gap-2 px-5 border-b border-slate-800">
        <Leaf className="h-5 w-5 text-emerald-500" />
        <span className="text-sm font-bold text-slate-100 tracking-tight">HanaLoop</span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-5 py-4 text-xs text-slate-600">
        GHG Protocol · ISO 14067
      </div>
    </div>
  );

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 rounded-lg bg-slate-900 p-2 text-slate-400 md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="메뉴"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 transition-transform duration-200 md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {content}
      </aside>
    </>
  );
}
