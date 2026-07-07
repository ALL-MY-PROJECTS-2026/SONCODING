// Brand mark: a rounded blue tile with a white </> code glyph.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid h-8 w-8 place-items-center rounded-lg bg-blue-600 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 44 44"
        className="h-5 w-5"
        fill="none"
        stroke="#ffffff"
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 15 L10 22 L16 29" />
        <path d="M25 14 L19 30" />
        <path d="M28 15 L34 22 L28 29" />
      </svg>
    </span>
  );
}
