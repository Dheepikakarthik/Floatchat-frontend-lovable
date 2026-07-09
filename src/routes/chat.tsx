import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Plus,
  Waves,
  Sparkles,
  MessageSquare,
  Compass,
  Thermometer,
  Activity,
  Search,
  Settings,
  LayoutDashboard,
  Trash2,
  Edit2,

} from "lucide-react";
import { jsPDF } from "jspdf";
import { OceanBackground } from "@/components/ocean/OceanBackground";
import { Logo } from "@/components/ocean/Logo";

export const Route = createFileRoute("/chat")({
  validateSearch: (search) => ({
    conversationId:
      typeof search.conversationId === "string"
        ? search.conversationId
        : "",
  }),

  head: () => ({
    meta: [
      { title: "Chat — FloatChat" },
      { name: "description", content: "Conversational AI for ocean data." },
    ],
  }),

  component: ChatPage,
});

type Msg = { id: string; role: "user" | "assistant"; text: string };

const seed: Msg[] = [
  {
    id: "1",
    role: "assistant",
    text: "Welcome aboard. I'm FloatChat — ask about ocean temperatures, salinity, currents, or any ARGO float in the global network. What would you like to explore?",
  },
];

const suggestions = [
  { icon: Thermometer, text: "Sea surface temperature trends in the Pacific" },
  { icon: Compass, text: "Show drift paths of floats near the Gulf Stream" },
  { icon: Activity, text: "Detect marine heatwaves this month" },
  { icon: Waves, text: "Compare salinity at 1000m across basins" },
];



function ChatPage() {
  const { conversationId } = Route.useSearch();
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState("");
  const [searchText, setSearchText] = useState("");
  const deleteConversation = async (conversationId: string) => {
  const confirmed = window.confirm(
    "Delete this conversation?"
  );

  if (!confirmed) return;

 const { error: messageError } = await supabase
  .from("messages")
  .delete()
  .eq("conversation_id", conversationId);

console.log("Message delete error:", messageError);

const { data: deletedConversation, error: conversationError } =
  await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId)
    .select();

console.log("Deleted conversation:", deletedConversation);
console.log(
  "Conversation delete error:",
  conversationError
);

  setConversations((prev) =>
    prev.filter((c) => c.id !== conversationId)
  );
  
  if (currentConversationId === conversationId) {
    setMessages(seed);
    setCurrentConversationId("");
  }
};
const renameConversation = async (
  conversationId: string,
  currentTitle: string
) => {
  const newTitle = prompt(
    "Enter new conversation title:",
    currentTitle
  );

  if (!newTitle) return;

  const { error } = await supabase
    .from("conversations")
    .update({
      title: newTitle,
    })
    .eq("id", conversationId);

  console.log("Rename error:", error);

  setConversations((prev) =>
    prev.map((c) =>
      c.id === conversationId
        ? { ...c, title: newTitle }
        : c
    )
  );
};
  const createConversation = async () => {
  
 const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  
  const { data, error } = await supabase
    .from("conversations")
    .insert([
      {
        user_id: userData.user.id,
        title: "New Conversation",
      },
    ])
    .select()
    .single();

  if (error) {
  console.log(error);
  return null;
}

setCurrentConversationId(data.id);
setMessages(seed);

console.log("Conversation created:", data.id);

return data.id;
};
  const loadConversation = async (conversationId: string) => {
  console.log("Loading conversation:", conversationId);
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) return;

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
  console.log("Messages loaded:", data);
  if (data) {
    setMessages(
      data.map((msg) => ({
        id: msg.id,
        role: msg.role,
        text: msg.text,
      }))
    );
  }
  setCurrentConversationId(conversationId);
};


  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);
  useEffect(() => {
  const loadMessages = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: true });
console.log("Loaded data:", data);
console.log("Load error:", error);
    if (data) {
      setMessages(
        data.map((msg) => ({
          id: msg.id,
          role: msg.role,
          text: msg.text,
        }))
      );
    }

    console.log("Loaded messages:", data);
    console.log("Load error:", error);
  };

  loadMessages();
}, []);
useEffect(() => {
  
  const loadConversations = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data, error } = await supabase 
    .from("conversations")
    .select(` *, messages!inner(id) `) 
    .eq("user_id", userData.user.id) 
    .order("created_at", { ascending: false });

console.log("Conversations:", data);
console.log("Conversation error:", error);

if (data) {
  setConversations(data);
}


  };

  loadConversations();
}, []);
useEffect(() => {
  if (conversationId) {
    loadConversation(conversationId);
  }
}, [conversationId]);
  const exportToPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("FloatChat Conversation", 20, 20);

  doc.setFontSize(11);
  doc.text(
    `Exported: ${new Date().toLocaleString()}`,
    20,
    30
  );

  let y = 45;

  messages.forEach((msg) => {
    const speaker =
      msg.role === "user"
        ? "You"
        : "FloatChat";

    const lines = doc.splitTextToSize(
      `${speaker}: ${msg.text}`,
      170
    );

    doc.text(lines, 20, y);

    y += lines.length * 7 + 5;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("FloatChat_Conversation.pdf");
};
  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    let conversationId = currentConversationId;

if (!conversationId) {
  conversationId = await createConversation();

  if (!conversationId) return;
}
    

console.log("User:", userData.user);

if (userData.user) {
  console.log("Current Conversation ID:", currentConversationId);
  const { error } = await supabase.from("messages").insert([
  {
    user_id: userData.user.id,
    conversation_id: conversationId,
    role: "user",
    text,
  },
]);
await supabase
  .from("conversations")
  .update({
    title: text.substring(0, 30),
  })
  .eq("id", conversationId);

  console.log("Insert error:", error);
}
    setInput("");
    setTyping(true);

try {
  const response = await fetch(
    "http://localhost:5000/api/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
      }),
    }
  );

  const data = await response.json();
  if (userData.user) {
  const { error } =await supabase.from("messages").insert([
  {
    user_id: userData.user.id,
    conversation_id: conversationId,
    role: "assistant",
    text: data.reply,
  },
]);

  console.log("Assistant message save error:", error);
}


  setMessages((m) => [
    ...m,
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: data.reply,
    },
  ]);
} catch (error) {
  setMessages((m) => [
    ...m,
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Backend connection failed.",
    },
  ]);
}

setTyping(false);
  };

  return (
    <div className="relative flex h-screen overflow-hidden">
      <OceanBackground density={20} />

      {/* Sidebar */}
      <aside className="relative z-10 hidden w-72 flex-col border-r border-white/5 bg-abyss/40 backdrop-blur-2xl md:flex">
        <div className="p-5">
          <Logo />
        </div>
        <div className="px-4">
         <button
            onClick={createConversation}

            className="flex w-full items-center gap-2 rounded-xl bg-primary/15 px-3.5 py-2.5 text-sm font-medium text-primary ring-1 ring-primary/30 transition hover:bg-primary/25"
          >
            <Plus className="h-4 w-4" /> New conversation
          </button>
          <div className="mt-4 mb-4">
  <input
    type="text"
    placeholder="🔍 Search conversations..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none"
  />
</div>
          
        </div>
        <div className="mt-6 flex-1 overflow-y-auto px-3">
          <div className="px-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            Recent
          </div>
          <div className="mt-2 space-y-1">
{conversations
  .filter((c) =>
    c.title.toLowerCase().includes(searchText.toLowerCase())
  )
  .map((c) => (              <div
  key={c.id}
  onClick={() => loadConversation(c.id)}
  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/5 ${
    currentConversationId === c.id
  ? "bg-white/5 text-foreground"
  : "text-muted-foreground"
  }`}
>
  <MessageSquare className="h-3.5 w-3.5 shrink-0" />

  <span className="truncate flex-1">
    {c.title}
  </span>
  <button
  onClick={(e) => {
    e.stopPropagation();
    renameConversation(
      c.id,
      c.title
    );
  }}
  className="mr-2 text-cyan-400 hover:text-cyan-600"
>
  <Edit2 className="h-4 w-4" />
</button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      deleteConversation(c.id);
    }}
    className="text-red-400 hover:text-red-600"
  >
    <Trash2 className="h-4 w-4" />
  </button>
</div>
            ))}
          </div>
        </div>
        <div className="border-t border-white/5 p-3">
          <Link
            to="/dashboard"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground">
            <Settings className="h-4 w-4" /> Settings
          </button>
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-abyss">
              MR
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm">Marine Researcher</div>
              <div className="text-xs text-muted-foreground">Pro plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="relative z-10 flex flex-1 flex-col">
        <header className="glass flex items-center justify-between border-b border-white/5 px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Waves className="h-4 w-4 text-primary" />
            <span className="font-medium">North Atlantic salinity</span>
            <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
              Live
            </span>
          </div>
          <div className="flex items-center gap-3">
  <button
    onClick={exportToPDF}
    className="rounded-lg bg-primary/15 px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/25"
  >
    📄 Export PDF
  </button>

  <Link
    to="/"
    className="text-xs text-muted-foreground hover:text-foreground"
  >
    ← Home
  </Link>
</div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 md:px-10">
          <div className="mx-auto max-w-3xl space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "assistant" && (
                    <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent ring-glow">
                      <Waves className="h-4 w-4 text-abyss" />
                    </div>
                  )}
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-primary-foreground"
                        : "max-w-[80%] text-sm leading-relaxed text-foreground/90"
                    }
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent">
                    <Waves className="h-4 w-4 text-abyss" />
                  </div>
                  <div className="flex items-center gap-1.5 pt-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-2 w-2 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {messages.length === 1 && (
              <div className="grid gap-3 pt-6 md:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => send(s.text)}
                    className="glass group flex items-center gap-3 rounded-2xl p-4 text-left transition hover:bg-white/10"
                  >
                    <s.icon className="h-5 w-5 shrink-0 text-primary transition group-hover:scale-110" />
                    <span className="text-sm text-foreground/85">{s.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="px-4 pb-6 md:px-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="glass-strong mx-auto flex max-w-3xl items-end gap-2 rounded-3xl p-2 pl-5"
          >
            <Sparkles className="mb-3 h-4 w-4 shrink-0 text-accent" />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask the ocean anything…"
              className="max-h-40 flex-1 resize-none bg-transparent py-3 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
            FloatChat may surface preliminary patterns. Always verify before publication.
          </p>
        </div>
      </main>
    </div>
  );
}
