import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'pattern',
  (value, expected) => {
    if (String(value || '').trim() === '') return false;
    return new RegExp(expected).test(String(value));
  },
  'Please match the requested format.'
);
