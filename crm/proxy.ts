// Next.js 16 renombró la convención `middleware` a `proxy`.
// Refresca la sesión de Supabase y protege todas las rutas excepto /login.
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Protege todo excepto archivos estáticos y assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
