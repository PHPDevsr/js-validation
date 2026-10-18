import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'integer',
  (value) => {
    if (String(value || '').trim() === '') return false;
    return /^[+-]?\d+$/.test(String(value).trim());
  },
  'Please enter an integer.'
);
