"use client";
import { API_URLS } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import { Course, Test } from "@/types";
import { useEffect, useState } from "react";

const levelColors: Record<string, string> = {
  beginner: "text-green-400",
  intermediate: "text-yellow-400",
  advanced: "text-red-400",
};

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tests, setTests] = useState<Record<string, Test[]>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTestForm, setShowTestForm] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    topic: "",
    order: 0,
  });
  const [testForm, setTestForm] = useState({
    title: "",
    level: "beginner",
    questionCount: 10,
    timeLimit: 15,
    passMark: 70,
    maxAttemptsPerWeek: 3,
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const coursesData = await fetch(API_URLS.courses).then((r) => r.json());
    const courseList = Array.isArray(coursesData) ? coursesData : [];
    setCourses(courseList);
    const testsMap: Record<string, Test[]> = {};
    await Promise.all(
      courseList.map(async (course: Course) => {
        const res = await fetch(`${API_URLS.courses}/${course._id}`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        testsMap[course._id] = data.tests || [];
      }),
    );
    setTests(testsMap);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URLS.admin}/courses`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(courseForm),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error);
        return;
      }
      setShowForm(false);
      setCourseForm({ title: "", description: "", topic: "", order: 0 });
      fetchData();
    } catch {
      setError("Server error");
    } finally {
      setSaving(false);
    }
  };

  const createTest = async (e: React.FormEvent, courseId: string) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URLS.admin}/tests`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ ...testForm, courseId }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error);
        return;
      }
      setShowTestForm(null);
      setTestForm({
        title: "",
        level: "beginner",
        questionCount: 10,
        timeLimit: 15,
        passMark: 70,
        maxAttemptsPerWeek: 3,
        order: 0,
      });
    } catch {
      setError("Server error");
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    await fetch(`${API_URLS.admin}/courses/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    fetchData();
  };
  const deleteTest = async (id: string) => {
    if (!confirm("Delete this test?")) return;
    await fetch(`${API_URLS.admin}/tests/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    fetchData();
  };

  const inputClass =
    "w-full bg-[#111827] border border-white/5 text-white text-sm px-4 py-2.5 outline-none focus:border-[#3B82F6]/50 font-mono";
  const labelClass =
    "font-mono text-[10px] text-[#64748B] tracking-[.2em] block mb-2";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-1">
            ADMIN / COURSES
          </p>
          <h1 className="text-2xl font-black tracking-tight">Manage Courses</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-mono text-[11px] px-5 py-2.5 bg-[#3B82F6] text-white tracking-[.1em] hover:bg-[#2563EB] transition-colors"
        >
          + ADD COURSE
        </button>
      </div>

      {showForm && (
        <div className="bg-[#0D1220] border border-[#3B82F6]/20 p-6 mb-6">
          <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-4">
            NEW COURSE
          </p>
          <form onSubmit={createCourse} className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>TITLE</label>
              <input
                className={inputClass}
                value={courseForm.title}
                onChange={(e) =>
                  setCourseForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className={labelClass}>TOPIC (html/css/javascript)</label>
              <input
                className={inputClass}
                value={courseForm.topic}
                onChange={(e) =>
                  setCourseForm((f) => ({ ...f, topic: e.target.value }))
                }
                required
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>DESCRIPTION</label>
              <input
                className={inputClass}
                value={courseForm.description}
                onChange={(e) =>
                  setCourseForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className={labelClass}>ORDER</label>
              <input
                type="number"
                className={inputClass}
                value={courseForm.order}
                onChange={(e) =>
                  setCourseForm((f) => ({
                    ...f,
                    order: Number(e.target.value),
                  }))
                }
              />
            </div>
            {error && (
              <p className="col-span-2 font-mono text-[10px] text-red-400">
                {error}
              </p>
            )}
            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="font-mono text-[11px] px-5 py-2.5 bg-[#3B82F6] text-white tracking-[.1em] hover:bg-[#2563EB] disabled:opacity-50"
              >
                {saving ? "SAVING..." : "CREATE"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="font-mono text-[11px] px-5 py-2.5 border border-white/10 text-[#64748B] hover:text-white"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="font-mono text-[10px] text-[#334155] animate-pulse">
          LOADING...
        </p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-[#0D1220] border border-white/5 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold">{course.title}</p>
                  <p className="font-mono text-[9px] text-[#64748B]">
                    {course.topic.toUpperCase()} • ORDER {course.order}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setShowTestForm(
                        showTestForm === course._id ? null : course._id,
                      )
                    }
                    className="font-mono text-[9px] px-3 py-1.5 border border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/10 tracking-widest"
                  >
                    + TEST
                  </button>
                  <button
                    onClick={() => deleteCourse(course._id)}
                    className="font-mono text-[9px] px-3 py-1.5 border border-red-400/20 text-red-400/60 hover:text-red-400 tracking-widest"
                  >
                    DEL
                  </button>
                </div>
              </div>

              {tests[course._id] && tests[course._id].length > 0 && (
    <div className="border-t border-white/5 pt-3 mt-3 space-y-2">
      {tests[course._id].map((test, index) => (
        <div key={test._id} className="flex items-center justify-between px-3 py-2 bg-[#111827]">
          <div className="flex items-center gap-3">
            <span className={`font-mono text-[9px] ${levelColors[test.level]}`}>
              {test.level.toUpperCase()}
            </span>
            <p className="text-sm text-[#94A3B8]">{test.title}</p>
          </div>
          <div className="flex items-center gap-4 font-mono text-[12px] text-[#94A3B8]">
            <span>{test.questionCount}-Q</span>
            <span>{test.timeLimit}-MIN</span>
            <span>{test.passMark}%</span>
          </div>
          <button
                    onClick={() => deleteTest(test._id)}
                    className="font-mono text-[9px] px-3 py-1.5 border border-red-400/20 text-red-400/60 hover:text-red-400 tracking-widest"
                  >
                    DEL
                  </button>
        </div>
      ))}
    </div>
  )}

              {showTestForm === course._id && (
                <form
                  onSubmit={(e) => createTest(e, course._id)}
                  className="bg-[#111827] p-4 mb-3 grid grid-cols-3 gap-3"
                >
                  <div>
                    <label className={labelClass}>TITLE</label>
                    <input
                      className={inputClass}
                      value={testForm.title}
                      onChange={(e) =>
                        setTestForm((f) => ({ ...f, title: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>LEVEL</label>
                    <select
                      className={inputClass}
                      value={testForm.level}
                      onChange={(e) =>
                        setTestForm((f) => ({ ...f, level: e.target.value }))
                      }
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>QUESTIONS</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={testForm.questionCount}
                      onChange={(e) =>
                        setTestForm((f) => ({
                          ...f,
                          questionCount: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>TIME (MINS)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={testForm.timeLimit}
                      onChange={(e) =>
                        setTestForm((f) => ({
                          ...f,
                          timeLimit: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>PASS MARK %</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={testForm.passMark}
                      onChange={(e) =>
                        setTestForm((f) => ({
                          ...f,
                          passMark: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ATTEMPTS/WEEK</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={testForm.maxAttemptsPerWeek}
                      onChange={(e) =>
                        setTestForm((f) => ({
                          ...f,
                          maxAttemptsPerWeek: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="col-span-3 flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="font-mono text-[10px] px-4 py-2 bg-[#3B82F6] text-white tracking-widest disabled:opacity-50"
                    >
                      {saving ? "..." : "CREATE TEST"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTestForm(null)}
                      className="font-mono text-[10px] px-4 py-2 border border-white/10 text-[#64748B]"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
