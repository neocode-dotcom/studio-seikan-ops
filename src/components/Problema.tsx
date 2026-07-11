import { useReveal } from '../hooks/useReveal';

type Stat = {
  badge: number;
  badgeRotate: string;
  cardRotate: string;
  value: string;
  suffix: string;
  title: string;
  body: string;
};

const stats: Stat[] = [
  {
    badge: 1,
    badgeRotate: '-rotate-[11deg]',
    cardRotate: 'rotate-[-1.6deg]',
    value: '42',
    suffix: ' HRS',
    title: 'Tiempo de respuesta promedio',
    body: 'El lead promedio espera casi dos días hábiles por una primera respuesta. Para entonces, ya habló con otro despacho.',
  },
  {
    badge: 2,
    badgeRotate: 'rotate-[9deg]',
    cardRotate: 'rotate-[1.4deg]',
    value: '14',
    suffix: ' %',
    title: 'Conversión de lead a consulta',
    body: 'La mayoría de los prospectos que llegan nunca llegan a agendar. No por falta de interés — por falta de seguimiento.',
  },
  {
    badge: 3,
    badgeRotate: 'rotate-[-8deg]',
    cardRotate: 'rotate-[-1.2deg]',
    value: '35',
    suffix: ' %',
    title: 'Llamadas perdidas fuera de horario',
    body: 'Una parte importante de los contactos llega de noche y en fin de semana, cuando nadie del despacho está disponible.',
  },
  {
    badge: 4,
    badgeRotate: 'rotate-[12deg]',
    cardRotate: 'rotate-[1.8deg]',
    value: '1/5',
    suffix: '',
    title: 'Consultas agendadas que no se presentan',
    body: 'Sin recordatorios automáticos, uno de cada cinco prospectos que agenda una cita simplemente no llega (no-show).',
  },
];

const StatCard = ({ stat }: { stat: Stat }) => {
  const { ref, visible } = useReveal<HTMLElement>();
  return (
    <article
      ref={ref}
      className={`relative bg-cream text-ink2 p-[34px_28px_30px] rounded-sm shadow-[0_22px_40px_rgba(0,0,0,.28)] transition-all duration-700 ease-out ${
        visible ? `opacity-100 translate-y-0 ${stat.cardRotate}` : 'opacity-0 translate-y-7'
      }`}
    >
      <span className={`absolute top-4 right-4 flex items-center justify-center w-[52px] h-[52px] rounded-full border-[1.5px] border-rust/[.55] shadow-[inset_0_0_0_3px_rgba(166,54,42,0.14)] font-mono text-[10px] tracking-[1px] text-rust ${stat.badgeRotate}`}>
        {String(stat.badge).padStart(2, '0')}
      </span>
      <div className="font-mono font-medium text-[clamp(48px,6vw,64px)] leading-none text-rust">
        {stat.value}
        <span className="text-2xl tracking-[1px]">{stat.suffix}</span>
      </div>
      <div className="font-serif font-medium text-lg my-3.5 mb-2">{stat.title}</div>
      <p className="text-sm leading-[1.55] text-[#3E4a54]">{stat.body}</p>
    </article>
  );
};

const Problema = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="px-[clamp(20px,5vw,64px)] py-[clamp(64px,8vw,110px)] bg-ink2">
      <div className="max-w-[1240px] mx-auto">
        <div
          ref={ref}
          className={`max-w-[640px] mb-[clamp(40px,5vw,64px)] transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
          }`}
        >
          <div className="font-mono text-[11.5px] tracking-[2.6px] uppercase text-rust mb-[18px]">01 — El problema</div>
          <h2 className="font-serif font-medium text-[clamp(28px,3.6vw,44px)] leading-[1.1] tracking-[-.4px] text-cream mb-4">
            El talento no es el cuello de botella. <span className="italic text-slate">El tiempo lo es.</span>
          </h2>
          <p className="text-base leading-[1.65] text-slate">
            Los datos del sector migratorio son consistentes: los clientes no eligen al mejor abogado, eligen al primero que responde.
          </p>
        </div>

        <div className="grid gap-[clamp(18px,2vw,26px)]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {stats.map((stat) => (
            <StatCard key={stat.badge} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problema;
