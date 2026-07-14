import { useEffect } from 'react';

const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';
const CALENDLY_CSS_HREF = 'https://assets.calendly.com/assets/external/widget.css';
export const CALENDLY_URL = 'https://calendly.com/jwebdesign379/auditoria-studio-seikan';

declare global {
  interface Window {
    Calendly?: {
      initBadgeWidget: (options: {
        url: string;
        text: string;
        color: string;
        textColor: string;
        branding?: boolean;
      }) => void;
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

let assetsPromise: Promise<void> | null = null;

// El popup (a diferencia del embed inline) siempre se abre como overlay a
// pantalla completa controlado por Calendly — evita por diseño el problema
// de altura fija/espacio en blanco que tiene el widget embebido en un
// contenedor propio.
export function loadCalendlyAssets(): Promise<void> {
  if (!assetsPromise) {
    assetsPromise = new Promise((resolve) => {
      if (!document.querySelector(`link[href="${CALENDLY_CSS_HREF}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = CALENDLY_CSS_HREF;
        document.head.appendChild(link);
      }
      if (window.Calendly) {
        resolve();
        return;
      }
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = CALENDLY_SCRIPT_SRC;
      script.async = true;
      script.addEventListener('load', () => resolve(), { once: true });
      document.body.appendChild(script);
    });
  }
  return assetsPromise;
}

export function openCalendlyPopup() {
  loadCalendlyAssets().then(() => {
    window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
  });
}

export function useCalendlyScheduled(onScheduled?: () => void) {
  useEffect(() => {
    if (!onScheduled) return;
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://calendly.com') return;
      if (e.data?.event === 'calendly.event_scheduled') onScheduled();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onScheduled]);
}
