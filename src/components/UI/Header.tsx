const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-brand-dark/50 border-b border-white/10">
            <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter uppercase text-brand-neon">
                <img src="/logo_seikan.png" alt="Logo Studio Seikan" className="h-20 w-auto object-contain drop-shadow-[0_0_10px_rgba(196,255,35,0.3)]" />
                <span>Studio <span className="text-white">Seikan</span></span>
            </div>
            <button className="bg-brand-neon text-brand-dark px-4 py-2 text-sm font-bold skew-x-[-10deg] hover:bg-white transition-colors shadow-[0_0_15px_rgba(196,255,35,0.3)]">
                <span className="block skew-x-[10deg]">AGENDAR</span>
            </button>
        </header>
    );
};

export default Header;
