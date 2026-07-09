import CountUp from "react-countup";
import { lazy, Suspense } from "react";

const OceanMap = lazy(() => import("@/components/dashboard/OceanMap"));
import OceanKPIs from "@/components/dashboard/OceanKPIs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FloatChatAnalytics from "@/components/dashboard/FloatChatAnalytics";
import RecentConversations from "@/components/dashboard/RecentConversations";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import {
  Thermometer,
  Droplets,
  Wind,
  Activity,
  TrendingUp,
  TrendingDown,
  Waves,
} from "lucide-react";
import { OceanBackground } from "@/components/ocean/OceanBackground";
import { NavBar } from "@/components/ocean/NavBar";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — FloatChat" },
      { name: "description", content: "Real-time ocean analytics and float telemetry." },
    ],
  }),
  component: Dashboard,
});

const tempData = Array.from({ length: 24 }, (_, i) => ({
  t: `${i}h`,
  sst: 18 + Math.sin(i / 3) * 2 + Math.random() * 0.6,
  deep: 4 + Math.cos(i / 4) * 0.8 + Math.random() * 0.3,
}));

const salinityData = Array.from({ length: 12 }, (_, i) => ({
  m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  v: 34.8 + Math.sin(i / 2) * 0.4 + Math.random() * 0.15,
}));

const oxygenData = [{ name: "O2", value: 78, fill: "oklch(0.78 0.18 175)" }];


const kpis = [
  { icon: Thermometer, label: "Avg SST", value: "17.84°C", delta: "+0.12°", up: true, color: "from-orange-400 to-red-400" },
  { icon: Droplets, label: "Salinity", value: "34.91 PSU", delta: "−0.03", up: false, color: "from-cyan-400 to-blue-400" },
  { icon: Wind, label: "Current", value: "0.42 m/s", delta: "+0.04", up: true, color: "from-emerald-400 to-teal-400" },
  { icon: Activity, label: "Active Floats", value: "4,127", delta: "+18", up: true, color: "from-violet-400 to-fuchsia-400" },
];

function Dashboard() {
  const [oceanQueryCount, setOceanQueryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [conversationCount, setConversationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  const [memberSince, setMemberSince] = useState("");
  const [floats, setFloats] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);
  const [activityData, setActivityData] = useState([
  { day: "Mon", messages: 0 },
  { day: "Tue", messages: 0 },
  { day: "Wed", messages: 0 },
  { day: "Thu", messages: 0 },
  { day: "Fri", messages: 0 },
  { day: "Sat", messages: 0 },
  { day: "Sun", messages: 0 },
]);
  useEffect(() => {
  loadAnalytics();
}, []);
  const loadAnalytics = async () => {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) return;

  // Total Conversations
  const { count: conversations } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id);

  // Total Messages
  const { count: messages } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id);

  // Ocean-related Questions
  const { data: oceanMessages } = await supabase
    .from("messages")
    .select("text")
    .eq("user_id", userData.user.id)
    .eq("role", "user");

  let oceanCount = 0;

  oceanMessages?.forEach((msg) => {
    const text = msg.text.toLowerCase();

    if (
      text.includes("ocean") ||
      text.includes("sea") ||
      text.includes("temperature") ||
      text.includes("salinity") ||
      text.includes("wave") ||
      text.includes("marine")
    ) {
      oceanCount++;
    }
  });

  setConversationCount(conversations || 0);
  setMessageCount(messages || 0);
  setOceanQueryCount(oceanCount);
  const weekData = [
  { day: "Mon", messages: Math.floor(messages! * 0.10) },
  { day: "Tue", messages: Math.floor(messages! * 0.15) },
  { day: "Wed", messages: Math.floor(messages! * 0.12) },
  { day: "Thu", messages: Math.floor(messages! * 0.18) },
  { day: "Fri", messages: Math.floor(messages! * 0.14) },
  { day: "Sat", messages: Math.floor(messages! * 0.16) },
  { day: "Sun", messages: Math.floor(messages! * 0.15) },
];

setActivityData(weekData);
  const response = await fetch(
  "http://localhost:5000/api/argo-floats"
);

const floatData = await response.json();

setFloats(floatData);

  setLoading(false);
};
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        navigate({ to: "/login" });
      }
      else {
  setMemberSince(
    new Date(data.user.created_at).toLocaleDateString()
  );

  
  const { data: recent } = await supabase
  .from("conversations")
  .select("*")
  .eq("user_id", data.user.id)
  .order("created_at", { ascending: false })
  .limit(5);

setRecentConversations(recent || []);
}
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="relative min-h-screen">
      <OceanBackground density={15} />
      <NavBar />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-16 md:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">
              Mission control
            </div>
            <h1 className="mt-2 truncate text-3xl font-semibold tracking-tight md:text-4xl">
              Ocean Analytics
            </h1>
          </div>
          <div className="glass flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live · updated 12s ago
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">

  <div className="glass rounded-2xl p-5">
    <div className="text-xs text-muted-foreground">
      Conversations
    </div>

    <div className="mt-2 text-3xl font-bold">
  <CountUp
    end={conversationCount}
    duration={2}
  />
</div>
  </div>

  <div className="glass rounded-2xl p-5">
    <div className="text-xs text-muted-foreground">
      Messages
    </div>

    <div className="mt-2 text-3xl font-bold">
  <CountUp
    end={messageCount}
    duration={2}
  />
</div>
  </div>

  <div className="glass rounded-2xl p-5">
    <div className="text-xs text-muted-foreground">
      Member Since
    </div>

    <div className="mt-2 text-xl font-bold">
      {memberSince}
    </div>
  </div>

</div>

       {/* KPI grid 
        <OceanKPIs kpis={kpis} />
        <RecentConversations
  recentConversations={recentConversations}
  navigate={navigate}
/>*/}

{/* FloatChat Analytics

<FloatChatAnalytics
  conversationCount={conversationCount}
  messageCount={messageCount}
  oceanQueryCount={oceanQueryCount}
/> */} 



        {/* Charts */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">
  Conversation Activity
</div>

<div className="text-xs text-muted-foreground">
  Number of messages sent over time
</div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary"/>SST</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent"/>Deep</span>
              </div>
            </div>
            <div className="mt-5 h-64">
              <ResponsiveContainer>
                    <AreaChart data={activityData}>                  <defs>
                    <linearGradient id="sst" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.82 0.16 200)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.82 0.16 200)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="deep" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.18 175)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.78 0.18 175)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="oklch(0.7 0.04 220)"
                    fontSize={11}
/>
                  <YAxis stroke="oklch(0.7 0.04 220)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.15 0.05 248 / 0.95)",
                      border: "1px solid oklch(1 0 0 / 0.1)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                      type="monotone"
                      dataKey="messages"
                      stroke="oklch(0.82 0.16 200)"
                      strokeWidth={2}
                      fill="url(#sst)"
/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass flex flex-col rounded-2xl p-6"
          >
            <div className="text-sm font-medium">Dissolved Oxygen</div>
            <div className="text-xs text-muted-foreground">Saturation %</div>
            <div className="relative flex flex-1 items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={oxygenData} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background={{ fill: "oklch(1 0 0 / 0.06)" }} dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <div className="gradient-text text-4xl font-semibold">78%</div>
                <div className="text-xs text-muted-foreground">Healthy</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass rounded-2xl p-6 lg:col-span-2"
          >
            <div className="text-sm font-medium">Salinity Trend</div>
            <div className="text-xs text-muted-foreground">North Atlantic · 12mo PSU</div>
            <div className="mt-5 h-56">
              <ResponsiveContainer>
                <LineChart data={salinityData}>
                  <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                  <XAxis dataKey="m" stroke="oklch(0.7 0.04 220)" fontSize={11} />
                  <YAxis stroke="oklch(0.7 0.04 220)" fontSize={11} domain={["dataMin - 0.2", "dataMax + 0.2"]} />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.15 0.05 248 / 0.95)",
                      border: "1px solid oklch(1 0 0 / 0.1)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="v" stroke="oklch(0.78 0.18 175)" strokeWidth={2.5} dot={{ fill: "oklch(0.78 0.18 175)", r: 3 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

         {/* Ocean Map */}
          {mounted && (
            <Suspense
              fallback={
                <div
                  className="glass rounded-2xl p-6 lg:col-span-3 flex items-center justify-center"
                  style={{ height: 500 }}
                >
                  <span className="text-sm text-muted-foreground">Loading map…</span>
                </div>
              }
            >
              <OceanMap floats={floats} />
            </Suspense>
          )}
        </div>

        {/* Float table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass mt-6 overflow-hidden rounded-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div className="flex items-center gap-2">
              <Waves className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">Active Floats</div>
            </div>
            <button className="text-xs text-primary hover:underline">View all 4,127 →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-white/5">
                  <th className="px-6 py-3 text-left font-normal">Float ID</th>
                  <th className="px-6 py-3 text-left font-normal">Latitude</th>
                  <th className="px-6 py-3 text-left font-normal">Longitude</th>
                  <th className="px-6 py-3 text-left font-normal">Surface °C</th>
                  <th className="px-6 py-3 text-left font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {floats.map((f) => (
                  <tr key={f.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                    <td className="px-6 py-3.5 font-mono text-xs text-foreground/90">{f.id}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{f.lat.toFixed(2)}°</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{f.lon.toFixed(2)}°</td>
                    <td className="px-6 py-3.5">{f.temp}°</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                          f.status === "active"
                            ? "bg-emerald-400/15 text-emerald-300"
                            : "bg-amber-400/15 text-amber-300"
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}