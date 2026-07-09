import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { OceanBackground } from "@/components/ocean/OceanBackground";
import { Logo } from "@/components/ocean/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — FloatChat" },
      { name: "description", content: "Sign in to FloatChat." },
    ],
  }),
  component: Login,
});

function Login() {
  return <AuthShell mode="login" />;
}

export function AuthShell({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async () => {
  if (isLogin) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
  setMessage(error.message);
} else {
  setMessage("Login successful!");
  navigate({ to: "/dashboard" });
}
  } else {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setMessage(
      error
        ? error.message
        : "Account created! Check your email."
    );
  }
}; 
  return (
    <div className="relative grid min-h-screen md:grid-cols-2">
      <OceanBackground density={25} />

      {/* Left: visual */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 md:flex">
        <Logo size="lg" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
            <span className="gradient-text">Ocean intelligence</span>, served in
            a conversation.
          </h2>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Join thousands of marine scientists, climate analysts, and ocean
            operators using FloatChat to surface insight from the deep.
          </p>
        </motion.div>
        <div className="relative z-10 text-xs text-muted-foreground">
          © 2026 FloatChat
        </div>
      </div>

      {/* Right: form */}
      <div className="relative z-10 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass-strong w-full max-w-md rounded-3xl p-8 md:p-10"
        >
          <div className="md:hidden">
            <Logo />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight md:mt-0">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin
              ? "Sign in to continue exploring the ocean."
              : "Free for academic & non-profit research."}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
}}
            className="mt-8 space-y-4"
          >
            {!isLogin && (
              <Field label="Full name" type="text" placeholder="Jane Researcher" />
            )}
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="you@institute.org"
  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-4 text-sm"
/>            <input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="••••••••"
  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-4 text-sm"
/>

            {isLogin && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                  Remember me
                </label>
                <a href="#" className="text-primary hover:underline">
                  Forgot?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground ring-glow transition hover:scale-[1.01]"
            >
              
              {isLogin ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            {message && (
  <p className="mt-2 text-sm text-center">
    {message}
  </p>
)}
          </form>

          <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
          </div>

          <button className="glass flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm transition hover:bg-white/10">
            Continue with ORCID
          </button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "New to FloatChat? " : "Already have an account? "}
            <Link
              to={isLogin ? "/register" : "/login"}
              className="text-primary hover:underline"
            >
              {isLogin ? "Create account" : "Sign in"}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
  icon: Icon,
}: {
  label: string;
  type: string;
  placeholder: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-white/10 bg-white/5 py-3 ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 text-sm placeholder:text-muted-foreground/60 transition focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/30`}
        />
      </div>
    </label>
  );
}
