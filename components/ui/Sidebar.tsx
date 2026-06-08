"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FileText, Plus, LogOut } from "lucide-react";
import { initials } from "@/utils/format";
import { cn } from "@/utils/cn";

const nav = [
  { href: "/dashboard", label: "Notes", icon: FileText },
  { href: "/notes/new", label: "New note", icon: Plus },
];

export default function Sidebar({
  user,
}: {
  user: { name?: string | null; email?: string | null };
}) {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center shrink-0 transition-transform hover:scale-110 duration-150">
            <span className="text-white text-[10px] font-bold tracking-tight">SN</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 tracking-tight">
            Study Notes
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-1 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                active
                  ? "bg-gray-50 text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {/* Active left indicator */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-black rounded-full" />
              )}
              <Icon
                size={15}
                strokeWidth={active ? 2.5 : 1.75}
                className="transition-transform duration-150 group-hover:scale-110"
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-semibold">
              {initials(user.name ?? "U")}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
