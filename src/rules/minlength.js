import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'minlength',
  (value, expected) => String(value || '').length >= Number(expected),
  (param) => `Please enter at least ${param} characters.`
);
