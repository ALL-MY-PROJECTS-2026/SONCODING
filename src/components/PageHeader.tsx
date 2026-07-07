import { Container } from "./Container";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <Container className="relative py-16 sm:py-20">
        {eyebrow && (
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            {lead}
          </p>
        )}
      </Container>
    </section>
  );
}
