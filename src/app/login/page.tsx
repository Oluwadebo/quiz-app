"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken, setUser, isLoggedIn, isAdmin } from "@/lib/auth";
import { API_URLS } from "@/lib/api";
import { useSettings } from "@/hooks/useSettings";

export default function Login() {
  const router = useRouter();
  const { settings } = useSettings();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.replace(isAdmin() ? "/admin" : "/dashboard");
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_URLS.auth}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      setToken(data.token);
      setUser(data.user);
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch { setError("Cannot connect to server"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"linear-gradient(rgba(59,130,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.03) 1px,transparent 1px)",backgroundSize:"60px 60px"}} />
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-mono text-[13px] tracking-[.2em] text-[#3B82F6]">{settings.platformName}</Link>
          <p className="font-mono text-[10px] tracking-[.2em] text-[#334155] mt-1">SIGN IN TO YOUR ACCOUNT</p>
        </div>
        <div className="bg-[#0D1220] border border-white/5 p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] block mb-2">EMAIL</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="you@email.com" className={inputClass} />
            </div>
            <div>
              <label className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] block mb-2">PASSWORD</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••" className={`${inputClass} pr-10`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#334155] hover:text-[#64748B]">
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            {error && <p className="font-mono text-[10px] text-red-400 border border-red-400/20 bg-red-400/5 px-3 py-2">✗ {error.toUpperCase()}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-[#3B82F6] text-white font-mono text-[11px] tracking-[.2em] hover:bg-[#2563EB] transition-colors disabled:opacity-50">
              {loading ? "SIGNING IN..." : "SIGN IN →"}
            </button>
          </form>
        </div>
        <p className="text-center font-mono text-[10px] text-[#334155] mt-4">
          No account?{" "}
          <Link href="/register" className="text-[#3B82F6] hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
const inputClass = "w-full bg-[#111827] border border-white/5 text-white text-sm px-4 py-2.5 outline-none focus:border-[#3B82F6]/50 transition-colors placeholder:text-[#334155] font-mono";

