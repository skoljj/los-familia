"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import NavBar from "@/components/NavBar";
import Timeline from "@/components/Timeline";
import StarCounter from "@/components/StarCounter";

export default function TimelinePage() {
  const { member, family, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !member) router.replace("/login");
  }, [member, loading, router]);

  if (!member || !family) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <NavBar />
      <main className="max-w-lg mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hi, {member.name}!</h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <StarCounter count={member.star_balance} size="lg" />
        </div>

        <Timeline
          memberId={member.id}
          familyId={family.id}
          isParent={false}
        />
      </main>
    </div>
  );
}
