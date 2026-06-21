"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, isAdmin } from "@/lib/auth";
import { useSettings } from "@/hooks/useSettings";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { settings } = useSettings();

  useEffect(() => {
     const params = new URLSearchParams(window.location.search);
  const isPreview = params.get("preview") === "true";
    if (!isPreview && isLoggedIn()) {
    //   const fromAdmin = document.referrer.includes("/admin");
    //   if (!fromAdmin) {
    //   router.replace(isAdmin() ? "/admin" : "/dashboard");
    // }
      router.replace(isAdmin() ? "/admin" : "/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center px-6 relative">
      <div className="absolute inset-0" style={{backgroundImage:"linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)",backgroundSize:"60px 60px"}} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{width:"600px",height:"400px",background:"radial-gradient(ellipse,rgba(59,130,246,0.1) 0%,transparent 70%)"}} />

      <div className="relative z-10 text-center max-w-lg">
        <p className="font-mono text-[10px] tracking-[.3em] text-[#3B82F6] mb-4">WEB DEV ASSESSMENT</p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
          {settings.platformName}
        </h1>
        <p className="text-[#64748B] text-lg mb-10">{settings.platformDescription}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register"
            className="px-8 py-3 bg-[#3B82F6] text-white font-semibold tracking-wide hover:bg-[#2563EB] transition-colors">
            Get Started
          </Link>
          <Link href="/login?preview=true"
            className="px-8 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all tracking-wide">
            Sign In
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-16">
          {[["HTML","Fundamentals"],["CSS","Styling"],["JavaScript","Basics"]].map(([topic, sub]) => (
            <div key={topic} className="bg-[#0D1220] border border-white/5 p-4 hover:border-[#3B82F6]/30 transition-colors">
              <p className="font-mono text-[10px] text-[#3B82F6] tracking-widest mb-1">{topic}</p>
              <p className="text-sm text-[#64748B]">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}