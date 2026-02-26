"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import StarCounter from "./StarCounter";
import { Button } from "@/components/ui/button";

const PARENT_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
  { href: "/calendar", label: "Calendar" },
];

const CHILD_LINKS = [
  { href: "/timeline", label: "My Day" },
  { href: "/stars", label: "Stars" },
];

export default function NavBar() {
  const { member, logout, isParent } = useAuth();
  const pathname = usePathname();

  if (!member) return null;

  const links = isParent ? PARENT_LINKS : CHILD_LINKS;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 gap-2">
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <Link href="/" className="font-bold text-base sm:text-lg shrink-0">
            LOS Familia
          </Link>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] flex items-center ${
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isParent && <StarCounter count={member.star_balance} />}
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {member.name}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="min-h-[44px] min-w-[44px]"
          >
            Switch
          </Button>
        </div>
      </div>
    </nav>
  );
}
