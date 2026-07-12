// Dashboard (Módulo 4, puntos 1-3): seguimientos de hoy, embudo visual y
// tasa de respuesta por canal.
import { SeguimientosHoy } from "@/components/dashboard/SeguimientosHoy";
import { EmbudoVisual } from "@/components/dashboard/EmbudoVisual";
import { TasaRespuesta } from "@/components/dashboard/TasaRespuesta";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-5 text-2xl text-paper">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="lg:row-span-2">
          <SeguimientosHoy />
        </div>
        <EmbudoVisual />
        <TasaRespuesta />
      </div>
    </div>
  );
}
