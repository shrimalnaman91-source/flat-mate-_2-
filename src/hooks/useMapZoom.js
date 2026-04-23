import { useEffect, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

/**
 * Track the current zoom level of the Google Map.
 * Re-renders the parent when zoom changes.
 */
export function useMapZoom(defaultZoom = 11) {
  const map = useMap();
  const [zoom, setZoom] = useState(defaultZoom);

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('zoom_changed', () => {
      const z = map.getZoom();
      if (typeof z === 'number') setZoom(z);
    });
    // Seed initial zoom
    const z = map.getZoom();
    if (typeof z === 'number') setZoom(z);
    return () => listener.remove();
  }, [map]);

  return zoom;
}
