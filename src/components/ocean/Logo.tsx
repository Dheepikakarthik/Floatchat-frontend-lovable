import { Link } from "@tanstack/react-router";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-base", md: "text-xl", lg: "text-2xl" };
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/40 blur-md transition group-hover:bg-primary/60" />
        <svg
          viewBox="0 0 32 32"
          className="relative h-8 w-8"
          fill="none"
        >
          <circle cx="16" cy="16" r="14" stroke="url(#g)" strokeWidth="1.5" />
          <path
            d="M4 18 Q10 12, 16 18 T28 18"
            stroke="url(#g)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M4 22 Q10 16, 16 22 T28 22"
            stroke="url(#g)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.6"
          />
          <circle cx="16" cy="11" r="1.8" fill="oklch(0.85 0.18 175)" />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0" stopColor="oklch(0.82 0.16 200)" />
              <stop offset="1" stopColor="oklch(0.78 0.18 175)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className={`font-semibold tracking-tight gradient-text ${sizes[size]}`}>
        FloatChat
      </span>
    </Link>
  );
}
