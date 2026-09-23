"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export function LogoutButton() {
  const t = useTranslations("auth.logout");
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        setLoading(true);
        await logout();
        router.push("/");
        router.refresh();
      }}
      disabled={loading}
      className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground underline-offset-4 hover:underline disabled:opacity-50"
    >
      {loading ? t("submitting") : t("submit")}
    </button>
  );
}
