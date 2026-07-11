import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const Auditoria = () => {
  const { ref: leftRef, visible: leftVisible } = useReveal<HTMLDivElement>();
  const { ref: cardRef, visible: cardVisible } = useReveal<HTMLDivElement>();
  const [submitted, setSubmitted] = useState(false);
  const stampRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!submitted || animatedRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const el = stampRef.current;
    if (el) {
      animatedRef.current = true;
      el.style.animation = 'stampImpactGreen .85s cubic-bezier(.2,1.35,.3,1) both';
    }
  }, [submitted]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            Sin compromiso. Revisamos tu captación y te entregamos un diagnóstico con números claros en menos de una semana.
          </p>
          <div className="flex flex-col gap-3.5">
            <div className="flex gap-3 items-center text-[15px] text-cream">
              <span className="text-green">✓</span> Diagnóstico concreto de tu embudo actual
            </div>
            <div className="flex gap-3 items-center text-[15px] text-cream">
              <span className="text-green">✓</span> Estimación de casos perdidos por tiempo de respuesta
            </div>
            <div className="flex gap-3 items-center text-[15px] text-cream">
              <span className="text-green">✓</span> Plan de implementación adaptado a tu tipo de trámite
            </div>
          </div>
        </div>

        <div
          ref={cardRef}
          className={`relative bg-cream text-ink2 p-[clamp(30px,3.5vw,44px)] rounded-sm shadow-[0_26px_50px_rgba(0,0,0,.34)] min-h-[420px] transition-all duration-700 ease-out delay-[80ms] ${
            cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
          }`}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
              <div className="font-mono text-[11px] tracking-[2.4px] uppercase text-rust mb-0.5">Solicitud de auditoría</div>
              <label className="flex flex-col gap-[7px] font-mono text-[11px] tracking-[1.4px] uppercase text-[#5a6670]">
                Nombre completo
                <input
                  type="text"
                  name="nombre"
                  required
                  placeholder="Lic. Nombre Apellido"
                  className="px-3.5 py-[13px] bg-white border border-[#c9c2b3] rounded-sm text-[15px] text-ink2 font-light normal-case tracking-normal focus:outline-none focus:border-rust"
                />
              </label>
              <label className="flex flex-col gap-[7px] font-mono text-[11px] tracking-[1.4px] uppercase text-[#5a6670]">
                Despacho
                <input
                  type="text"
                  name="despacho"
                  required
                  placeholder="Nombre del despacho"
                  className="px-3.5 py-[13px] bg-white border border-[#c9c2b3] rounded-sm text-[15px] text-ink2 font-light normal-case tracking-normal focus:outline-none focus:border-rust"
                />
              </label>
              <label className="flex flex-col gap-[7px] font-mono text-[11px] tracking-[1.4px] uppercase text-[#5a6670]">
                WhatsApp
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  placeholder="+52 55 0000 0000"
                  className="px-3.5 py-[13px] bg-white border border-[#c9c2b3] rounded-sm text-[15px] text-ink2 font-light normal-case tracking-normal focus:outline-none focus:border-rust"
                />
              </label>
              <label className="flex flex-col gap-[7px] font-mono text-[11px] tracking-[1.4px] uppercase text-[#5a6670]">
                Área migratoria
                <select
                  name="area"
                  required
                  defaultValue=""
                  className="px-3.5 py-[13px] bg-white border border-[#c9c2b3] rounded-sm text-[15px] text-ink2 font-light normal-case tracking-normal focus:outline-none focus:border-rust"
                >
                  <option value="" disabled>Selecciona un área</option>
                  <option value="visas">Visas</option>
                  <option value="residencia">Residencia</option>
                  <option value="asilo">Asilo</option>
                  <option value="naturalizacion">Naturalización</option>
                  <option value="otro">Otro / General</option>
                </select>
              </label>
              <button
                type="submit"
                className="mt-1.5 py-[15px] bg-rust text-cream rounded-sm font-mono text-[13px] tracking-[1.4px] uppercase cursor-pointer hover:bg-rustLight transition-colors"
              >
                Solicitar auditoría gratuita →
              </button>
              <p className="text-[11.5px] leading-[1.5] text-[#7a8288] mt-0.5">
                Tus datos se tratan conforme a la LFPDPPP. Usamos esta información únicamente para contactarte sobre tu auditoría.
              </p>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center text-center min-h-[380px] gap-[26px]">
              <div ref={stampRef} className="relative w-[200px] h-[200px] rotate-[-4deg]">
                <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
                  <defs>
                    <path id="recibidaArc" d="M 110,110 m -84,0 a 84,84 0 1,1 168,0 a 84,84 0 1,1 -168,0" />
                  </defs>
                  <circle cx="110" cy="110" r="100" fill="none" stroke="#3E6E5E" strokeWidth="3.5" />
                  <circle cx="110" cy="110" r="89" fill="none" stroke="#3E6E5E" strokeWidth="1.2" strokeOpacity=".6" />
                  <text fontFamily="'IBM Plex Mono',monospace" fontSize="12.5" fontWeight="500" letterSpacing="3.6" fill="#3E6E5E">
                    <textPath href="#recibidaArc" startOffset="0">SOLICITUD RECIBIDA · STUDIO SEIKAN · </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-green">
                  <span className="text-[40px] leading-none">✓</span>
                  <span className="font-mono text-[11px] tracking-[2px] mt-2">RECIBIDA</span>
                </div>
              </div>
              <div>
                <div className="font-serif font-medium text-2xl text-ink2 mb-2">Gracias, tu solicitud fue registrada.</div>
                <p className="text-[14.5px] leading-[1.6] text-[#3E4a54] max-w-[320px]">
                  Un especialista de Studio Seikan te contactará por WhatsApp en menos de 24 horas para agendar tu auditoría.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Auditoria;
