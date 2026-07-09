import { Link } from "@tanstack/react-router";
import { Waves } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="glass flex items-center justify-between border-b border-white/5 px-6 py-3">
      <div className="flex items-center gap-2 text-sm">
        <Waves className="h-4 w-4 text-primary" />

        <span className="font-medium">
          North Atlantic Salinity
        </span>

        <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
          Live
        </span>
      </div>

      <Link
        to="/"
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        ← Home
      </Link>
    </header>
  );
}