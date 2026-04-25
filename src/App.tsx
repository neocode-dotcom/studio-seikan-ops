import Header from './components/UI/Header';
import HeroScene from './components/3d/HeroScene';

function App() {
  return (
    <div className="relative w-full min-h-screen text-white overflow-x-hidden selection:bg-brand-neon selection:text-brand-dark font-sans">
      <Header />

      {/* 3D Background Layer */}
      <HeroScene />

      {/* Content Layer (Se asegura renderizado HTML para SEO y LLM ingestion) */}
      <main className="relative z-10 px-6 max-w-7xl mx-auto pointer-events-none">
        {/* Pointer events none on container to let clicks pass to 3D if needed, but we need pointer-events-auto on interactive children */}

        <section id="hero" className="h-screen max-h-[1080px] flex flex-col justify-center pt-16 md:pt-20 pointer-events-auto">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 lg:mb-6 leading-[0.9]">
              TU E-COMMERCE EN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-white drop-shadow-[0_0_15px_rgba(196,255,35,0.5)]">
                PILOTO AUTOMÁTICO
              </span><br />
              DEJA DE PERDER VENTAS POR SOPORTE LENTO.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-6 lg:mb-8 border-l-2 border-brand-neon pl-4 lg:pl-6 leading-relaxed">
              Construimos agentes de IA que responden tickets en segundos, recuperan carritos abandonados y reducen tus costos operativos hasta un 60%. Todo mientras tú duermes.
            </p>
            <div className="flex flex-col gap-3">
              <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" className="w-fit bg-brand-neon text-brand-dark px-6 py-3 font-bold text-base hover:bg-white transition-all duration-300 transform skew-x-[-10deg] inline-block text-center shadow-[0_0_20px_rgba(196,255,35,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                <span className="block skew-x-[10deg]">DESCUBRE CUÁNTO ESTÁS PERDIENDO (AUDITORÍA GRATIS)</span>
              </a>
              <p className="text-sm md:text-base text-gray-400 italic max-w-lg mt-2">
                "En 2026 La diferencia entre un negocio que escala y uno que se estanca es su infraestructura de IA."
              </p>
            </div>
          </div>
        </section>

        {/* EL PROBLEMA */}
        <section id="problem" className="min-h-screen flex items-center justify-center pointer-events-auto mt-20 md:mt-0">
          <div className="max-w-5xl text-center bg-brand-dark/40 backdrop-blur-md p-8 md:p-14 border border-white/10 rounded-3xl shadow-2xl shadow-black/50">
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight uppercase tracking-tight">
              ¿CUÁNTO DINERO PIERDES <br />
              <span className="text-red-500">CADA MES?</span>
            </h2>
            <p className="text-xl md:text-2xl text-white font-medium mb-12 max-w-3xl mx-auto">
              Tus clientes exigen respuestas instantáneas. Si tardas más de 5 minutos en responder, simplemente compran en la competencia. El e-commerce moderno no espera por humanos.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-black/50 p-6 border-t-2 border-red-500 rounded-b-xl hover:-translate-y-1 transition-transform">
                <h3 className="text-red-400 font-bold text-lg mb-3">Soporte Lento = Ventas Perdidas</h3>
                <p className="text-gray-400 text-sm leading-relaxed">El 80% de los clientes abandonan una compra si no reciben respuesta rápida a sus dudas sobre envíos o tallas.</p>
              </div>
              <div className="bg-black/50 p-6 border-t-2 border-orange-500 rounded-b-xl hover:-translate-y-1 transition-transform">
                <h3 className="text-orange-400 font-bold text-lg mb-3">Carritos Abandonados</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Emails estáticos ya no funcionan. Necesitas un agente proactivo que recupere esas ventas hablando con el cliente en tiempo real.</p>
              </div>
              <div className="bg-black/50 p-6 border-t-2 border-yellow-500 rounded-b-xl hover:-translate-y-1 transition-transform">
                <h3 className="text-yellow-400 font-bold text-lg mb-3">Costos Operativos Inflados</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Pagar a humanos para responder "¿dónde está mi pedido?" no es escalable y erosiona tus márgenes de beneficio.</p>
              </div>
            </div>
          </div>
        </section>


        {/* LA SOLUCIÓN */}
        <section id="solution" className="min-h-screen flex flex-col justify-center py-20 pointer-events-auto relative">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">
              UN ECOSISTEMA DE <span className="text-brand-neon">IA INTEGRAL</span>
            </h2>
            <p className="text-xl text-gray-300">
              No es una suite de herramientas. Es el nuevo sistema nervioso de tu empresa. Nuestras soluciones son modulares y se adaptan a la fricción específica de tu negocio:
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-stretch">
            {/* Pilar 1 */}
            <div className="bg-brand-dark/60 backdrop-blur-md p-8 border-t-4 border-brand-neon hover:bg-white/5 transition-all duration-300 group hover:-translate-y-2">
              <div className="text-4xl mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">🧠</div>
              <h3 className="text-xl md:text-2xl font-black mb-4 uppercase">1. Agentes de Soporte 24/7</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automatizamos el 70% de tus FAQs (envíos, devoluciones, tallas) instantáneamente en WhatsApp, Instagram y Web. Tus clientes reciben respuestas perfectas a las 3 AM.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="bg-brand-dark/60 backdrop-blur-md p-8 border-t-4 border-white hover:border-brand-neon hover:bg-white/5 transition-all duration-300 group hover:-translate-y-2">
              <div className="text-4xl mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">🛒</div>
              <h3 className="text-xl md:text-2xl font-black mb-4 uppercase">2. Recuperación y Upsell Activo</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Un agente de ventas que detecta carritos abandonados, contacta al cliente, resuelve sus dudas y recomienda productos complementarios. Aumenta tu Ticket Promedio (AOV) sin esfuerzo humano.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="bg-brand-dark/60 backdrop-blur-md p-8 border-t-4 border-brand-neon hover:bg-white/5 transition-all duration-300 group hover:-translate-y-2">
              <div className="text-4xl mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">⚙️</div>
              <h3 className="text-xl md:text-2xl font-black mb-4 uppercase">3. Operaciones Optimizadas</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Integración total con Shopify, Klaviyo y tu logística. Dashboards predictivos que gestionan tu inventario y automatizan tareas repetitivas para que te enfoques en escalar tu marca.
              </p>
            </div>
          </div>
        </section>

        {/* EL METODO SEIKAN */}
        <section id="method" className="py-24 pointer-events-auto">
          <div className="bg-gradient-to-br from-brand-dark/90 to-black p-10 md:p-16 border border-white/10 rounded-3xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">
              EL MÉTODO SEIKAN: DE LA AUDITORÍA A LA MÉTRICA
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
              No creemos en soluciones "copy-paste". Cada E-commerce es un organismo distinto. Por eso, nuestro punto de partida nunca es una venta, sino un diagnóstico profundo.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-brand-neon/20 flex items-center justify-center mx-auto mb-6 text-brand-neon font-black text-2xl border border-brand-neon/50">1</div>
                <h3 className="text-xl font-bold mb-3 text-white">Identificación de Fricciones</h3>
                <p className="text-sm text-gray-500">Localizamos dónde estás perdiendo dinero hoy (chat, operativa o creativos).</p>
              </div>
              <div className="text-center p-6 relative">
                 <div className="hidden md:block absolute top-14 -left-12 w-24 h-px bg-gradient-to-r from-brand-neon/0 via-brand-neon/50 to-brand-neon/0"></div>
                <div className="w-16 h-16 rounded-full bg-brand-neon/20 flex items-center justify-center mx-auto mb-6 text-brand-neon font-black text-2xl border border-brand-neon/50">2</div>
                <h3 className="text-xl font-bold mb-3 text-white">Plan de Acción Personalizado</h3>
                <p className="text-sm text-gray-500">Diseñamos la hoja de ruta técnica específica para tu caso.</p>
              </div>
              <div className="text-center p-6 relative">
                 <div className="hidden md:block absolute top-14 -left-12 w-24 h-px bg-gradient-to-r from-brand-neon/0 via-brand-neon/50 to-brand-neon/0"></div>
                <div className="w-16 h-16 rounded-full bg-brand-neon/20 flex items-center justify-center mx-auto mb-6 text-brand-neon font-black text-2xl border border-brand-neon/50">3</div>
                <h3 className="text-xl font-bold mb-3 text-white">Escalabilidad Medible</h3>
                <p className="text-sm text-gray-500">Implementamos con métricas claras (ROAS, tiempo de respuesta, tasa de conversión).</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* SECCION ANHELO */}
        <section className="py-20 pointer-events-auto text-center">
             <h2 className="text-4xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">EL FUTURO DE TU MARCA</h2>
             <div className="max-w-3xl mx-auto space-y-6 text-xl md:text-3xl font-medium text-gray-300">
                <p className="hover:text-white transition-colors">¿Si pudieras recuperar el 30% de tus carritos abandonados en automático?</p>
                <p className="hover:text-white transition-colors">¿Si tuvieras un equipo de soporte que responde en 3 segundos, domingos a las 2 AM?</p>
                <p className="hover:text-brand-neon transition-colors">¿Si pudieras escalar tus ventas sin contratar a una sola persona más de atención al cliente?</p>
             </div>
        </section>

        {/* CTA FINAL */}
        <section id="cta" className="min-h-screen py-20 flex items-center justify-center pointer-events-auto">
          <div className="bg-brand-dark/90 backdrop-blur-xl border-y-4 border-brand-neon py-16 px-10 max-w-4xl w-full relative overflow-hidden text-center shadow-[0_0_50px_rgba(196,255,35,0.1)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-neon/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white uppercase tracking-tight relative z-10">
              EL PASO CRÍTICO
            </h2>

            <div className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto relative z-10">
              <p className="mb-4 font-bold text-white">Antes de implementar, necesitamos auditar.</p>
              <p className="mb-4">Buscamos dueños de e-commerce decididos a liderar su categoría. En esta sesión de 30 minutos, desglosaremos tu operativa y detectaremos los puntos de mejora inmediata.</p>
              <p className="text-brand-neon font-medium">Al finalizar, recibirás un plan de acción basado en IA diseñado exclusivamente para tu infraestructura.</p>
            </div>

             <div className="relative z-10 flex flex-col items-center justify-center gap-4">
              <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto bg-brand-neon text-brand-dark font-black py-5 px-10 text-xl hover:bg-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(196,255,35,0.4)]">
                QUIERO MI AUDITORÍA GRATUITA
              </a>
              <p className="text-xs text-brand-neon/80 uppercase tracking-widest font-bold mt-2">
                Solo aceptamos 4 nuevas auditorías por semana para mantener la calidad de entrega.
              </p>
            </div>
          </div>
        </section>

        <footer className="py-10 text-center text-gray-500 text-sm pointer-events-auto border-t border-white/5 mt-10">
          <p>© 2026 Kymatica AI | Arquitecturas de Persuasión y Eficiencia Operativa para E-commerce.</p>
          <p className="mt-2 text-xs opacity-50">A responsive & semantic Web3D Experience.</p>
        </footer>
      </main>
    </div>
  )
}

export default App
