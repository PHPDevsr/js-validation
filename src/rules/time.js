import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'time',
  (value) => {
    if (String(value || '').trim() === '') return false;
    return /^([01]\d|2[0-3]|[0-9])(:[0-5]\d){1,2}$/.test(String(value).trim());
  },
  'Please enter a valid time (HH:MM or HH:MM:SS).'
);
