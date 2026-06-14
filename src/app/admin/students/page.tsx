"use client";
import { useEffect, useState } from "react";
import { authHeaders } from "@/lib/auth";
import { API_URLS } from "@/lib/api";

interface Student { _id: string; name: string; email: string; createdAt: string; }

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URLS.admin}/students`, { headers: authHeaders() })
      .then((r) => r.json()).then(setStudents).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-1">ADMIN / STUDENTS</p>
        <h1 className="text-2xl font-black tracking-tight">All Students ({students.length})</h1>
      </div>
      {loading ? <p className="font-mono text-[10px] text-[#334155] animate-pulse">LOADING...</p> : (
        <div className="bg-[#0D1220] border border-white/5">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5">
            {[{l:"NAME",s:"col-span-4"},{l:"EMAIL",s:"col-span-5"},{l:"JOINED",s:"col-span-3"}].map(({l,s}) => (
              <p key={l} className={`font-mono text-[9px] text-[#334155] tracking-[.2em] ${s}`}>{l}</p>
            ))}
          </div>
          {students.length === 0 ? (
            <p className="font-mono text-[10px] text-[#334155] p-8 text-center">NO STUDENTS YET</p>
          ) : students.map((s) => (
            <div key={s._id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
              <p className="col-span-4 text-sm font-medium">{s.name}</p>
              <p className="col-span-5 text-sm text-[#64748B] font-mono">{s.email}</p>
              <p className="col-span-3 font-mono text-[9px] text-[#334155]">{new Date(s.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}