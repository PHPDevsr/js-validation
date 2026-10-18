import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'number',
  (value) => {
    if (String(value || '').trim() === '') return false;
    return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(String(value).trim());
  },
  'Please enter a valid number.'
);
