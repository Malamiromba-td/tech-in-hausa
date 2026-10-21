
"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

export default function Newsletter() {
  const t = useTranslations("newsletter");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed.");
      }

      setStatus("success");
      setMessage(data.message || "Thanks for subscribing!");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <section className="bg-indigo-deep">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-10 px-5 py-14 md:px-8 md:py-19">
        <h2 className="max-w-sm font-display text-[27px] text-paper">
          {t("heading")}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex max-w-[420px] flex-1 flex-col gap-2"
        >
          <div className="flex gap-2.5">
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("placeholder")}
              aria-label={t("placeholder")}
              disabled={status === "loading"}
              className="min-w-0 flex-1 rounded-[3px] border border-paper/25 bg-paper/[0.08] px-4 py-3.5 text-[14.5px] text-paper placeholder:text-paper/45 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-[3px] bg-gold px-5.5 font-semibold text-indigo-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "..." : t("subscribe")}
            </button>
          </div>

          <p className="text-[12px] text-paper/50">
            {t("consent")}
          </p>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`text-sm ${
                status === "error"
                  ? "text-red-300"
                  : "text-paper"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
            }

/*import { useTranslations } from "next-intl";

export default function Newsletter() {
  const t = useTranslations("newsletter");

  return (
    <section className="bg-indigo-deep">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-10 px-5 md:px-8 py-14 md:py-19">
        <h2 className="max-w-sm font-display text-[27px] text-paper">
          {t("heading")}
        </h2>
        <div className="flex max-w-[420px] flex-1 flex-col gap-2">
          <div className="flex gap-2.5">
            <input
              type="email"
              placeholder={t("placeholder")}
              className="flex-1 rounded-[3px] border border-paper/25 bg-paper/[0.08] px-4 py-3.5 text-[14.5px] text-paper placeholder:text-paper/45"
            />
            <button className="rounded-[3px] bg-gold px-5.5 font-semibold text-indigo-deep">
              {t("subscribe")}
            </button>
          </div>
          <p className="text-[12px] text-paper/50">{t("consent")}</p>
        </div>
      </div>
    </section>
  );
}
*/
