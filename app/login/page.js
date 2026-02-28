"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
];

export default function LoginPage() {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { login, member } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (member) {
      router.replace(member.role === "parent" ? "/dashboard" : "/timeline");
    }
  }, [member, router]);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowser();
      const { data } = await supabase
        .from("family_members")
        .select("id, name, role, avatar_url")
        .order("role", { ascending: false })
        .order("name");
      if (data) setMembers(data);
    }
    load();
  }, []);

  async function handleLogin() {
    if (!selected) return;
    setError("");
    try {
      const m = await login(selected.id, pin);
      router.replace(m.role === "parent" ? "/dashboard" : "/timeline");
    } catch (e) {
      setError(e.message);
      setPin("");
    }
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  if (member) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100 p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-2">LOS Familia</h1>
        <p className="text-center text-muted-foreground mb-8">
          Who are you?
        </p>

        {!selected ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {members.map((m, i) => (
              <Card
                key={m.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer hover:ring-2 hover:ring-primary transition-all active:scale-95"
                onClick={() => setSelected(m)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(m)}
              >
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <div
                    className={`w-16 h-16 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xl font-bold`}
                  >
                    {getInitials(m.name)}
                  </div>
                  <span className="font-medium text-sm">{m.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {m.role}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mx-auto max-w-xs">
            <CardContent className="flex flex-col items-center gap-4 p-6">
              <div
                className={`w-20 h-20 rounded-full ${AVATAR_COLORS[members.findIndex((m) => m.id === selected.id) % AVATAR_COLORS.length]} flex items-center justify-center text-white text-2xl font-bold`}
              >
                {getInitials(selected.name)}
              </div>
              <span className="text-lg font-semibold">{selected.name}</span>

              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="text-center text-2xl tracking-[0.5em] h-14"
                autoFocus
              />

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelected(null);
                    setPin("");
                    setError("");
                  }}
                >
                  Back
                </Button>
                <Button className="flex-1" onClick={handleLogin}>
                  Go
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
