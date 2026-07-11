const Hero = () => {
  return (
    <header
      id="top"
      className="relative px-[clamp(20px,5vw,64px)] pt-[clamp(56px,9vw,110px)] pb-[clamp(64px,9vw,120px)] bg-ink overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(rgba(27,43,56,.9) 1px,transparent 1px),linear-gradient(90deg,rgba(27,43,56,.9) 1px,transparent 1px)',
        backgroundSize: '46px 46px',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 80% at 78% 30%,rgba(18,32,43,0) 40%,rgba(18,32,43,.75) 100%)',
        }}
      />
      <div className="relative max-w-[1240px] mx-auto flex flex-wrap items-center gap-[clamp(32px,5vw,64px)]">
        <div className="flex-[1_1_460px] min-w-[320px]">
          <div className="inline-flex items-center gap-2.5 font-mono text-[11.5px] tracking-[2.6px] uppercase text-slate mb-[26px]">
            <span className="w-7 h-px bg-rust" />
            Sistemas de captación · Despachos de migración
          </div>
          <h1 className="font-serif font-medium text-[clamp(38px,5.4vw,66px)] leading-[1.04] tracking-[-.5px] text-cream mb-[26px]" style={{ textWrap: 'balance' }}>
            Cada hora sin responder, un caso{' '}
            <span className="italic font-medium text-rustLight">cruza a la competencia.</span>
          </h1>
          <p className="max-w-[520px] text-[clamp(16px,1.5vw,19px)] leading-[1.65] text-slate mb-9 font-light">
            Studio Seikan construye la infraestructura de captación que responde, califica y agenda por ti — para que tu despacho de migración deje de perder clientes por tiempo de respuesta, no por falta de talento.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <a href="#auditoria" className="inline-flex items-center px-[26px] py-[15px] bg-rust text-cream rounded-sm font-mono text-[13px] tracking-[1.4px] uppercase hover:bg-rustLight transition-colors">
              Solicitar auditoría gratuita
            </a>
            <a href="#servicios" className="inline-flex items-center px-[26px] py-[15px] bg-transparent text-cream border border-slate/40 rounded-sm font-mono text-[13px] tracking-[1.4px] uppercase hover:border-cream transition-colors">
              Ver el proceso
            </a>
          </div>
        </div>

        <div className="flex-[0_1_400px] min-w-[280px] flex justify-center">
          <div className="relative w-[min(380px,80vw)] aspect-square rotate-[-8deg] animate-[stampImpact_0.95s_cubic-bezier(0.2,1.35,0.3,1)_both]">
            <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
              <defs>
                <path id="seikanArc" d="M 34,150 a 116,116 0 1,1 232,0 a 116,116 0 1,1 -232,0" />
              </defs>
              <circle cx="150" cy="150" r="140" fill="none" stroke="#A6362A" strokeWidth="2.5" strokeOpacity=".9" />
              <circle cx="150" cy="150" r="131" fill="none" stroke="#A6362A" strokeWidth="1" strokeOpacity=".55" />
              <circle cx="150" cy="150" r="96" fill="none" stroke="#A6362A" strokeWidth="1" strokeOpacity=".55" />
              <text fontFamily="'IBM Plex Mono',monospace" fontSize="12.5" fontWeight="500" letterSpacing="3.2" fill="#A6362A">
                <textPath href="#seikanArc" startOffset="0">ESTUDIO SEIKAN · TIEMPO DE RESPUESTA · CAPTACIÓN CON IA · </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-rust">
              <div className="font-mono text-[10px] tracking-[3px] opacity-80">RESPUESTA EN</div>
              <div className="font-serif font-semibold text-[clamp(34px,9vw,50px)] leading-none tracking-[-1px] my-1">&lt; 5 MIN</div>
              <div className="flex items-center gap-2 font-mono text-[9px] tracking-[2px] opacity-80">
                <span>★</span>24 / 7<span>★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
