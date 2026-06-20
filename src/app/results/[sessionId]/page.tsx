"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { isLoggedIn, authHeaders } from "@/lib/auth";
import { API_URLS } from "@/lib/api";

interface GradedAnswer {
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  selectedAnswerText: string;
  correctAnswer: string;
  correctAnswerText: string;
  isCorrect: boolean;
}

interface SessionData {
  _id: string;
  score: number;
  passed: boolean;
  answers: GradedAnswer[];
  testId: { title: string; level: string; passMark: number };
  courseId: { title: string };
}

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/login"); return; }
    fetch(`${API_URLS.sessions}/${sessionId}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setSession)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router, sessionId]);

  if (loading) return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
      <p className="font-mono text-[10px] text-[#334155] tracking-widest animate-pulse">LOADING RESULTS...</p>
    </div>
  );

  if (!session) return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-[10px] text-[#334155] tracking-widest mb-4">RESULTS NOT FOUND</p>
        <Link href="/dashboard" className="font-mono text-[10px] text-[#3B82F6]">← BACK TO DASHBOARD</Link>
      </div>
    </div>
  );

  const correct = session.answers.filter((a) => a.isCorrect).length;
  const total = session.answers.length;
  const passed = session.passed;
  const circumference = 2 * Math.PI * 45;
  const strokeDash = (session.score / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#080C14] text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-2">
            {session.testId?.title} — {session.courseId?.title}
          </p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 border mb-6 font-mono text-[10px] tracking-widest ${
            passed ? "border-green-400/30 bg-green-400/5 text-green-400" : "border-red-400/30 bg-red-400/5 text-red-400"
          }`}>
            {passed ? "✓ TEST PASSED" : "✗ TEST FAILED"}
          </div>

          {/* Score circle */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <svg width="120" height="120" className="-rotate-90">
              <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="60" cy="60" r="45" fill="none"
                stroke={passed ? "#22C55E" : "#EF4444"}
                strokeWidth="8"
                strokeDasharray={`${strokeDash} ${circumference}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute text-center">
              <p className={`text-3xl font-black ${passed ? "text-green-400" : "text-red-400"}`}>{session.score}%</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#0D1220] border border-white/5 p-4">
              <p className="font-mono text-[9px] text-[#334155] tracking-widest mb-1">CORRECT</p>
              <p className="text-2xl font-black text-green-400">{correct}</p>
            </div>
            <div className="bg-[#0D1220] border border-white/5 p-4">
              <p className="font-mono text-[9px] text-[#334155] tracking-widest mb-1">WRONG</p>
              <p className="text-2xl font-black text-red-400">{total - correct}</p>
            </div>
            <div className="bg-[#0D1220] border border-white/5 p-4">
              <p className="font-mono text-[9px] text-[#334155] tracking-widest mb-1">PASS MARK</p>
              <p className="text-2xl font-black text-[#3B82F6]">{session.testId?.passMark}%</p>
            </div>
          </div>
        </div>

        {/* Review toggle */}
        <button onClick={() => setShowReview(!showReview)}
          className="w-full py-3 border border-[#3B82F6]/30 text-[#3B82F6] font-mono text-[11px] tracking-[.2em] hover:bg-[#3B82F6]/10 transition-colors mb-6">
          {showReview ? "HIDE REVIEW" : "REVIEW ANSWERS →"}
        </button>

        {/* Review section */}
        {showReview && (
          <div className="space-y-4 mb-8">
            {session.answers.map((answer, index) => (
              <div key={answer.questionId}
                className={`bg-[#0D1220] border p-5 ${answer.isCorrect ? "border-green-400/20" : "border-red-400/20"}`}>
                <div className="flex items-start gap-3 mb-4">
                  <span className={`font-mono text-[10px] px-2 py-0.5 flex-shrink-0 ${
                    answer.isCorrect ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
                  }`}>
                    {answer.isCorrect ? "✓" : "✗"} Q{index + 1}
                  </span>
                  <p className="text-sm font-medium leading-relaxed">{answer.questionText}</p>
                </div>
                <div className="space-y-2 pl-8">
                  {/* Your answer */}
                  <div className={`px-3 py-2 border text-sm font-mono ${
                    answer.isCorrect
                      ? "border-green-400/30 bg-green-400/5 text-green-400"
                      : "border-red-400/30 bg-red-400/5 text-red-400"
                  }`}>
                    <span className="text-[9px] tracking-widest mr-2 opacity-60">YOUR ANSWER:</span>
                    {answer.selectedAnswerText || "Not answered"}
                  </div>
                  {/* Correct answer — only show if wrong */}
                  {!answer.isCorrect && (
                    <div className="px-3 py-2 border border-green-400/30 bg-green-400/5 text-green-400 text-sm font-mono">
                      <span className="text-[9px] tracking-widest mr-2 opacity-60">CORRECT ANSWER:</span>
                      {answer.correctAnswerText}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/dashboard"
            className="w-full py-3 bg-[#3B82F6] text-white font-mono text-[11px] tracking-[.2em] hover:bg-[#2563EB] transition-colors text-center">
            BACK TO DASHBOARD
          </Link>
        </div>
      </div>
    </div>
  );
}