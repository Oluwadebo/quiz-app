"use client";
import { API_URLS } from "@/lib/api";
import { authHeaders, isLoggedIn } from "@/lib/auth";
import { Question, TestSession } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string;

  const [session, setSession] = useState<TestSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Submit test
  const submitTest = useCallback(
    async (sessionAnswers: Record<string, string>) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        const formatted = Object.entries(sessionAnswers).map(
          ([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer,
          }),
        );
        const res = await fetch(`${API_URLS.sessions}/${sessionId}/submit`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ answers: formatted }),
        });
        if (res.ok) router.push(`/results/${sessionId}`);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
    [sessionId, router, submitting],
  );

  // Load session
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    fetch(`${API_URLS.sessions}/ongoing`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (!data.session) {
          router.replace("/dashboard");
          return;
        }
        setSession(data.session);
        setTimeLeft(data.session.timeRemaining || data.session.timeLimit * 60);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  // Countdown timer
  useEffect(() => {
    //  if (session) console.log("Questions:", session.questions);
    if (!session || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitTest(answers); // auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [session, answers, submitTest]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && session) {
        fetch(`${API_URLS.sessions}/${session._id}/tab-switch`, {
          method: "POST",
          headers: authHeaders(),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.warning) alert(data.warning);
          });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [session]);

  // Disable right click
  useEffect(() => {
    const prevent = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    return () => document.removeEventListener("contextmenu", prevent);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
        <p className="font-mono text-[10px] text-[#334155] tracking-widest animate-pulse">
          LOADING TEST...
        </p>
      </div>
    );

  if (!session) return null;

  const questions = session.questions as Question[];
  const current = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const timerColor =
    timeLeft < 60
      ? "text-red-400"
      : timeLeft < 180
        ? "text-yellow-400"
        : "text-green-400";

  return (
    <div className="min-h-screen bg-[#080C14] text-white select-none">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] text-[#3B82F6] tracking-widest">
            QUESTION {currentIndex + 1} OF {totalQuestions}
          </p>
          <div className="w-48 bg-white/5 h-1 mt-1.5 rounded-full">
            <div
              className="bg-[#3B82F6] h-1 rounded-full transition-all"
              style={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className={`font-mono text-xl font-black ${timerColor}`}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Question */}
        <div className="mb-8">
          <p className="text-lg font-semibold leading-relaxed">
            {current?.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-10">
          {current?.shuffledOptions?.map((option) => {
            const selected = answers[current.id] === option.key;
            return (
              <button
                key={option.key}
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [current.id]: option.key }))
                }
                className={`w-full text-left px-5 py-4 border transition-all font-mono text-sm ${
                  selected
                    ? "border-[#3B82F6] bg-[#3B82F6]/10 text-white"
                    : "border-white/10 bg-[#0D1220] text-[#94A3B8] hover:border-[#3B82F6]/40 hover:text-white"
                }`}
              >
                <span className="text-[#3B82F6] mr-3">
                  {String.fromCharCode(
                    65 + current.shuffledOptions.indexOf(option),
                  )}
                  .
                </span>
                {/* <span className="text-[#3B82F6] mr-3">
                  {option.key.replace("answer_", "").toUpperCase()}.
                </span> */}
                {option.value}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="font-mono text-[11px] px-5 py-2.5 border border-white/10 text-[#64748B] hover:text-white hover:border-white/30 transition-all disabled:opacity-30 tracking-widest"
          >
            ← PREV
          </button>

          <p className="font-mono text-[9px] text-[#334155]">
            {answeredCount}/{totalQuestions} ANSWERED
          </p>

          {isLastQuestion ? (
            <button
              onClick={() => submitTest(answers)}
              disabled={submitting}
              className="font-mono text-[11px] px-5 py-2.5 bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 tracking-widest"
            >
              {submitting ? "SUBMITTING..." : "SUBMIT TEST ✓"}
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))
              }
              className="font-mono text-[11px] px-5 py-2.5 border border-[#3B82F6]/40 text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-all tracking-widest"
            >
              NEXT →
            </button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex flex-wrap gap-1.5 mt-8 justify-center">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-7 h-7 font-mono text-[9px] border transition-all ${
                i === currentIndex
                  ? "border-[#3B82F6] bg-[#3B82F6] text-white"
                  : answers[q.id]
                    ? "border-green-400/40 bg-green-400/10 text-green-400"
                    : "border-white/10 text-[#334155] hover:border-white/30"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
