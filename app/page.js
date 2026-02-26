"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { member, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!member) {
      router.replace("/login");
    } else if (member.role === "parent") {
      router.replace("/dashboard");
    } else {
      router.replace("/timeline");
    }
  }, [member, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">LOS Familia</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
