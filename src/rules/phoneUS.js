import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'phoneUS',
  (value) => {
    if (String(value || '').trim() === '') return false;
    return /^\+?1?[\s.-]?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/.test(String(value).trim());
  },
  'Please enter a valid US phone number.'
);
