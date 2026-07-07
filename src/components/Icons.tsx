import { Globe, Smartphone, Workflow, Puzzle, type LucideIcon } from "lucide-react";
import type { Service } from "@/lib/content";

// Maps a service's icon key to a lucide icon.
const serviceIcons: Record<Service["icon"], LucideIcon> = {
  web: Globe,
  app: Smartphone,
  automation: Workflow,
  custom: Puzzle,
};

export function ServiceIcon({ icon }: { icon: Service["icon"] }) {
  const Icon = serviceIcons[icon];
  return <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />;
}
