import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function NavBar() {
const [userEmail, setUserEmail] = useState("");
const [loggedIn, setLoggedIn] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);
const menuRef = useRef<HTMLDivElement | null>(null);

const handleClickOutside = (e: MouseEvent) => {
  if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
    setMenuOpen(false);
  }
};
useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

setLoggedIn(!!data.user);

if (data.user) {
  setUserEmail(data.user.email || "");
}
  };

  checkUser();

  const { data: listener } = supabase.auth.onAuthStateChange(() => {
    checkUser();
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <nav className="glass flex items-center justify-between rounded-2xl px-5 py-3">
          <Logo />
          <div className="hidden items-center gap-7 md:flex">
            <Link to="/" className="text-sm text-muted-foreground transition hover:text-foreground">
              Home
            </Link>
            <Link
              to="/dashboard"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
  to="/chat"
  search={{
    conversationId: "",
  }}
  className="text-sm text-muted-foreground transition hover:text-foreground"
>
  Chat
</Link>
          </div>
          <div className="flex items-center gap-2">
  {loggedIn ? (
  <div className="relative" ref={menuRef}>
    
  <button
    onClick={() => setMenuOpen((prev) => !prev)}
    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
  >
    <User size={18} />
  </button>

  <AnimatePresence>
    {menuOpen && (
      <motion.div
      
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 top-12 w-44 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5"
      >
        <div className="px-4 py-3 text-xs text-gray-500 border-b">
  {userEmail}
</div>
       <Link
  to="/profile"
  className="block w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-100"
  onClick={() => setMenuOpen(false)}
>
  My Profile
</Link>
        <div className="h-px bg-gray-100" />

        <button
          className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
          onClick={async () => {
            await supabase.auth.signOut();
setMenuOpen(false);
window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </motion.div>
    )}
  </AnimatePresence>
</div>

    
) : (
    <>
      <Link
        to="/login"
        className="rounded-xl px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        Sign in
      </Link>

      <Link
        to="/register"
        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Launch
      </Link>
    </>
  )}
</div>
        </nav>
      </div>
    </header>
  );
}
