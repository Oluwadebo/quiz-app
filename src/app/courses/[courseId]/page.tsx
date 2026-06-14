"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { isLoggedIn, authHeaders } from "@/lib/auth";
import { API_URLS } from "@/lib/api";
import { Course, Test } from "@/types";

const levelColors: Record<string, string> = {
  beginner: "text-green-400 border-green-400/20 bg-green-400/5",
  intermediate: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
  advanced: "text-red-400 border-red-400/20 bg-red-400/5",
};

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [tests, setTests] = useState<(Test & { unlocked: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/login"); return; }
    fetch(`${API_URLS.courses}/${courseId}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => { setCourse(data.course); setTests(data.tests || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId, router]);

  const handleStartTest = async (testId: string) => {
    setStarting(testId); setError("");
    try {
      const res = await fetch(`${API_URLS.sessions}/start`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ testId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to start test"); return; }
      router.push(`/test/${data.session._id}`);
    } catch { setError("Cannot connect to server"); }
    finally { setStarting(null); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
      <p className="font-mono text-[10px] text-[#334155] tracking-widest animate-pulse">LOADING...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="font-mono text-[10px] text-[#64748B] hover:text-white tracking-widest">← DASHBOARD</Link>
        <span className="text-[#334155]">/</span>
        <p className="font-mono text-[10px] text-[#3B82F6] tracking-widest">{course?.title?.toUpperCase()}</p>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-2">{course?.topic?.toUpperCase()} COURSE</p>
          <h1 className="text-3xl font-black tracking-tight mb-2">{course?.title}</h1>
          <p className="text-[#64748B]">{course?.description}</p>
        </div>

        {error && <p className="font-mono text-[10px] text-red-400 border border-red-400/20 bg-red-400/5 px-3 py-2 mb-6">✗ {error.toUpperCase()}</p>}

        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={test._id} className={`bg-[#0D1220] border p-6 ${test.unlocked ? "border-white/5" : "border-white/5 opacity-60"}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[10px] text-[#334155]">0{index + 1}</span>
                    <span className={`font-mono text-[9px] px-2 py-0.5 border ${levelColors[test.level]}`}>
                      {test.level.toUpperCase()}
                    </span>
                    {!test.unlocked && <span className="font-mono text-[9px] text-[#334155]">🔒 LOCKED</span>}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{test.title}</h3>
                  <div className="flex gap-4 font-mono text-[9px] text-[#64748B]">
                    <span>{test.questionCount} QUESTIONS</span>
                    <span>{test.timeLimit} MINUTES</span>
                    <span>PASS: {test.passMark}%</span>
                    {test.level !== "advanced" && <span>{test.maxAttemptsPerWeek}x/WEEK</span>}
                    {test.level === "advanced" && <span>UNLIMITED ATTEMPTS</span>}
                  </div>
                </div>
                <div>
                  {test.unlocked ? (
                    <button onClick={() => handleStartTest(test._id)}
                      disabled={starting === test._id}
                      className="font-mono text-[11px] px-5 py-2.5 bg-[#3B82F6] text-white tracking-[.1em] hover:bg-[#2563EB] transition-colors disabled:opacity-50">
                      {starting === test._id ? "STARTING..." : "START TEST"}
                    </button>
                  ) : (
                    <p className="font-mono text-[9px] text-[#334155] tracking-widest">PASS {tests[index-1]?.level?.toUpperCase()} FIRST</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard link */}
        <div className="mt-8 text-center">
          <Link href={`/leaderboard/${courseId}`}
            className="font-mono text-[10px] text-[#3B82F6] tracking-widest hover:underline">
            🏆 VIEW LEADERBOARD →
          </Link>
        </div>
      </div>
    </div>
  );
}