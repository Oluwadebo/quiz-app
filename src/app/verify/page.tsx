// app/verify/page.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { API_URLS } from "@/lib/api";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    fetch(`${API_URLS.auth}/verify?token=${token}`)
      .then((res) => {
        if (res.ok || res.redirected) {
          setStatus("success");
          setTimeout(() => router.push("/login?verified=true"), 2000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [token, router]);

  return (
    <div className="text-center">
      <div className="mb-8">
        <span className="font-mono text-[13px] tracking-[.2em] text-[#3B82F6]">
          QUIZHUB
        </span>
        <p className="font-mono text-[10px] tracking-[.2em] text-[#334155] mt-1">
          EMAIL VERIFICATION
        </p>
      </div>

      <div className="bg-[#0D1220] border border-white/5 p-8 w-full max-w-sm">
        {status === "loading" && (
          <p className="font-mono text-[11px] tracking-[.15em] text-[#3B82F6] animate-pulse">
            VERIFYING YOUR EMAIL...
          </p>
        )}
        {status === "success" && (
          <p className="font-mono text-[10px] text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-3 py-2">
            ✓ EMAIL VERIFIED! REDIRECTING TO LOGIN...
          </p>
        )}
        {status === "error" && (
          <>
            <p className="font-mono text-[10px] text-red-400 border border-red-400/20 bg-red-400/5 px-3 py-2 mb-4">
              ✗ INVALID OR EXPIRED LINK.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2.5 bg-[#3B82F6] text-white font-mono text-[11px] tracking-[.2em] hover:bg-[#2563EB] transition-colors"
            >
              BACK TO LOGIN →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center px-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.03) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <Suspense fallback={null}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}