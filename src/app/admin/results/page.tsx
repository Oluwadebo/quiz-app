"use client";
import { API_URLS } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import { useEffect, useState } from "react";

interface Result {
  _id: string;
  studentId: { name: string; email: string };
  testId: { title: string; level: string };
  courseId: { title: string };
  score: number;
  passed: boolean;
  status: string;
  createdAt: string;
}

export default function AdminResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URLS.admin}/results`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-1">
          ADMIN / RESULTS
        </p>
        <h1 className="text-2xl font-black tracking-tight">
          All Results ({results.length})
        </h1>
      </div>
      {loading ? (
        <p className="font-mono text-[10px] text-[#334155] animate-pulse">
          LOADING...
        </p>
      ) : (
        <div className="bg-[#0D1220] border border-white/5">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5">
            {[
              { l: "STUDENT", s: "col-span-3" },
              { l: "TEST", s: "col-span-3" },
              { l: "COURSE", s: "col-span-2" },
              { l: "SCORE", s: "col-span-2" },
              { l: "STATUS", s: "col-span-2" },
            ].map(({ l, s }) => (
              <p
                key={l}
                className={`font-mono text-[9px] text-[#334155] tracking-[.2em] ${s}`}
              >
                {l}
              </p>
            ))}
          </div>
          {results.length === 0 ? (
            <p className="font-mono text-[10px] text-[#334155] p-8 text-center">
              NO RESULTS YET
            </p>
          ) : (
            results.map((r) => (
              <div
                key={r._id}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] items-center"
              >
                <div className="col-span-3">
                  <p className="text-sm font-medium">{r.studentId?.name}</p>
                  <p className="font-mono text-[9px] text-[#334155]">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="col-span-3 text-sm text-[#94A3B8]">
                  {r.testId?.title}
                </p>
                <p className="col-span-2 font-mono text-[9px] text-[#64748B]">
                  {r.courseId?.title}
                </p>
                <p
                  className={`col-span-2 font-mono text-sm font-black ${r.passed ? "text-green-400" : "text-red-400"}`}
                >
                  {r.score}%
                </p>
                <span
                  className={`col-span-2 font-mono text-[9px] px-2 py-0.5 w-fit ${r.passed ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}
                >
                  {r.passed ? "PASS" : "FAIL"}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
