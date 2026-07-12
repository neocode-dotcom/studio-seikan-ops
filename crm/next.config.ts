import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // El repo tiene otro package-lock en la raíz (la landing page). Fijamos la
  // raíz de Turbopack a esta carpeta para que el deploy con Root Directory=crm
  // infiera el workspace correcto.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
