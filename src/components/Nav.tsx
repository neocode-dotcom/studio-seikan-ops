const Nav = () => {
  return (
    <nav className="sticky top-0 z-[60] flex items-center justify-between gap-5 flex-wrap px-[clamp(20px,5vw,64px)] py-4 bg-ink/[.88] backdrop-blur-md border-b border-slate/[.16]">
      <a href="#top" className="flex items-center gap-3.5">
        <span className="flex items-center justify-center w-[42px] h-[42px] rounded-full border-2 border-rust shadow-[inset_0_0_0_2px_rgba(166,54,42,0.28)] font-serif font-semibold text-xl text-rustLight -rotate-6">
          S
        </span>
        <span className="flex flex-col leading-[1.05]">
          <span className="font-serif font-medium text-[19px] text-cream tracking-[.2px]">Studio Seikan</span>
          <span className="font-mono text-[9.5px] tracking-[2.5px] text-slate uppercase">Captación con IA</span>
        </span>
      </a>
      <div className="flex items-center gap-[clamp(16px,2.6vw,34px)] flex-wrap">
        <a href="#servicios" className="font-mono text-xs tracking-[1.5px] uppercase text-slate hover:text-cream transition-colors">Servicios</a>
        <a href="#proceso" className="font-mono text-xs tracking-[1.5px] uppercase text-slate hover:text-cream transition-colors">Proceso</a>
        <a href="#cumplimiento" className="font-mono text-xs tracking-[1.5px] uppercase text-slate hover:text-cream transition-colors">Cumplimiento</a>
        <a href="#auditoria" className="inline-flex items-center px-5 py-2.5 bg-rust text-cream rounded-sm font-mono text-xs tracking-[1.5px] uppercase hover:bg-rustLight transition-colors">
          Auditoría gratuita
        </a>
      </div>
    </nav>
  );
};

export default Nav;
