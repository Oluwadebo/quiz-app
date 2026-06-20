"use client";
import { API_URLS } from "@/lib/api";
import { authHeaders, getUser, isLoggedIn, removeToken } from "@/lib/auth";
import { Course, HistoryItem } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const levelColors = {
  beginner: "text-green-400",
  intermediate: "text-yellow-400",
  advanced: "text-red-400",
};
const topicEmoji: Record<string, string> = {
  html: "🌐",
  css: "🎨",
  javascript: "⚡",
};

export default function Dashboard() {
  const router = useRouter();
  const user = getUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    Promise.all([
      fetch(API_URLS.courses).then((r) => r.json()),
      fetch(`${API_URLS.sessions}/history`, { headers: authHeaders() }).then(
        (r) => r.json(),
      ),
    ])
      .then(([c, h]) => {
        setCourses(Array.isArray(c) ? c : []);
        setHistory(Array.isArray(h) ? h.slice(0, 5) : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);


  // console.log(courses);

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  // Calculate progress per course
  const courseProgress = courses.map((course) => {
    const courseHistory = history.filter(
      (h) => h.courseId?.title === course.title,
    );
    const passed = courseHistory.filter((h) => h.passed).length;
    const total = 3; // beginner, intermediate, advanced
    return { ...course, passed, progress: Math.round((passed / total) * 100) };
  });

  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="font-mono text-[13px] tracking-[.2em] text-[#3B82F6]"
        >
          QUIZAPP
        </Link>
        <div className="flex items-center gap-6">
          <span className="font-mono text-[10px] text-[#64748B]">
            👋 {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="font-mono text-[10px] text-[#64748B] hover:text-red-400 transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-1">
            DASHBOARD
          </p>
          <h1 className="text-3xl font-black tracking-tight">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-[#0D1220] border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="mb-8">
              <p className="font-mono text-[10px] text-[#64748B] tracking-[.2em] mb-4">
                YOUR PROGRESS
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courseProgress.map((course) => (
                  <Link
                    key={course._id}
                    href={`/courses/${course._id}`}
                    className="bg-[#0D1220] border border-white/5 p-5 hover:border-[#3B82F6]/30 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">
                        {topicEmoji[course.topic] || "📚"}
                      </span>
                      <p className="font-bold text-sm">{course.title}</p>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mb-2">
                      <div
                        className="bg-[#3B82F6] h-1.5 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="font-mono text-[9px] text-[#64748B]">
                      {course.passed}/3 LEVELS PASSED
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Results */}
            {history.length > 0 && (
              <div className="mb-8">
                <p className="font-mono text-[10px] text-[#64748B] tracking-[.2em] mb-4">
                  RECENT RESULTS
                </p>
                <div className="bg-[#0D1220] border border-white/5">
                  {history.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {item.testId?.title}
                        </p>
                        <p className="font-mono text-[9px] text-[#64748B]">
                          {item.courseId?.title} •{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p
                          className={`font-mono text-sm font-bold ${item.passed ? "text-green-400" : "text-red-400"}`}
                        >
                          {item.score}%
                        </p>
                        <span
                          className={`font-mono text-[9px] px-2 py-0.5 ${item.passed ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}
                        >
                          {item.passed ? "✓ PASS" : "✗ FAIL"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Courses */}
            <div>
              <p className="font-mono text-[10px] text-[#64748B] tracking-[.2em] mb-4">
                AVAILABLE COURSES
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Link
                    key={course._id}
                    href={`/courses/${course._id}`}
                    className="bg-[#0D1220] border border-white/5 p-5 hover:border-[#3B82F6]/30 transition-all group"
                  >
                    <p className="text-2xl mb-2">
                      {topicEmoji[course.topic] || "📚"}
                    </p>
                    <p className="font-bold mb-1 group-hover:text-[#3B82F6] transition-colors">
                      {course.title}
                    </p>
                    <p className="text-[#64748B] text-xs">
                      {course.description}
                    </p>
                    <p className="font-mono text-[9px] text-[#3B82F6] mt-3 tracking-widest">
                      START COURSE →
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
