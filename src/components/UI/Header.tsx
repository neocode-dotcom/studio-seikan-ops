const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-brand-dark/50 border-b border-white/10">
            <div className="text-brand-neon font-bold text-2xl tracking-tighter uppercase">
                NEURALIS AI
            </div>
            <button className="bg-brand-neon text-brand-dark px-4 py-2 text-sm font-bold skew-x-[-10deg] hover:bg-white transition-colors">
                <span className="block skew-x-[10deg]">AGENDAR</span>
            </button>
        </header>
    );
};

export default Header;
