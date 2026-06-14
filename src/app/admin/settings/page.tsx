"use client";
import { API_URLS } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function AdminSettings() {
  const [form, setForm] = useState({
    platformName: "",
    platformDescription: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(API_URLS.settings)
      .then((r) => r.json())
      .then((d) =>
        setForm({
          platformName: d.platformName || "",
          platformDescription: d.platformDescription || "",
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(API_URLS.settings, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(form),
    });
    setSuccess("Saved!");
    setTimeout(() => setSuccess(""), 2000);
    setSaving(false);
  };

  const inputClass =
    "w-full bg-[#111827] border border-white/5 text-white text-sm px-4 py-2.5 outline-none focus:border-[#3B82F6]/50 font-mono";

  return (
    <div className="p-8 max-w-lg">
      <div className="mb-8">
        <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-1">
          ADMIN / SETTINGS
        </p>
        <h1 className="text-2xl font-black tracking-tight">
          Platform Settings
        </h1>
      </div>
      {loading ? (
        <p className="font-mono text-[10px] text-[#334155] animate-pulse">
          LOADING...
        </p>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="font-mono text-[10px] text-[#64748B] tracking-[.2em] block mb-2">
              PLATFORM NAME
            </label>
            <input
              className={inputClass}
              value={form.platformName}
              onChange={(e) =>
                setForm((f) => ({ ...f, platformName: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="font-mono text-[10px] text-[#64748B] tracking-[.2em] block mb-2">
              DESCRIPTION
            </label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              value={form.platformDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, platformDescription: e.target.value }))
              }
            />
          </div>
          {success && (
            <p className="font-mono text-[10px] text-green-400 border border-green-400/20 bg-green-400/5 px-3 py-2">
              ✓ {success.toUpperCase()}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="font-mono text-[11px] px-6 py-2.5 bg-[#3B82F6] text-white tracking-[.1em] hover:bg-[#2563EB] disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE SETTINGS"}
          </button>
        </form>
      )}
    </div>
  );
}
