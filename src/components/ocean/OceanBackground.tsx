import { useMemo } from "react";
import { motion } from "framer-motion";

export function OceanBackground({ density = 30 }: { density?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 15 + 12,
        delay: Math.random() * 15,
        hue: Math.random() > 0.5 ? 200 : 175,
      })),
    [density],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Caustic light rays */}
      <motion.div
        className="absolute -top-1/4 left-1/4 h-[120vh] w-[60vw] opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.82 0.16 200 / 0.6), transparent 70%)",
        }}
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 right-0 h-[100vh] w-[50vw] opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.78 0.18 175 / 0.5), transparent 70%)",
        }}
        animate={{ x: [0, -80, 0], y: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating bioluminescent particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: `oklch(0.85 0.18 ${p.hue})`,
            boxShadow: `0 0 ${p.size * 4}px oklch(0.82 0.18 ${p.hue} / 0.9)`,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.82 0.16 200) 1px, transparent 1px), linear-gradient(90deg, oklch(0.82 0.16 200) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
