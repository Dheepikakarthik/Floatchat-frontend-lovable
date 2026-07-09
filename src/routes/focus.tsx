import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Waves,
  Coffee,
  Brain,
  Volume2,
  VolumeX,
} from "lucide-react";
import { OceanBackground } from "@/components/ocean/OceanBackground";
import { NavBar } from "@/components/ocean/NavBar";

export const Route = createFileRoute("/focus")({
  head: () => ({
    meta: [
      { title: "Focus — FloatChat" },
      {
        name: "description",
        content: "A calming, bioluminescent focus timer for deep research sessions.",
      },
    ],
  }),
  component: FocusPage,
});

type Mode = "focus" | "short" | "long";

const DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const MODE_LABEL: Record<Mode, string> = {
  focus: "Deep Focus",
  short: "Short Break",
  long: "Long Break",
};

const STORAGE_KEY = "floatchat_focus_sessions";
const SOUND_KEY = "floatchat_focus_sound_enabled";
const OCEAN_SOUND_URL = "/sounds/ocean-waves.mp3";

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function loadSessionData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayString(), todayCount: 0, totalCount: 0 };
    const parsed = JSON.parse(raw);
    if (parsed.date !== todayString()) {
      return { date: todayString(), todayCount: 0, totalCount: parsed.totalCount || 0 };
    }
    return parsed;
  } catch {
    return { date: todayString(), todayCount: 0, totalCount: 0 };
  }
}

function FocusPage() {
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [sessionData, setSessionData] = useState(loadSessionData);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
  
    try {
      return localStorage.getItem(SOUND_KEY) === "true";
    } catch {
      return false;
    }
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Countdown logic
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Ocean sound: play while running + enabled, pause otherwise
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (running && soundEnabled) {
      audio.volume = 0.35;
      audio.play().catch(() => {
        // Autoplay can be blocked until the user interacts once — harmless.
      });
    } else {
      audio.pause();
    }
  }, [running, soundEnabled]);

  const handleSessionEnd = () => {
    if (mode === "focus") {
      setSessionData((prev) => {
        const updated = {
          date: todayString(),
          todayCount: prev.todayCount + 1,
          totalCount: prev.totalCount + 1,
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // localStorage unavailable — ignore, session still counted in memory
        }
        return updated;
      });
      const nextMode: Mode = (sessionData.todayCount + 1) % 4 === 0 ? "long" : "short";
      switchMode(nextMode);
    } else {
      switchMode("focus");
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setSecondsLeft(DURATIONS[next]);
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(DURATIONS[mode]);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const progress = ((DURATIONS[mode] - secondsLeft) / DURATIONS[mode]) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Bioluminescent density ramps up while a session is running */}
      <OceanBackground density={running ? 60 : 30} />
      <NavBar />

      {/* Ocean ambience audio — loops while playing */}
      <audio ref={audioRef} src={OCEAN_SOUND_URL} loop preload="none" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-40 pb-24 text-center">
        <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground">
          <span
            className={`h-1.5 w-1.5 rounded-full bg-accent ${
              running ? "animate-pulse shadow-[0_0_8px_2px_oklch(0.78_0.18_175_/_0.7)]" : ""
            }`}
          />
          Focus
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
          <span className="gradient-text">{MODE_LABEL[mode]}</span>
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          {mode === "focus"
            ? "Deep work session. Stay with the current — no distractions."
            : "Drift for a moment. Breathe, stretch, look away from the screen."}
        </p>

        {/* Mode switcher */}
        <div className="mt-8 flex gap-2 rounded-2xl bg-white/5 p-1.5">
          {(["focus", "short", "long"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>

        {/* Timer ring */}
        <div className="relative mt-12 flex h-72 w-72 items-center justify-center">
          {/* Bioluminescent glow halo, pulses while running */}
          <div
            className={`absolute h-full w-full rounded-full transition-opacity duration-700 ${
              running ? "opacity-100 animate-pulse" : "opacity-40"
            }`}
            style={{
              background:
                "radial-gradient(circle, oklch(0.78 0.18 175 / 0.35) 0%, oklch(0.78 0.18 175 / 0) 70%)",
              filter: "blur(20px)",
            }}
          />
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="oklch(1 0 0 / 0.08)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="oklch(0.78 0.18 175)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
              style={{
                transition: "stroke-dashoffset 1s linear",
                filter: running
                  ? "drop-shadow(0 0 6px oklch(0.78 0.18 175 / 0.8))"
                  : "none",
              }}
            />
          </svg>
          <div className="glass-strong flex h-56 w-56 flex-col items-center justify-center rounded-full">
            {mode === "focus" ? (
              <Brain className="h-6 w-6 text-primary" />
            ) : (
              <Coffee className="h-6 w-6 text-accent" />
            )}
            <div className="mt-3 text-5xl font-semibold tabular-nums">
              {minutes}:{seconds}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center gap-4">
          <button
            onClick={reset}
            className="glass grid h-12 w-12 place-items-center rounded-2xl transition hover:bg-white/10"
            aria-label="Reset timer"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <button
            onClick={() => setRunning((r) => !r)}
            className="grid h-16 w-16 place-items-center rounded-3xl bg-primary text-primary-foreground ring-glow transition hover:scale-105"
            aria-label={running ? "Pause timer" : "Start timer"}
          >
            {running ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>

          <button
            onClick={toggleSound}
            className={`glass grid h-12 w-12 place-items-center rounded-2xl transition hover:bg-white/10 ${
              soundEnabled ? "text-accent" : "text-muted-foreground"
            }`}
            aria-label={soundEnabled ? "Mute ocean sound" : "Play ocean sound"}
            title={soundEnabled ? "Ocean sound: on" : "Ocean sound: off"}
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>

        {/* Session counters */}
        <div className="mt-8 flex gap-3">
          <div className="glass rounded-2xl px-5 py-3 text-center">
            <div className="text-2xl font-semibold text-primary">
              {sessionData.todayCount}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Today
            </div>
          </div>
          <div className="glass rounded-2xl px-5 py-3 text-center">
            <div className="text-2xl font-semibold text-accent">
              {sessionData.totalCount}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              All-time
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="mt-14 text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}