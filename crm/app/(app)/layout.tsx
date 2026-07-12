// Layout de las rutas autenticadas. El proxy (proxy.ts) ya redirige a /login a
// los no autenticados; aquí solo envolvemos con el shell de navegación.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Shell } from "@/components/Shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defensa en profundidad ante fallo del proxy.
  if (!user) redirect("/login");

  return <Shell>{children}</Shell>;
}
