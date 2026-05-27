import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'date',
  (value) => !/Invalid|NaN/.test(new Date(value)),
  'Please enter a valid date.'
);
