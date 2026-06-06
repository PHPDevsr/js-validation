import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'alpha',
  (value) => {
    if (String(value || '').trim() === '') return false;
    return /^[a-zA-Z]+$/i.test(String(value));
  },
  'Please enter only alphabetic letters.'
);
