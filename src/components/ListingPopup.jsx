import React from 'react';
import { fmtRent, fmtRentFull, FURNISHING_LABEL, TENANT_LABEL } from '../utils/format';

export default function ListingPopup({ listing }) {
  const p = listing;
  const sizeStr = p.size ? `${p.size} sqft` : '';
  const bhkStr = [p.bhk, sizeStr].filter(Boolean).join(' · ');

  return (
    <div className="listing-card">
      <div className="price">
        {fmtRentFull(p.rent)}
        <small>/mo</small>
      </div>
      <div className="bhk-row">{bhkStr}</div>
      {p.locality && <div className="loc">📍 {p.locality}</div>}
      {p.society && <div className="soc">{p.society}</div>}

      <div className="tags">
        {p.furnishing && (
          <span className={`tag ${p.furnishing.toLowerCase()}`}>
            {FURNISHING_LABEL[p.furnishing] || p.furnishing}
          </span>
        )}
        {p.tenant && <span className="tag">{TENANT_LABEL[p.tenant] || p.tenant}</span>}
        {p.deposit && <span className="tag">Dep: {fmtRent(p.deposit)}</span>}
        {p.bathroom > 0 && <span className="tag">{p.bathroom} Bath</span>}
      </div>

      {p.url && (
        <a className="view-btn" href={p.url} target="_blank" rel="noopener noreferrer">
          View Listing →
        </a>
      )}
    </div>
  );
}
