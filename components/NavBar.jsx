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
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">
            LOS Familia
          </Link>
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
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

        <div className="flex items-center gap-3">
          {!isParent && <StarCounter count={member.star_balance} />}
          <span className="text-sm text-muted-foreground">{member.name}</span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Switch
          </Button>
        </div>
      </div>
    </nav>
  );
}
