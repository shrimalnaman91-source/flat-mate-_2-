/**
 * Rent / number formatting helpers
 */

export const fmtRent = (r) => {
  if (!r) return '—';
  if (r >= 100000) return '₹' + (r / 100000).toFixed(1) + 'L';
  if (r >= 1000) return '₹' + (r / 1000).toFixed(r % 1000 === 0 ? 0 : 1) + 'k';
  return '₹' + r;
};

export const fmtRentFull = (r) => (r ? '₹' + r.toLocaleString('en-IN') : '—');

export const bhkBand = (r) => {
  if (r < 15000) return 'b1';
  if (r < 25000) return 'b2';
  if (r < 40000) return 'b3';
  return 'b4';
};

export const FURNISHING_LABEL = {
  FF: 'Fully Furnished',
  SF: 'Semi Furnished',
  UF: 'Unfurnished',
};

export const TENANT_LABEL = {
  FAMILY: 'Family',
  BACHELOR: 'Bachelors',
  MALE: 'Male',
  FEMALE: 'Female',
  ANYONE: 'Anyone',
  COMPANY: 'Company',
};
