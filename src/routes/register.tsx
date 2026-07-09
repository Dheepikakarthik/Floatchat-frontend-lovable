import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — FloatChat" },
      { name: "description", content: "Create your FloatChat account." },
    ],
  }),
  component: () => <AuthShell mode="register" />,
});
