import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'digits',
  (value) => {
    if (String(value || '').trim() === '') return false;
    return /^\d+$/.test(String(value).trim());
  },
  'Please enter only digits.'
);
