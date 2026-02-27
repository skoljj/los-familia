"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import NavBar from "@/components/NavBar";
import Timeline from "@/components/Timeline";
import StarCounter from "@/components/StarCounter";
import DateNavigator from "@/components/DateNavigator";

export default function TimelinePage() {
  const { member, family, loading } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (!loading && !member) router.replace("/login");
  }, [member, loading, router]);

  if (!member || !family) return null;

  const dateObj = new Date(selectedDate + "T12:00:00");
  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <NavBar />
      <main className="max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hi, {member.name}!</h1>
            <p className="text-sm text-muted-foreground">
              {dateObj.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <StarCounter count={member.star_balance} size="lg" />
        </div>

        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          isParent={false}
        />

        <Timeline
          key={selectedDate}
          memberId={member.id}
          familyId={family.id}
          isParent={false}
          date={selectedDate}
        />
      </main>
    </div>
  );
}
