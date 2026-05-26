import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'email',
  (value) => {
    if (String(value || '').trim() === '') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
  },
  'Please enter a valid email address.'
);
