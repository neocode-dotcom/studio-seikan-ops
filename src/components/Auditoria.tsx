import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { CALENDLY_URL, openCalendlyPopup, useCalendlyScheduled } from '../hooks/useCalendly';

const Auditoria = () => {
  const { ref: leftRef, visible: leftVisible } = useReveal<HTMLDivElement>();
  const { ref: cardRef, visible: cardVisible } = useReveal<HTMLDivElement>();
  const [scheduled, setScheduled] = useState(false);
  useCalendlyScheduled(() => setScheduled(true));

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
          className={`relative bg-cream text-ink2 p-[clamp(32px,4vw,48px)] rounded-sm shadow-[0_26px_50px_rgba(0,0,0,.34)] text-center flex flex-col items-center gap-4 transition-all duration-700 ease-out delay-[80ms] ${
            cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
          }`}
        >
          {scheduled ? (
            <>
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-green/15 text-green text-2xl">✓</span>
              <div className="font-serif font-medium text-xl text-ink2">Cita agendada</div>
              <p className="text-sm leading-[1.6] text-[#3E4a54] max-w-[280px]">
                Revisa tu correo para la confirmación y los detalles de la sesión.
              </p>
            </>
          ) : (
            <>
              <div className="font-mono text-[11px] tracking-[2.4px] uppercase text-rust">Agenda en un clic</div>
              <p className="text-[15px] leading-[1.6] text-[#3E4a54] max-w-[300px]">
                Elige el día y la hora que te acomoden — el calendario se abre en una ventana emergente.
              </p>
              <button
                type="button"
                onClick={() => openCalendlyPopup()}
                className="mt-1 px-7 py-[15px] bg-rust text-cream rounded-sm font-mono text-[13px] tracking-[1.4px] uppercase cursor-pointer hover:bg-rustLight transition-colors"
              >
                Agendar mi auditoría →
              </button>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#7a8288] underline hover:text-rust"
              >
                O ábrelo en una pestaña nueva
              </a>
            </>
          )}
          <p className="text-[11px] leading-[1.5] text-[#7a8288] mt-1">
            Tus datos se tratan conforme a la LFPDPPP. Calendly gestiona la confirmación y los recordatorios de tu cita.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Auditoria;
