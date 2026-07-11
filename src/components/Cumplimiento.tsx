import { useReveal } from '../hooks/useReveal';

const puntos = [
  {
    title: 'Sin promesas de resultado',
    body: 'Ningún mensaje promete aprobaciones ni resultados legales. Comunicamos servicio y experiencia, no garantías.',
  },
  {
    title: 'El bot califica y agenda, nunca asesora',
    body: 'La automatización reúne información y reserva la cita. La asesoría legal siempre queda en manos del abogado.',
  },
  {
    title: 'Datos personales conforme a la LFPDPPP',
    body: 'Manejo de datos de los prospectos conforme a la ley mexicana de protección de datos, con aviso de privacidad claro.',
  },
  {
    title: 'Trazabilidad y consentimiento',
    body: 'Cada contacto queda registrado con su origen y consentimiento, listo para auditar cuando lo necesites.',
  },
];

const Cumplimiento = () => {
  const { ref: cardRef, visible: cardVisible } = useReveal<HTMLDivElement>();
  const { ref: textRef, visible: textVisible } = useReveal<HTMLDivElement>();

  return (
    <section id="cumplimiento" className="px-[clamp(20px,5vw,64px)] py-[clamp(64px,8vw,110px)] bg-ink2">
      <div className="max-w-[1160px] mx-auto grid gap-[clamp(32px,5vw,64px)] items-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div
          ref={cardRef}
          className={`relative bg-cream text-ink2 p-[clamp(36px,4vw,52px)] rounded-sm shadow-[0_24px_46px_rgba(0,0,0,.3)] text-center transition-all duration-700 ease-out ${
            cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
          }`}
        >
          <div className="relative w-[170px] h-[170px] mx-auto mb-6">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-6">
              <circle cx="100" cy="100" r="92" fill="none" stroke="#3E6E5E" strokeWidth="3" />
              <circle cx="100" cy="100" r="82" fill="none" stroke="#3E6E5E" strokeWidth="1.2" strokeOpacity=".6" />
              <defs>
                <path id="okArc" d="M 100,100 m -66,0 a 66,66 0 1,1 132,0 a 66,66 0 1,1 -132,0" />
              </defs>
              <text fontFamily="'IBM Plex Mono',monospace" fontSize="12" fontWeight="500" letterSpacing="4" fill="#3E6E5E">
                <textPath href="#okArc" startOffset="2%">CUMPLIMIENTO · VERIFICADO · </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center -rotate-6">
              <span className="font-serif font-semibold text-[52px] text-green">OK</span>
            </div>
          </div>
          <div className="font-serif font-medium text-[clamp(20px,2.4vw,26px)] leading-[1.25] mb-3">
            Construido con las reglas de tu profesión en mente.
          </div>
          <p className="text-[14.5px] leading-[1.6] text-[#3E4a54]">
            Publicidad responsable de servicios legales. Sin promesas de resultado, con trazabilidad y consentimiento en cada contacto.
          </p>
        </div>

        <div
          ref={textRef}
          className={`transition-all duration-700 ease-out delay-100 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
          }`}
        >
          <div className="font-mono text-[11.5px] tracking-[2.6px] uppercase text-green mb-4">03 — Cumplimiento</div>
          <h2 className="font-serif font-medium text-[clamp(26px,3.2vw,40px)] leading-[1.12] tracking-[-.4px] text-cream mb-[30px]">
            Tecnología que respeta las reglas de tu profesión.
          </h2>
          <div className="flex flex-col gap-[22px]">
            {puntos.map((punto) => (
              <div key={punto.title} className="flex gap-4 items-start">
                <span className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-green text-cream text-[15px]">✓</span>
                <div>
                  <div className="font-serif font-medium text-lg text-cream mb-1">{punto.title}</div>
                  <p className="text-[14.5px] leading-[1.55] text-slate">{punto.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cumplimiento;
