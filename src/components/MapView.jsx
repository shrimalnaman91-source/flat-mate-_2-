import React, { useMemo, useState, useCallback } from 'react';
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { clusterListings, CLUSTER_MAX_ZOOM } from '../utils/cluster';
import { fmtRent, bhkBand } from '../utils/format';
import { useMapZoom } from '../hooks/useMapZoom';
import ListingPopup from './ListingPopup';

const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || undefined;

const BANGALORE_CENTER = { lat: 12.9716, lng: 77.5946 };

/**
 * Inner map content that needs access to the map instance.
 * Must be rendered as a child of <Map>.
 */
function MapContent({ listings }) {
  const map = useMap();
  const zoom = useMapZoom(11);
  const [selected, setSelected] = useState(null);

  const { clusters, singles } = useMemo(
    () => clusterListings(listings, zoom),
    [listings, zoom]
  );

  const handleClusterClick = useCallback(
    (cluster) => {
      if (!map) return;
      // Zoom in one step and recenter
      const targetZoom = Math.min((map.getZoom() || 11) + 2, CLUSTER_MAX_ZOOM + 1);
      map.panTo({ lat: cluster.lat, lng: cluster.lng });
      map.setZoom(targetZoom);
    },
    [map]
  );

  return (
    <>
      {clusters.map((c) => {
        const size = c.count < 10 ? 'small' : c.count < 50 ? 'medium' : 'large';
        return (
          <AdvancedMarker
            key={c.id}
            position={{ lat: c.lat, lng: c.lng }}
            onClick={() => handleClusterClick(c)}
          >
            <div className={`cluster-marker ${size}`}>{c.count}</div>
          </AdvancedMarker>
        );
      })}

      {singles.map((p) => (
        <AdvancedMarker
          key={p.id}
          position={{ lat: p.lat, lng: p.lng }}
          onClick={() => setSelected(p)}
        >
          <div className={`price-marker ${bhkBand(p.rent)}`}>{fmtRent(p.rent)}</div>
        </AdvancedMarker>
      ))}

      {selected && (
        <InfoWindow
          position={{ lat: selected.lat, lng: selected.lng }}
          pixelOffset={[0, -12]}
          onCloseClick={() => setSelected(null)}
        >
          <ListingPopup listing={selected} />
        </InfoWindow>
      )}
    </>
  );
}

export default function MapView({ listings }) {
  return (
    <div className="map-wrapper">
      <Map
        mapId={MAP_ID || 'DEMO_MAP_ID'}
        defaultCenter={BANGALORE_CENTER}
        defaultZoom={11}
        minZoom={9}
        maxZoom={19}
        gestureHandling="greedy"
        disableDefaultUI={false}
        clickableIcons={false}
      >
        <MapContent listings={listings} />
      </Map>
    </div>
  );
}
