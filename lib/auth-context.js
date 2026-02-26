"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSupabaseBrowser } from "./supabase-client";

const AuthContext = createContext(null);

const STORAGE_KEY = "los_familia_member";

export function AuthProvider({ children }) {
  const [member, setMember] = useState(null);
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMember(parsed.member);
        setFamily(parsed.family);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (memberId, pin) => {
    const supabase = getSupabaseBrowser();

    const { data: memberData, error: memberError } = await supabase
      .from("family_members")
      .select("*, families(*)")
      .eq("id", memberId)
      .single();

    if (memberError || !memberData) {
      throw new Error("Member not found");
    }

    if (memberData.pin && memberData.pin !== pin) {
      throw new Error("Incorrect PIN");
    }

    const familyData = memberData.families;
    const cleanMember = { ...memberData };
    delete cleanMember.families;

    setMember(cleanMember);
    setFamily(familyData);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ member: cleanMember, family: familyData })
    );

    return cleanMember;
  }, []);

  const logout = useCallback(() => {
    setMember(null);
    setFamily(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{ member, family, loading, login, logout, isParent: member?.role === "parent" }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
