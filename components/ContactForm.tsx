
"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

const CONTACT_API = "https://api.techinhausa.org/contact.php";

type ContactResponse = {
  success?: boolean;
  message?: string;
};

export default function ContactForm() {
  const t = useTranslations("pages.tuntube");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(CONTACT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: String(formData.get("name") ?? "").trim(),
          email: String(formData.get("email") ?? "").trim(),
          subject: String(formData.get("subject") ?? "").trim(),
          message: String(formData.get("message") ?? "").trim(),
          website: String(formData.get("website") ?? ""),
        }),
      });

      const data: ContactResponse = await response.json();

      if (!response.ok || data.success !== true) {
        throw new Error(
          data.message || "Your message could not be sent. Please try again."
        );
      }

      setStatus("success");
      setMessage(data.message || "Your message has been received.");
      form.reset();
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder={t("namePlaceholder")}
        aria-label={t("namePlaceholder")}
        autoComplete="name"
        maxLength={100}
        required
        disabled={status === "loading"}
        className="rounded-[3px] border border-line bg-paper px-4 py-3.5 text-[14.5px] text-ink placeholder:text-ink/40 disabled:opacity-60"
      />

      <input
        type="email"
        name="email"
        placeholder={t("emailPlaceholder")}
        aria-label={t("emailPlaceholder")}
        autoComplete="email"
        maxLength={254}
        required
        disabled={status === "loading"}
        className="rounded-[3px] border border-line bg-paper px-4 py-3.5 text-[14.5px] text-ink placeholder:text-ink/40 disabled:opacity-60"
      />

      <input
        type="text"
        name="subject"
        placeholder={t("subjectPlaceholder")}
        aria-label={t("subjectPlaceholder")}
        maxLength={200}
        required
        disabled={status === "loading"}
        className="rounded-[3px] border border-line bg-paper px-4 py-3.5 text-[14.5px] text-ink placeholder:text-ink/40 disabled:opacity-60"
      />

      <textarea
        name="message"
        placeholder={t("messagePlaceholder")}
        aria-label={t("messagePlaceholder")}
        rows={5}
        maxLength={5000}
        required
        disabled={status === "loading"}
        className="rounded-[3px] border border-line bg-paper px-4 py-3.5 text-[14.5px] text-ink placeholder:text-ink/40 disabled:opacity-60"
      />

      {/* Honeypot field for simple bot detection */}
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="flex items-start gap-2.5 text-[13.5px] text-ink/60">
        <input
          type="checkbox"
          name="consent"
          required
          disabled={status === "loading"}
          className="mt-0.5"
        />
        {t("consent")}
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-1 rounded-[3px] bg-indigo px-6 py-3.5 font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "..." : t("send")}
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            status === "error" ? "text-red-600" : "text-ink/70"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
        }
