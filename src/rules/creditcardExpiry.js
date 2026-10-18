import { VanillaValidator } from '../core.js';

// Accepts MM/YY or MM/YYYY and requires the card to still be valid in the current month.
VanillaValidator.addMethod(
  'creditcardExpiry',
  (value) => {
    const match = /^(\d{2})\/(\d{2}|\d{4})$/.exec(String(value || '').trim());
    if (!match) return false;

    const month = Number(match[1]);
    if (month < 1 || month > 12) return false;

    const year = match[2].length === 2 ? 2000 + Number(match[2]) : Number(match[2]);
    const now = new Date();
    const current = now.getFullYear() * 12 + now.getMonth();
    return year * 12 + (month - 1) >= current;
  },
  'Please enter a valid expiry date (MM/YY).'
);
