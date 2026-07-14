import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import CalendlyEmbed, { CALENDLY_URL } from './CalendlyEmbed';

const Auditoria = () => {
  const { ref: leftRef, visible: leftVisible } = useReveal<HTMLDivElement>();
  const { ref: cardRef, visible: cardVisible } = useReveal<HTMLDivElement>();
  const [scheduled, setScheduled] = useState(false);

  return (
    <section id="auditoria" className="px-[clamp(20px,5vw,64px)] py-[clamp(64px,8vw,110px)] bg-ink2">
      <div className="max-w-[1160px] mx-auto grid gap-[clamp(36px,5vw,68px)] items-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div
          ref={leftRef}
          className={`transition-all duration-700 ease-out ${
            leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
          }`}
        >
          <div className="font-mono text-[11.5px] tracking-[2.6px] uppercase text-rust mb-[18px]">Auditoría gratuita</div>
          <h2 className="font-serif font-medium text-[clamp(28px,3.6vw,46px)] leading-[1.08] tracking-[-.5px] text-cream mb-5">
            Empieza por saber <span className="italic text-rustLight">cuántos casos estás perdiendo.</span>
          </h2>
          <p className="text-base leading-[1.65] text-slate mb-7 max-w-[440px]">
            Sin compromiso. Agenda directo en el calendario y revisamos tu captación con números claros en una sesión de hasta 60 minutos.
          </p>
          <div className="flex flex-col gap-3.5">
            <div className="flex gap-3 items-center text-[15px] text-cream">
              <span className="text-green">✓</span> Diagnóstico concreto de tu embudo actual
            </div>
            <div className="flex gap-3 items-center text-[15px] text-cream">
              <span className="text-green">✓</span> Estimación de cuánto representa eso en dinero al mes
            </div>
            <div className="flex gap-3 items-center text-[15px] text-cream">
              <span className="text-green">✓</span> Plan de implementación adaptado a tu tipo de trámite
            </div>
          </div>
        </div>

        <div
          ref={cardRef}
          className={`relative bg-cream text-ink2 p-[clamp(16px,2vw,24px)] rounded-sm shadow-[0_26px_50px_rgba(0,0,0,.34)] transition-all duration-700 ease-out delay-[80ms] ${
            cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
          }`}
        >
          {scheduled && (
            <div className="flex items-center gap-2.5 mb-3 px-3.5 py-3 bg-green/10 border border-green/30 rounded-sm text-green text-sm">
              <span className="text-base">✓</span> Cita agendada — revisa tu correo para la confirmación.
            </div>
          )}
          <CalendlyEmbed onScheduled={() => setScheduled(true)} />
          <p className="text-[11.5px] leading-[1.5] text-[#7a8288] mt-2 px-1">
            Tus datos se tratan conforme a la LFPDPPP. Calendly gestiona la confirmación y los recordatorios de tu cita.
          </p>
          <p className="text-[11.5px] leading-[1.5] text-[#7a8288] mt-1.5 px-1">
            ¿No carga el calendario?{' '}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-rust hover:text-rustLight"
            >
              Ábrelo en una pestaña nueva
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default Auditoria;
