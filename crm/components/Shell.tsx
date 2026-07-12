"use client";

// Shell de la app autenticada: nav superior con identidad de marca
// (motivo del sello, paleta tinta/papel/rojo-sello) + cerrar sesión.
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { SelloIcon } from "@/components/ui/SelloIcon";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/prospectos", label: "Prospectos" },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [cerrando, setCerrando] = useState(false);

  async function cerrarSesion() {
    setCerrando(true);
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <SelloIcon className="h-8 w-8 text-stamp" />
            <div className="leading-tight">
              <div className="text-paper text-sm">Studio Seikan</div>
              <div className="label-field text-[0.6rem]">CRM · Prospección</div>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-[rgba(166,54,42,0.14)] text-stamp-light"
                      : "text-muted hover:text-paper"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={cerrarSesion}
            disabled={cerrando}
            className="btn btn-ghost ml-auto text-xs"
          >
            {cerrando ? "Saliendo…" : "Cerrar sesión"}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
