import { useEffect, useState } from 'react';

const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';
export const CALENDLY_URL = 'https://calendly.com/jwebdesign379/auditoria-studio-seikan';
const CALENDLY_EMBED_URL = `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1`;

const ALTURA_MINIMA = 420;
const ALTURA_INICIAL = 700;

interface CalendlyEmbedProps {
  onScheduled?: () => void;
}

const CalendlyEmbed = ({ onScheduled }: CalendlyEmbedProps) => {
  const [altura, setAltura] = useState(ALTURA_INICIAL);

  useEffect(() => {
    if (document.querySelector(`script[src="${CALENDLY_SCRIPT_SRC}"]`)) return;
    const script = document.createElement('script');
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://calendly.com') return;
      if (e.data?.event === 'calendly.event_scheduled') onScheduled?.();
      if (e.data?.event === 'calendly.page_height') {
        const alturaReal = Number(e.data.payload?.height);
        if (Number.isFinite(alturaReal)) setAltura(Math.max(ALTURA_MINIMA, alturaReal));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onScheduled]);

  return (
    <div
      className="calendly-inline-widget"
      data-url={CALENDLY_EMBED_URL}
      style={{ minWidth: '320px', height: `${altura}px`, transition: 'height .25s ease' }}
    />
  );
};

export default CalendlyEmbed;
