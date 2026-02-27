"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { localDateString } from "@/lib/time-utils";
import NavBar from "@/components/NavBar";
import Timeline from "@/components/Timeline";
import StarCounter from "@/components/StarCounter";
import DateNavigator from "@/components/DateNavigator";

export default function TimelinePage() {
  const { member, family, loading } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(() => localDateString());

  useEffect(() => {
    if (!loading && !member) router.replace("/login");
  }, [member, loading, router]);

  if (!member || !family) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <NavBar />
      <DateNavigator
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        isParent={false}
      />
      <main className="max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Hi, {member.name}!</h1>
          <StarCounter count={member.star_balance} size="lg" />
        </div>

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
