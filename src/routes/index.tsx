import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Waves,
  Sparkles,
  BarChart3,
  Globe2,
  Shield,
  Zap,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { OceanBackground } from "@/components/ocean/OceanBackground";
import { NavBar } from "@/components/ocean/NavBar";
import { Logo } from "@/components/ocean/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FloatChat — AI Ocean Intelligence Platform" },
      {
        name: "description",
        content:
          "Chat with the ocean. FloatChat turns ARGO float data, satellite feeds, and marine research into instant, conversational insight.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: MessageSquare,
    title: "Conversational Ocean AI",
    body: "Ask anything in plain language. FloatChat queries 2M+ ARGO profiles and returns research-grade answers in seconds.",
    to: "/chat",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    body: "Temperature, salinity, oxygen, currents — visualized across depth and time with publication-ready charts.",
    to: "/dashboard",
  },
  {
    icon: Globe2,
    title: "Global Float Network",
    body: "Stream from 4,000+ autonomous floats drifting across every ocean basin, updated hourly.",
    to: "/dashboard",
  },
  {
    icon: Shield,
    title: "Research Grade",
    body: "Cited sources, reproducible queries, NetCDF exports. Built for peer-reviewed science.",
    to: "/dashboard",
  },
  {
    icon: Zap,
    title: "Real-time Alerts",
    body: "Marine heatwaves, current anomalies, and ecosystem shifts surface the moment they happen.",
    to: "/dashboard",
  },
  {
    icon: Sparkles,
    title: "Bioluminescent UI",
    body: "A workspace designed for long sessions — calm, focused, and unmistakably the sea.",
    to: "/chat",
  },
];

const stats = [
  { value: "4,127", label: "Active ARGO floats" },
  { value: "2.4M", label: "Vertical profiles" },
  { value: "362PB", label: "Ocean data indexed" },
  { value: "99.98%", label: "Query uptime" },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <OceanBackground density={40} />
      <NavBar />

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-40 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Live ocean intelligence · v2.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-8 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl"
        >
          <span className="gradient-text text-glow">Talk to the ocean.</span>
          <br />
          <span className="text-foreground/90">Understand the planet.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg"
        >
          FloatChat is an AI workspace for marine scientists, climate analysts,
          and the curious. Ask questions, surface anomalies, and explore
          decades of ARGO data — all in a conversation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/chat"
            search={{ conversationId: "" }}
            className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground ring-glow transition hover:scale-[1.02]"
          >
            Open FloatChat
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <Link
            to="/dashboard"
            className="glass inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-medium text-foreground transition hover:bg-white/10"
          >
            <BarChart3 className="h-4 w-4" />
            View Dashboard
          </Link>
        </motion.div>

        {/* Hero preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="glass-strong mt-20 w-full max-w-5xl rounded-3xl p-2"
        >
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-deep/70 to-abyss/70 p-8 text-left">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-red-400/70" />
              <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
              <span className="h-2 w-2 rounded-full bg-green-400/70" />
              <span className="ml-3">floatchat.app/chat</span>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-wider text-accent">You</div>
                <p className="mt-2 text-sm text-foreground/90">
                  Show me salinity anomalies in the North Atlantic this quarter.
                </p>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
                  <Waves className="h-3 w-3" /> FloatChat
                </div>
                <p className="mt-2 text-sm text-foreground/90">
                  Detected a +0.42 PSU surface anomaly across the Labrador
                  basin, peaking week of May 3. Linked to reduced ice melt. 12
                  floats cited.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass rounded-2xl p-6"
            >
              <div className="gradient-text text-3xl font-semibold md:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">
            Capabilities
          </div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            A research instrument that <span className="gradient-text">talks back</span>.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
            >
              <Link
                to={f.to}
                className="glass group relative block overflow-hidden rounded-3xl p-7 transition hover:bg-white/[0.08] hover:scale-[1.02] cursor-pointer"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />
                <f.icon className="relative h-7 w-7 text-primary" strokeWidth={1.5} />
                <h3 className="relative mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
                <div className="relative mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-12 text-center md:p-16">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute left-1/2 top-0 h-64 w-[80%] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          </div>
          <h2 className="relative text-4xl font-semibold tracking-tight md:text-5xl">
            Dive in. <span className="gradient-text">It's free for scientists.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Open access for academic and non-profit research. Production tiers
            for ocean-tech, fisheries, and climate operations.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-2xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground ring-glow"
            >
              Create account
            </Link>
            <Link
              to="/chat"
              search={{ conversationId: "" }}
              className="glass rounded-2xl px-6 py-3.5 text-sm font-medium"
            >
              Try the chat
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <Logo />
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Documentation</a>
            <a href="#" className="hover:text-foreground">API</a>
            <a href="#" className="hover:text-foreground">Research</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
          <div className="text-xs text-muted-foreground">
            © 2026 FloatChat. Built for the ocean.
          </div>
        </div>
      </footer>
    </div>
  );
}