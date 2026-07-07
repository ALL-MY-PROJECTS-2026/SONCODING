"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, AlertCircle, Send } from "lucide-react";
import { site } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ form }: { form: Dictionary["contact"]["form"] }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Capture the form node now — React nulls e.currentTarget after the await.
    const formEl = e.currentTarget;
    setStatus("submitting");
    const data = Object.fromEntries(new FormData(formEl).entries());
    try {
      // Posts straight to Formspree — works on static hosting like GitHub Pages.
      const res = await fetch(site.formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request failed");
      formEl.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-green-600 text-white">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-green-900">
          {form.successTitle}
        </h3>
        <p className="mt-2 text-green-700">{form.successDesc}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-green-300 px-5 py-2 text-sm font-semibold text-green-800 hover:bg-green-100"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const fieldClass =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelClass = "block text-sm font-medium text-slate-700";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            {form.name} <span className="text-blue-600">*</span>
          </label>
          <input id="name" name="name" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            {form.email} <span className="text-blue-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            {form.phone}
          </label>
          <input id="phone" name="phone" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="type" className={labelClass}>
            {form.type}
          </label>
          <select id="type" name="type" className={fieldClass} defaultValue={form.typeOptions[0]}>
            {form.typeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          {form.message} <span className="text-blue-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder={form.messagePlaceholder}
          className={`${fieldClass} resize-y`}
        />
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>{form.errorTitle}</strong> — {form.errorDesc}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status !== "submitting" && <Send className="h-4 w-4" />}
        {status === "submitting" ? form.submitting : form.submit}
      </button>
    </form>
  );
}
