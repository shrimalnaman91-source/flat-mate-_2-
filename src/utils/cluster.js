/**
 * Lightweight grid-based clustering.
 *
 * At low zoom levels we snap listings to a grid and render one cluster
 * bubble per occupied cell. At high zoom levels we render individual
 * price markers. This keeps the map performant with ~2k listings and
 * scales comfortably to tens of thousands.
 */

// Rough grid size in degrees per zoom level. Lower zoom = bigger cells.
// These are tuned for Bangalore's latitude (~13° N).
const GRID_SIZE_BY_ZOOM = {
  8:  0.12,
  9:  0.06,
  10: 0.03,
  11: 0.015,
  12: 0.0075,
  13: 0.004,
  14: 0.002,
  15: 0.001,
};

// Above this zoom level we stop clustering and show every marker.
export const CLUSTER_MAX_ZOOM = 15;

export function clusterListings(listings, zoom) {
  if (zoom > CLUSTER_MAX_ZOOM) {
    return { clusters: [], singles: listings };
  }

  const gridSize = GRID_SIZE_BY_ZOOM[Math.min(Math.max(zoom, 8), 15)] || 0.01;
  const cells = new Map();

  for (const l of listings) {
    const gx = Math.floor(l.lng / gridSize);
    const gy = Math.floor(l.lat / gridSize);
    const key = gx + ':' + gy;
    let cell = cells.get(key);
    if (!cell) {
      cell = { latSum: 0, lngSum: 0, count: 0, items: [] };
      cells.set(key, cell);
    }
    cell.latSum += l.lat;
    cell.lngSum += l.lng;
    cell.count += 1;
    cell.items.push(l);
  }

  const clusters = [];
  const singles = [];
  for (const [key, cell] of cells) {
    if (cell.count === 1) {
      singles.push(cell.items[0]);
    } else {
      clusters.push({
        id: 'c:' + key,
        lat: cell.latSum / cell.count,
        lng: cell.lngSum / cell.count,
        count: cell.count,
        items: cell.items,
      });
    }
  }

  return { clusters, singles };
}
