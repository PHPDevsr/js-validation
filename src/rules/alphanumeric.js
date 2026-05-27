import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'alphanumeric',
  (value) => {
    if (String(value || '').trim() === '') return false;
    return /^\w+$/i.test(String(value));
  },
  'Please enter only letters, numbers, and underscores.'
);
