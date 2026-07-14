import { useEffect } from 'react';

const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';
export const CALENDLY_URL = 'https://calendly.com/jwebdesign379/auditoria-studio-seikan';
const CALENDLY_EMBED_URL = `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1`;

interface CalendlyEmbedProps {
  onScheduled?: () => void;
}

const CalendlyEmbed = ({ onScheduled }: CalendlyEmbedProps) => {
  useEffect(() => {
    if (document.querySelector(`script[src="${CALENDLY_SCRIPT_SRC}"]`)) return;
    const script = document.createElement('script');
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
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

  return (
    <div
      className="calendly-inline-widget"
      data-url={CALENDLY_EMBED_URL}
      style={{ minWidth: '320px', height: '700px' }}
    />
  );
};

export default CalendlyEmbed;
