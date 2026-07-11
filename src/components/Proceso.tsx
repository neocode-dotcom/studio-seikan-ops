import { useReveal } from '../hooks/useReveal';

const pasos = [
  {
    num: '01',
    rotate: '-rotate-6',
    title: 'Auditoría gratuita',
    body: 'Revisamos tu captación actual — sitio, anuncios, tiempos de respuesta — y detectamos dónde se pierden los casos.',
  },
  {
    num: '02',
    rotate: 'rotate-[5deg]',
    title: 'Diagnóstico con números',
    body: 'Te entregamos un diagnóstico concreto: cuántos leads pierdes, en qué etapa y qué impacto tiene sobre tu agenda.',
  },
  {
    num: '03',
    rotate: '-rotate-[4deg]',
    title: 'Implementación',
    body: 'Montamos el sistema completo — sitio, campañas, bot y CRM — configurado a tu tipo de trámite y tu forma de trabajar.',
  },
  {
    num: '04',
    rotate: 'rotate-[7deg]',
    title: 'Seguimiento continuo',
    body: 'Revisamos métricas cada mes y ajustamos campañas y flujos. El sistema mejora mientras tú te dedicas a los casos.',
  },
];

const PasoCard = ({ paso }: { paso: (typeof pasos)[number] }) => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`bg-ink2 border border-slate/[.15] rounded-sm p-[32px_26px] transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
      }`}
    >
      <span className={`flex items-center justify-center w-16 h-16 rounded-full border-2 border-rust shadow-[inset_0_0_0_3px_rgba(166,54,42,0.16)] font-mono text-lg text-rustLight mb-[22px] ${paso.rotate}`}>
        {paso.num}
      </span>
      <h3 className="font-serif font-medium text-xl text-cream mb-2">{paso.title}</h3>
      <p className="text-sm leading-[1.55] text-slate">{paso.body}</p>
    </div>
  );
};

const Proceso = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="proceso" className="px-[clamp(20px,5vw,64px)] py-[clamp(64px,8vw,110px)] bg-ink">
      <div className="max-w-[1240px] mx-auto">
        <div
          ref={ref}
          className={`max-w-[640px] mb-[clamp(40px,5vw,64px)] transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
          }`}
        >
          <div className="font-mono text-[11.5px] tracking-[2.6px] uppercase text-rust mb-[18px]">04 — El proceso</div>
          <h2 className="font-serif font-medium text-[clamp(28px,3.6vw,44px)] leading-[1.1] tracking-[-.4px] text-cream">
            Cómo trabajamos contigo.
          </h2>
        </div>

        <div className="grid gap-[clamp(18px,2vw,26px)]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
          {pasos.map((paso) => (
            <PasoCard key={paso.num} paso={paso} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Proceso;
