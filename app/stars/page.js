"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import NavBar from "@/components/NavBar";
import StarCounter from "@/components/StarCounter";
import { Card, CardContent } from "@/components/ui/card";

export default function StarsPage() {
  const { member, loading } = useAuth();
  const router = useRouter();
  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    if (!loading && !member) router.replace("/login");
  }, [member, loading, router]);

  useEffect(() => {
    if (!member) return;
    async function load() {
      const supabase = getSupabaseBrowser();
      const { data } = await supabase
        .from("star_ledger")
        .select("*, tasks(title)")
        .eq("member_id", member.id)
        .order("earned_at", { ascending: false })
        .limit(50);
      if (data) setLedger(data);
    }
    load();
  }, [member]);

  if (!member) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <NavBar />
      <main className="max-w-lg mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">My Stars</h1>
          <StarCounter count={member.star_balance} size="lg" />
        </div>

        <h2 className="font-semibold text-lg">Recent</h2>
        {ledger.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No stars earned yet. Complete tasks to earn stars!
          </p>
        )}
        <div className="space-y-2">
          {ledger.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <span className="font-medium text-sm">
                    {entry.tasks?.title || "Bonus"}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.earned_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="text-amber-500 font-bold text-lg">
                  +{entry.stars} &#9733;
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
