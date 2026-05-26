import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'numeric',
  (value) => {
    if (String(value || '').trim() === '') return true;
    return /^[0-9]+$/.test(String(value).trim());
  },
  'Please enter only numeric values.'
);
