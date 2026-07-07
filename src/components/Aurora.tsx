// Pure-CSS aurora / mesh-gradient backdrop. No assets, no JS — soft blurred
// color blobs that slowly drift. Sits behind hero / banner content.
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div className={`aurora ${className}`} aria-hidden="true">
      <span className="aurora__blob aurora__blob--1" />
      <span className="aurora__blob aurora__blob--2" />
      <span className="aurora__blob aurora__blob--3" />
      <span className="aurora__blob aurora__blob--4" />
    </div>
  );
}
