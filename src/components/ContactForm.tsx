"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, AlertCircle, Send } from "lucide-react";
import { site } from "@/config/site";
import type { Dictionary } from "@/lib/i18n";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Record<string, string>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED = ["name", "email", "message"];

export function ContactForm({ form }: { form: Dictionary["contact"]["form"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const validate = (name: string, value: string): string => {
    const v = value.trim();
    if (REQUIRED.includes(name) && !v) return form.required;
    if (name === "email" && v && !emailPattern.test(v)) return form.invalidEmail;
    return "";
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const msg = validate(e.target.name, e.target.value);
    setErrors((prev) => ({ ...prev, [e.target.name]: msg }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Clear an existing error as soon as the field becomes valid.
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: validate(e.target.name, e.target.value) }));
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = Object.fromEntries(new FormData(formEl).entries());

    // Inline validation before sending.
    const next: Errors = {};
    for (const name of REQUIRED) {
      next[name] = validate(name, String(data[name] ?? ""));
    }
    if (Object.values(next).some(Boolean)) {
      setErrors(next);
      const first = REQUIRED.find((n) => next[n]);
      if (first) formEl.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(site.formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request failed");
      formEl.reset();
      setErrors({});
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
        <h3 className="mt-4 text-lg font-bold text-green-900">{form.successTitle}</h3>
        <p className="mt-2 text-green-700">{form.successDesc}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-green-300 px-5 py-2 text-sm font-semibold text-green-800 transition-colors hover:bg-green-100"
        >
          <RotateCcw className="h-4 w-4" />
          {form.sendAnother}
        </button>
      </div>
    );
  }

  const labelClass = "block text-sm font-medium text-slate-700";
  const inputCls = (name: string) =>
    `mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-slate-900 outline-none transition-colors focus:ring-2 ${
      errors[name]
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
    }`;

  const FieldError = ({ name }: { name: string }) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-1.5 text-sm text-red-600">
        {errors[name]}
      </p>
    ) : null;

  const a11y = (name: string) => ({
    onBlur,
    onChange,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            {form.name} <span className="text-blue-600">*</span>
          </label>
          <input id="name" name="name" className={inputCls("name")} {...a11y("name")} />
          <FieldError name="name" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            {form.email} <span className="text-blue-600">*</span>
          </label>
          <input id="email" name="email" type="email" className={inputCls("email")} {...a11y("email")} />
          <FieldError name="email" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            {form.phone}
          </label>
          <input id="phone" name="phone" className={inputCls("phone")} />
        </div>
        <div>
          <label htmlFor="type" className={labelClass}>
            {form.type}
          </label>
          <select id="type" name="type" className={inputCls("type")} defaultValue={form.typeOptions[0]}>
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
          rows={6}
          placeholder={form.messagePlaceholder}
          className={`${inputCls("message")} resize-y`}
          {...a11y("message")}
        />
        <FieldError name="message" />
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

      <p className="text-xs leading-relaxed text-slate-400">{form.privacyNotice}</p>
    </form>
  );
}
