import { redirect } from "next/navigation";

// Root path redirects to the dashboard (inside the (clinic) route group).
// This runs on the server — no JS shipped to the client for this route.
export default function RootPage() {
  redirect("/dashboard");
}
