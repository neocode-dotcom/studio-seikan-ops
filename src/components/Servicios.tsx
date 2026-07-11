import type { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

type Servicio = {
  index: string;
  title: string;
  body: ReactNode;
  isLast?: boolean;
};

const servicios: Servicio[] = [
  {
    index: '01',
    title: 'Sitio de alta conversión',
    body: 'Una página construida para una sola cosa: convertir la visita en una consulta agendada. Estructura clara del servicio, prueba de autoridad y un solo camino a la acción.',
  },
  {
    index: '02',
    title: 'Meta Ads con creativos IA',
    body: 'Campañas segmentadas por tipo de trámite y zona, con creativos generados y probados con IA. Llegamos a quien busca resolver su situación migratoria hoy.',
  },
  {
    index: '03',
    title: 'Bot de WhatsApp',
    body: (
      <>
        Responde en segundos, a cualquier hora. Su función es <strong className="text-cream font-medium">calificar y agendar</strong> — reúne los datos del caso y reserva la cita. Nunca ofrece asesoría legal: eso es trabajo del abogado.
      </>
    ),
  },
  {
    index: '04',
    title: 'CRM con IA',
    body: 'Cada prospecto queda registrado, priorizado y con seguimiento automático. Recordatorios de cita para reducir el no-show y visibilidad total del embudo del despacho.',
    isLast: true,
  },
];

const ServicioRow = ({ servicio }: { servicio: Servicio }) => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`flex items-start gap-[clamp(20px,4vw,52px)] py-8 border-t border-slate/[.18] flex-wrap transition-all duration-[750ms] ease-out ${
        servicio.isLast ? 'border-b' : ''
      } ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}
    >
      <div className="font-mono text-[15px] tracking-[2px] text-rust pt-2 flex-none">{servicio.index}</div>
      <div className="flex-[1_1_260px] min-w-[220px]">
        <h3 className="font-serif font-medium text-[clamp(22px,2.4vw,30px)] text-cream mb-1.5">{servicio.title}</h3>
      </div>
      <p className="flex-[1_1_320px] min-w-[240px] text-[15px] leading-[1.6] text-slate pt-1.5">{servicio.body}</p>
    </div>
  );
};

const Servicios = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="servicios" className="px-[clamp(20px,5vw,64px)] py-[clamp(64px,8vw,110px)] bg-ink">
      <div className="max-w-[1100px] mx-auto">
        <div
          ref={ref}
          className={`max-w-[660px] mb-[clamp(40px,5vw,64px)] transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
          }`}
        >
          <div className="font-mono text-[11.5px] tracking-[2.6px] uppercase text-rust mb-[18px]">02 — La solución</div>
          <h2 className="font-serif font-medium text-[clamp(28px,3.6vw,44px)] leading-[1.1] tracking-[-.4px] text-cream mb-4">
            Un sistema. <span className="italic text-slate">Cuatro piezas que trabajan juntas.</span>
          </h2>
          <p className="text-base leading-[1.65] text-slate">
            No vendemos herramientas sueltas. Construimos un flujo completo, del primer clic a la cita confirmada en tu agenda.
          </p>
        </div>

        <div className="flex flex-col">
          {servicios.map((servicio) => (
            <ServicioRow key={servicio.index} servicio={servicio} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Servicios;
