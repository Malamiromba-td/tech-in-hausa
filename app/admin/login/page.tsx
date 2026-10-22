"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap, LockKeyhole, ShieldCheck } from "lucide-react";


export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !result.success) {
        setError(result.error ?? "Login failed. Please try again.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to connect. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-10 text-ink">
      <section className="w-full max-w-md">
        <a href="/" className="mb-8 flex items-center justify-center gap-3" aria-label="TechInHausa home">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-deep text-gold-soft">
            <GraduationCap size={27} aria-hidden="true" />
            <img src="/TECHINHAUSA NEW LOGO PNG.png" alt="TECHINHAUSA NEW LOGO" aria-hidden="true" className="w-8 shrink-0 object-contain md:h-8.5 md:w-8.5" />
            
          </span>
          <span>
            <span className="block font-display text-2xl font-semibold text-indigo-deep">TechInHausa</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-indigo">Admin access</span>
          </span>
        </a>

        <div className="rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-tint text-indigo-deep">
            <LockKeyhole size={23} aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-indigo-deep">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Sign in to manage TechInHausa contact messages and newsletter subscribers.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                Admin password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  maxLength={1024}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-line bg-paper px-4 py-3 pr-12 text-base outline-none transition focus:border-indigo focus:ring-2 focus:ring-indigo/15"
                  placeholder="Enter your admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink/60 hover:text-indigo"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-deep px-4 py-3 font-semibold text-white transition hover:bg-indigo disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheck size={18} aria-hidden="true" />
              {loading ? "Signing in…" : "Sign in securely"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-ink/55">
            Private area for authorized administrators only.
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-ink/50">TechInHausa · Admin portal</p>
      </section>
    </main>
  );
}
