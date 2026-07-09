import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createFileRoute } from "@tanstack/react-router";
import { OceanBackground } from "@/components/ocean/OceanBackground";
import { NavBar } from "@/components/ocean/NavBar";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [chatCount, setChatCount] = useState(0);
  const [createdAt, setCreatedAt] = useState("");
  const [bio, setBio] = useState("");
  const [institution, setInstitution] = useState("");
  const [editing, setEditing] = useState(false);
  const saveProfile = async () => {
  const { data } = await supabase.auth.getUser();

  if (!data.user) return;

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: data.user.id,
      name,
      bio,
      institution,
    });

  if (error) {
    alert("Failed to save profile");
    console.log(error);
  } else {
    alert("Profile saved!");
    setEditing(false);
  }
};
useEffect(() => {
  
  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
  setEmail(data.user.email || "");

  setName(
    data.user.user_metadata?.name ||
    data.user.email?.split("@")[0] ||
    "User"
  );
  setCreatedAt(
  new Date(data.user.created_at).toLocaleDateString()
);
  const { count } = await supabase
  .from("messages")
  .select("*", {
    count: "exact",
    head: true,
  })
  .eq("user_id", data.user.id);

setChatCount(count || 0);
const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", data.user.id)
  .single();

if (profile) {
  setBio(profile.bio || "");
  setInstitution(profile.institution || "");
}
}
  };

  loadUser();
}, []);
  return (
    <div className="relative min-h-screen">
      <OceanBackground density={15} />
      <NavBar />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-32">
        <div className="rounded-3xl bg-white/95 p-10 shadow-2xl">
          <h1 className="text-3xl font-bold text-black">
  My Profile
</h1>

  <div className="mt-8 text-black">

  <div className="flex items-center gap-6">

    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-3xl font-bold text-white">
      {name.charAt(0).toUpperCase()}
    </div>

    <div>
      <h2 className="text-2xl font-semibold">
        {name}
      </h2>

      <p className="text-gray-600">
        Ocean Explorer
      </p>

      <p className="text-gray-500">
  {email}
</p>

<p className="text-sm text-gray-400">
  Member since: {createdAt}
</p>
    </div>

  </div>

  <div className="mt-8 grid grid-cols-3 gap-4">

    <div className="rounded-xl bg-slate-100 p-4">
      <div className="text-2xl font-bold">
  {chatCount}
</div>
      <div className="text-sm text-gray-600">
        Chats
      </div>
    </div>

    <div className="rounded-xl bg-slate-100 p-4">
      <div className="text-2xl font-bold">8</div>
      <div className="text-sm text-gray-600">
        Reports
      </div>
    </div>

    <div className="rounded-xl bg-slate-100 p-4">
      <div className="text-2xl font-bold">Pro</div>
      <div className="text-sm text-gray-600">
        Plan
      </div>
    </div>

  </div>

  <div className="mt-8 rounded-xl bg-slate-100 p-5">
  <h3 className="text-lg font-semibold">
    About Me
  </h3>
  <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4">
  <div className="font-semibold text-cyan-700">
    🌊 Ocean Explorer
  </div>

  <div className="text-sm text-cyan-600">
    Completed your first FloatChat conversation.
  </div>
</div>

  <p className="mt-2 text-gray-600">
  {bio || "No bio added yet."}
</p>

<p className="mt-2 text-sm text-gray-500">
  {institution || "No institution added."}
</p>
</div>
<button
  type="button"
  onClick={() => setEditing(!editing)}
  className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 text-white hover:bg-cyan-600"
>
  {editing ? "Cancel" : "Edit Profile"}
</button>

{editing && (
  <div className="mt-6 space-y-4">

    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Your Name"
      className="w-full rounded-lg border p-3"
    />

    <input
      value={institution}
      onChange={(e) => setInstitution(e.target.value)}
      placeholder="Institution"
      className="w-full rounded-lg border p-3"
    />

    <textarea
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      placeholder="Tell us about yourself"
      className="w-full rounded-lg border p-3"
    />

    <button
      type="button"
      onClick={saveProfile}
      className="rounded-xl bg-green-500 px-6 py-3 text-white"
    >
      Save Profile
    </button>

  </div>
)}

</div>
        </div>
      </div>
    </div>
  );
}