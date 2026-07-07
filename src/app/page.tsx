"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";

// Static export can't do a server redirect, so the root does a client-side
// replace to the default locale. Next's router prepends the basePath for us.
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${defaultLocale}`);
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50">
      <span className="text-sm text-slate-400">Loading…</span>
    </div>
  );
}
