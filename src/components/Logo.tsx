import { Hand } from "lucide-react";

// Brand mark: a rounded blue tile with a white hand glyph — a play on "손"
// (Korean for hand, sounds like the "SON" in SONCODING).
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white ${className}`}
      aria-hidden="true"
    >
      <Hand className="h-[18px] w-[18px]" strokeWidth={2} />
    </span>
  );
}
