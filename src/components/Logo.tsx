// Brand mark: a rounded blue tile with the Hangul character "손" (hand) — a
// culturally specific monogram, a play on the "SON" in SONCODING.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white ${className}`}
      aria-hidden="true"
    >
      <span className="text-[15px] font-bold leading-none tracking-tight">손</span>
    </span>
  );
}
