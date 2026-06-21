"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isLoggedIn, isAdmin, removeToken } from "@/lib/auth";

const navItems = [
  { label: "OVERVIEW", href: "/admin", icon: "▤" },
  { label: "COURSES", href: "/admin/courses", icon: "📚" },
  { label: "STUDENTS", href: "/admin/students", icon: "👥" },
  { label: "RESULTS", href: "/admin/results", icon: "📊" },
  { label: "SETTINGS", href: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn() || !isAdmin()) router.replace("/login");
  }, [router]);

  if (!mounted) return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
      <p className="font-mono text-[10px] text-[#334155] tracking-widest animate-pulse">LOADING...</p>
    </div>
  );

  const handleLogout = () => { removeToken(); router.push("/"); };

  return (
    <div className="min-h-screen bg-[#080C14] text-white flex">
      <aside className="w-52 bg-[#0D1220] border-r border-white/5 flex flex-col fixed top-0 left-0 bottom-0">
        <div className="px-5 py-5 border-b border-white/5">
          <p className="font-mono text-[13px] tracking-[.2em] text-[#3B82F6]">QUIZAPP</p>
          <p className="font-mono text-[9px] tracking-[.2em] text-[#334155] mt-0.5">ADMIN PANEL</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 font-mono text-[10px] tracking-[.15em] transition-all ${
                  active ? "bg-[#3B82F6]/10 text-[#3B82F6] border-l-2 border-[#3B82F6]" : "text-[#64748B] hover:text-white hover:bg-white/5"
                }`}>
                <span>{item.icon}</span>{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/5 space-y-1">
          <Link href="/?preview=true" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 font-mono text-[10px] tracking-[.15em] text-[#64748B] hover:text-white transition-colors">
            ↗ VIEW SITE
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 font-mono text-[10px] tracking-[.15em] text-white bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-400 transition-all">
            ✕ LOGOUT
          </button>
        </div>
      </aside>
      <main className="ml-52 flex-1 min-h-screen">{children}</main>
    </div>
  );
}
