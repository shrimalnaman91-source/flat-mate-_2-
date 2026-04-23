import React from 'react';

const BHK_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: '1RK', label: '1RK' },
  { key: '1BHK', label: '1BHK' },
  { key: '2BHK', label: '2BHK' },
  { key: '3BHK', label: '3BHK' },
  { key: '4BHK', label: '4+BHK' },
];

export default function FilterBar({ value, onChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        {BHK_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            className={value === opt.key ? 'active' : ''}
            onClick={() => onChange(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
