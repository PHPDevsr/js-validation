import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'ishexcolor',
  (value) => {
    if (String(value || '').trim() === '') return false;
    return /^#(?:[0-9a-f]{6}|[0-9a-f]{3})$/i.test(String(value));
  },
  'Please enter a valid hex color (e.g. #fff or #ffffff).'
);
