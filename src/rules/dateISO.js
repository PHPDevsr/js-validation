import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'dateISO',
  (value) => /^\d{4}[\/\-]\d{2}[\/\-]\d{2}$/.test(String(value)),
  'Please enter a valid ISO date (YYYY-MM-DD).'
);
