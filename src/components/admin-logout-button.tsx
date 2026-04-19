"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

type AdminLogoutButtonProps = {
  className: string;
};

export default function AdminLogoutButton({ className }: AdminLogoutButtonProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      const response = await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Sign out failed.");
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsSigningOut(false);
      alert("Failed to sign out. Please try again.");
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={() => void handleSignOut()}
      disabled={isSigningOut}
      aria-busy={isSigningOut}
    >
      <LogOut size={18} />
      {isSigningOut ? "Signing out..." : "Logout"}
    </button>
  );
}
