import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

type KPI = {
  icon: any;
  label: string;
  value: string;
  delta: string;
  up: boolean;
  color: string;
};

type Props = {
  kpis: KPI[];
};

export default function OceanKPIs({ kpis }: Props) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k, i) => (
        <motion.div
  key={k.label}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{
    y: -10,
    scale: 1.04,
    rotateX: 6,
    rotateY: 4,
  }}
  transition={{
    duration: 0.4,
    delay: i * 0.08,
    type: "spring",
    stiffness: 250,
  }}
  className="glass group relative overflow-hidden rounded-2xl p-5 cursor-pointer"
>
         <motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [0.2, 0.4, 0.2],
  }}
  transition={{
    repeat: Infinity,
    duration: 4,
  }}
  className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${k.color} blur-2xl`}
/>

          <div className="relative flex items-center justify-between">
           <motion.div
  whileHover={{
    rotate: 360,
    scale: 1.3,
  }}
  transition={{
    duration: 0.6,
  }}
>
  <k.icon
    className="h-5 w-5 text-primary"
    strokeWidth={1.6}
  />
</motion.div>

            <span
              className={`flex items-center gap-1 text-xs ${
                k.up
                  ? "text-emerald-400"
                  : "text-orange-300"
              }`}
            >
              {k.up ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}

              {k.delta}
            </span>
          </div>

          <motion.div
  whileHover={{
    scale: 1.08,
  }}
  className="relative mt-4 text-2xl font-semibold tracking-tight text-white"
>
  {k.value}
</motion.div>

          <div className="relative mt-1 text-xs text-muted-foreground">
            {k.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}