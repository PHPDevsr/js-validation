import { VanillaValidator } from '../core.js';
import { numericParam } from './_helpers.js';

VanillaValidator.addMethod(
  'max',
  (value, param, field) => {
    if (String(value || '').trim() === '') return false;
    const num = Number(value);
    const limit = numericParam(param, field, 'max');
    return Number.isFinite(num) && Number.isFinite(limit) && num <= limit;
  },
  (param) => `Please enter a value less than or equal to ${param}.`
);
