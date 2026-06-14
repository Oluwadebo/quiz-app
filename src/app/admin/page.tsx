"use client";
import { useEffect, useState } from "react";
import { authHeaders } from "@/lib/auth";
import { API_URLS } from "@/lib/api";
import Link from "next/link";

interface Stats { totalStudents: number; totalSessions: number; passedSessions: number; passRate: number; totalCourses: number; }

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URLS.admin}/stats`, { headers: authHeaders() })
      .then((r) => r.json()).then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-1">ADMIN / OVERVIEW</p>
        <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-24 bg-[#0D1220] border border-white/5 animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "TOTAL STUDENTS", value: stats?.totalStudents ?? 0 },
              { label: "TOTAL TESTS TAKEN", value: stats?.totalSessions ?? 0 },
              { label: "PASSED", value: stats?.passedSessions ?? 0 },
              { label: "PASS RATE", value: `${stats?.passRate ?? 0}%` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#0D1220] border border-white/5 p-5">
                <p className="font-mono text-[9px] text-[#334155] tracking-[.2em] mb-2">{label}</p>
                <p className="text-3xl font-black">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Manage Courses", href: "/admin/courses", desc: "Add, edit or delete courses and tests" },
              { label: "View Students", href: "/admin/students", desc: "See all registered students" },
              { label: "View Results", href: "/admin/results", desc: "See all test results and scores" },
            ].map(({ label, href, desc }) => (
              <Link key={href} href={href} className="bg-[#0D1220] border border-white/5 p-5 hover:border-[#3B82F6]/30 transition-all">
                <p className="font-bold mb-1">{label}</p>
                <p className="text-[#64748B] text-xs">{desc}</p>
                <p className="font-mono text-[9px] text-[#3B82F6] mt-3 tracking-widest">OPEN →</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}