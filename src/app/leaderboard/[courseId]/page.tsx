"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_URLS } from "@/lib/api";
import { LeaderboardEntry } from "@/types";

const medals: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function LeaderboardPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URLS.leaderboard}/${courseId}`)
      .then((r) => r.json())
      .then((data) => {
        setLeaderboard(data.leaderboard || []);
        setCourseTitle(data.course || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="font-mono text-[10px] text-[#64748B] hover:text-white tracking-widest">← DASHBOARD</Link>
        <span className="text-[#334155]">/</span>
        <p className="font-mono text-[10px] text-[#3B82F6] tracking-widest">LEADERBOARD</p>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8 text-center">
          <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-2">🏆 TOP PERFORMERS</p>
          <h1 className="text-3xl font-black tracking-tight">{courseTitle}</h1>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => <div key={i} className="h-16 bg-[#0D1220] border border-white/5 animate-pulse" />)}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10">
            <p className="font-mono text-[10px] text-[#334155] tracking-widest mb-2">NO RESULTS YET</p>
            <p className="text-[#64748B] text-sm">Be the first to complete this course!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div key={entry.rank}
                className={`flex items-center justify-between px-5 py-4 border transition-all ${
                  entry.rank <= 3 ? "border-[#3B82F6]/20 bg-[#3B82F6]/5" : "border-white/5 bg-[#0D1220]"
                }`}>
                <div className="flex items-center gap-4">
                  <span className="text-xl w-8">{medals[entry.rank] || `#${entry.rank}`}</span>
                  <div>
                    <p className="font-bold">{entry.displayName}</p>
                    <p className="font-mono text-[9px] text-[#64748B]">{entry.attempts} ATTEMPT{entry.attempts !== 1 ? "S" : ""}</p>
                  </div>
                </div>
                <p className="font-mono text-xl font-black text-[#3B82F6]">{entry.bestScore}%</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href={`/courses/${courseId}`}
            className="font-mono text-[10px] text-[#3B82F6] tracking-widest hover:underline">
            ← BACK TO COURSE
          </Link>
        </div>
      </div>
    </div>
  );
}