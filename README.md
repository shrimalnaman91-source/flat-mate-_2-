# Flatmate Finder · Bangalore

A React + Vite app that visualises flatmate listings across Bangalore on Google Maps.

## Features

- **~1,780 listings** pre-processed from the source CSV into `src/data/listings.json`
- **Zoom-aware clustering** — lightweight grid clustering at low zoom, individual price markers at high zoom (no external plugin)
- **Price markers** colour-coded by rent band (green `<15k` · blue `<25k` · amber `<40k` · red `≥40k`)
- **BHK filter** with live count + median rent
- **Info window** with BHK, size, locality, society, furnishing, tenant type, deposit, and a link to the original listing

## Tech stack

- **React 18** + **Vite 6** (fast dev server, ES modules)
- **`@vis.gl/react-google-maps`** (the official Google-maintained React bindings)
- No CSS framework — hand-written in `src/styles.css`
- Static JSON data (no backend)

## Setup

```bash
npm install
cp .env.example .env.local
# edit .env.local and paste your Google Maps API key
npm run dev
```

Open http://localhost:5173.

### Getting a Google Maps API key

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/google/maps-apis/credentials)
2. Create an API key
3. Enable the **Maps JavaScript API** for the key
4. (Recommended) Restrict the key by HTTP referrer — e.g. `http://localhost:5173/*`
5. (Optional) Create a **Map ID** in [Maps Studio](https://console.cloud.google.com/google/maps-apis/studio/maps) and add it as `VITE_GOOGLE_MAPS_MAP_ID` in `.env.local` for custom styling and proper Advanced Marker support.

> The app uses `AdvancedMarker`, which technically requires a Map ID. A placeholder `DEMO_MAP_ID` is used as a fallback so it'll still render — but add a real Map ID before deploying.

## Project structure

```
src/
├── App.jsx                  # Root component, state, APIProvider
├── main.jsx                 # React entry
├── styles.css               # All styles
├── data/
│   └── listings.json        # Cleaned listings (lat, lng, rent, bhk, …)
├── components/
│   ├── MapView.jsx          # Google Map + markers
│   ├── FilterBar.jsx        # BHK filter pills
│   └── ListingPopup.jsx     # Info window contents
├── hooks/
│   └── useMapZoom.js        # Observes map zoom for re-clustering
└── utils/
    ├── cluster.js           # Grid-based clustering
    └── format.js            # ₹ / BHK band formatters
```

## Extending

- **Rent range slider** → add another filter in `App.jsx`, pass to `MapView`
- **Locality search** → index `listings.json` by locality, pan map to matched centroid
- **Sidebar list view synced with viewport** → use `map.getBounds()` on `idle` event
- **Heatmap** → replace clustering with `google.maps.visualization.HeatmapLayer`
- **Flatmate-specific fields** (roommate gender pref, existing occupants, move-in date, shared vs private room) → extend the preprocessing script and `ListingPopup`

## Data preprocessing

The cleaned `listings.json` was generated from the source CSV by parsing
coordinates (`"13.055° N"` → `13.055`), filtering to Bangalore's bounding
box, dropping rows with missing or clearly invalid rent, and keeping only
the fields needed by the UI.
# flat-mate-_2-
