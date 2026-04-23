import React, { useMemo, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import listingsData from './data/listings.json';
import MapView from './components/MapView';
import FilterBar from './components/FilterBar';
import { fmtRent } from './utils/format';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function MissingKeyScreen() {
  return (
    <div className="app">
      <div className="fullscreen-msg">
        <h2>Google Maps API key required</h2>
        <p>
          Create a file named <code>.env.local</code> in the project root and
          add your key:
        </p>
        <p>
          <code>VITE_GOOGLE_MAPS_API_KEY=your_key_here</code>
        </p>
        <p>
          Get a key from the{' '}
          <a
            href="https://console.cloud.google.com/google/maps-apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#60a5fa', textDecoration: 'underline' }}
          >
            Google Cloud Console
          </a>
          , enable the <b>Maps JavaScript API</b>, then restart the dev server.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [bhkFilter, setBhkFilter] = useState('all');

  const filtered = useMemo(() => {
    if (bhkFilter === 'all') return listingsData;
    if (bhkFilter === '4BHK') {
      return listingsData.filter(
        (l) => l.bhk === '4BHK' || l.bhk === '4+BHK'
      );
    }
    return listingsData.filter((l) => l.bhk === bhkFilter);
  }, [bhkFilter]);

  const medianRent = useMemo(() => {
    const rents = filtered.map((l) => l.rent).filter(Boolean).sort((a, b) => a - b);
    if (!rents.length) return 0;
    return rents[Math.floor(rents.length / 2)];
  }, [filtered]);

  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    return <MissingKeyScreen />;
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="app">
        <header className="app-header">
          <div>
            <h1>Bangalore Flatmate Map</h1>
            <div className="sub">
              Click clusters to zoom · Click markers for details
            </div>
          </div>
          <FilterBar value={bhkFilter} onChange={setBhkFilter} />
          <div className="header-stats">
            <span>
              Showing: <b>{filtered.length.toLocaleString()}</b>
            </span>
            <span>
              Median: <b>{fmtRent(medianRent)}</b>
            </span>
          </div>
        </header>
        <MapView listings={filtered} />
      </div>
    </APIProvider>
  );
}
