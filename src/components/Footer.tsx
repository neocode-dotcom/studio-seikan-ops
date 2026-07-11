const Footer = () => {
  return (
    <footer className="px-[clamp(20px,5vw,64px)] pt-[clamp(48px,6vw,72px)] pb-10 bg-ink border-t border-slate/[.16]">
      <div className="max-w-[1240px] mx-auto flex flex-wrap gap-8 justify-between items-start">
        <div className="flex items-center gap-3.5">
          <span className="flex items-center justify-center w-[42px] h-[42px] rounded-full border-2 border-rust shadow-[inset_0_0_0_2px_rgba(166,54,42,0.28)] font-serif font-semibold text-xl text-rustLight -rotate-6">
            S
          </span>
          <div className="flex flex-col leading-[1.1]">
            <span className="font-serif font-medium text-[19px] text-cream">Studio Seikan</span>
            <span className="font-mono text-[9.5px] tracking-[2.5px] text-slate uppercase">Sistemas de captación con IA</span>
          </div>
        </div>
        <div className="flex gap-[clamp(24px,4vw,52px)] flex-wrap">
          <a href="#servicios" className="font-mono text-xs tracking-[1.4px] uppercase text-slate hover:text-cream transition-colors">Servicios</a>
          <a href="#proceso" className="font-mono text-xs tracking-[1.4px] uppercase text-slate hover:text-cream transition-colors">Proceso</a>
          <a href="#cumplimiento" className="font-mono text-xs tracking-[1.4px] uppercase text-slate hover:text-cream transition-colors">Cumplimiento</a>
          <a href="#auditoria" className="font-mono text-xs tracking-[1.4px] uppercase text-slate hover:text-cream transition-colors">Auditoría</a>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto mt-9 pt-6 border-t border-slate/[.12] flex flex-wrap gap-4 justify-between">
        <span className="font-mono text-[11px] tracking-[1px] text-[#5a6670]">© 2026 Studio Seikan. Todos los derechos reservados.</span>
        <span className="font-mono text-[11px] tracking-[1px] text-[#5a6670]">Agencia de automatización · No brindamos asesoría legal.</span>
      </div>
    </footer>
  );
};

export default Footer;
