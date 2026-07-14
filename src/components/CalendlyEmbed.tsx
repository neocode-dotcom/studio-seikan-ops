import { useEffect, useRef } from 'react';

const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';
export const CALENDLY_URL = 'https://calendly.com/jwebdesign379/auditoria-studio-seikan';
const CALENDLY_EMBED_URL = `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1`;

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement; resize?: boolean }) => void;
    };
  }
}

interface CalendlyEmbedProps {
  onScheduled?: () => void;
}

const CalendlyEmbed = ({ onScheduled }: CalendlyEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Usa la API oficial Calendly.initInlineWidget({ resize: true }) en vez del
  // escaneo automático por data-url — es la única forma documentada de que el
  // widget ajuste su propia altura al contenido real (fecha → hora → confirmación)
  // en vez de dejar espacio en blanco o cortar contenido con una altura fija.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const init = () => {
      if (!window.Calendly || !container.isConnected) return;
      // Limpia antes de inicializar: si este efecto corre más de una vez
      // (React StrictMode en desarrollo re-ejecuta efectos al montar) evita
      // que Calendly agregue un segundo widget dentro del mismo contenedor.
      container.innerHTML = '';
      window.Calendly.initInlineWidget({
        url: CALENDLY_EMBED_URL,
        parentElement: container,
        resize: true,
      });
    };

    if (window.Calendly) {
      init();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', init, { once: true });
      return () => existingScript.removeEventListener('load', init);
    }

    const script = document.createElement('script');
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', init, { once: true });
    document.body.appendChild(script);
    return () => script.removeEventListener('load', init);
  }, []);

  useEffect(() => {
    if (!onScheduled) return;
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://calendly.com') return;
      if (e.data?.event === 'calendly.event_scheduled') onScheduled();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onScheduled]);

  return <div ref={containerRef} style={{ minWidth: '320px' }} />;
};

export default CalendlyEmbed;
