"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { isLoggedIn, authHeaders } from "@/lib/auth";
import { API_URLS } from "@/lib/api";
import { SessionResult } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const [result, setResult] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/login"); return; }
    // Get result from session storage or fetch
    const stored = sessionStorage.getItem(`result_${sessionId}`);
    if (stored) {
      setResult(JSON.parse(stored));
      setLoading(false);
      return;
    }
    // Fetch from history
    fetch(`${API_URLS.sessions}/history`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((history) => {
        const session = history.find((h: any) => h._id === sessionId);
        if (session) {
          setResult({
            score: session.score,
            passed: session.passed,
            correct: session.answers?.filter((a: any) => a.isCorrect).length || 0,
            total: session.answers?.length || 0,
            passMark: session.testId?.passMark || 70,
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router, sessionId]);

  if (loading) return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
      <p className="font-mono text-[10px] text-[#334155] tracking-widest animate-pulse">LOADING RESULTS...</p>
    </div>
  );

  if (!result) return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-[10px] text-[#334155] tracking-widest mb-4">RESULTS NOT FOUND</p>
        <Link href="/dashboard" className="font-mono text-[10px] text-[#3B82F6]">← BACK TO DASHBOARD</Link>
      </div>
    </div>
  );

  const percentage = result.score;
  const passed = result.passed;
  const circumference = 2 * Math.PI * 45;
  const strokeDash = (percentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#080C14] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Result badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 border mb-6 font-mono text-[10px] tracking-widest ${
          passed ? "border-green-400/30 bg-green-400/5 text-green-400" : "border-red-400/30 bg-red-400/5 text-red-400"
        }`}>
          {passed ? "✓ TEST PASSED" : "✗ TEST FAILED"}
        </div>

        {/* Score circle */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <svg width="120" height="120" className="-rotate-90">
            <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="60" cy="60" r="45" fill="none"
              stroke={passed ? "#22C55E" : "#EF4444"}
              strokeWidth="8"
              strokeDasharray={`${strokeDash} ${circumference}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          </svg>
          <div className="absolute text-center">
            <p className={`text-3xl font-black ${passed ? "text-green-400" : "text-red-400"}`}>{percentage}%</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-[#0D1220] border border-white/5 p-4">
            <p className="font-mono text-[9px] text-[#334155] tracking-widest mb-1">CORRECT</p>
            <p className="text-2xl font-black text-green-400">{result.correct}</p>
          </div>
          <div className="bg-[#0D1220] border border-white/5 p-4">
            <p className="font-mono text-[9px] text-[#334155] tracking-widest mb-1">WRONG</p>
            <p className="text-2xl font-black text-red-400">{result.total - result.correct}</p>
          </div>
          <div className="bg-[#0D1220] border border-white/5 p-4">
            <p className="font-mono text-[9px] text-[#334155] tracking-widest mb-1">PASS MARK</p>
            <p className="text-2xl font-black text-[#3B82F6]">{result.passMark}%</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-[#64748B] text-sm mb-8">
          {passed
            ? "Great job! You've passed this test. Move on to the next level or try another course."
            : `You needed ${result.passMark}% to pass. Review the material and try again after 12 hours.`}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/dashboard"
            className="w-full py-3 bg-[#3B82F6] text-white font-mono text-[11px] tracking-[.2em] hover:bg-[#2563EB] transition-colors text-center">
            BACK TO DASHBOARD
          </Link>
          <Link href="/dashboard"
            className="w-full py-3 border border-white/10 text-[#64748B] font-mono text-[11px] tracking-[.2em] hover:text-white hover:border-white/30 transition-all text-center">
            VIEW ALL COURSES
          </Link>
        </div>
      </div>
    </div>
  );
}