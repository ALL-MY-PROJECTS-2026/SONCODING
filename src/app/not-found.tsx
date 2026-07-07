import Link from "next/link";
import { defaultLocale } from "@/lib/i18n";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <span
        className="grid h-14 w-14 place-items-center rounded-xl bg-blue-600 text-white"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 44 44"
          className="h-8 w-8"
          fill="none"
          stroke="#ffffff"
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 15 L23 22 L15 29" />
          <path d="M26 28 L34 28" />
        </svg>
      </span>

      <p className="mt-7 font-mono text-6xl font-bold tracking-tight text-slate-900">
        404
      </p>
      <h1 className="mt-3 text-xl font-bold text-slate-900">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-slate-500">
        Page not found — it may have moved or no longer exists.
      </p>

      <Link
        href={`/${defaultLocale}`}
        className="mt-8 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        홈으로 · Home
      </Link>
    </div>
  );
}
