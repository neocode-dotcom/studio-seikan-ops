import { useEffect, useRef } from 'react';
import { CALENDLY_URL, loadCalendlyAssets } from '../hooks/useCalendly';

// Globo flotante de Calendly, montado una sola vez a nivel de página.
// Colores adaptados a la marca (tinta/rojo-sello) — el default de Calendly
// es azul (#0069ff) y no encaja con el sistema visual de docs/01.
const CalendlyBadge = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadCalendlyAssets().then(() => {
      window.Calendly?.initBadgeWidget({
        url: CALENDLY_URL,
        text: 'Auditoría gratuita',
        color: '#A6362A',
        textColor: '#ECE7DC',
        branding: true,
      });
    });
  }, []);

  return null;
};

export default CalendlyBadge;
