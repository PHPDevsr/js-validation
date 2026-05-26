import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'maxlength',
  (value, expected) => String(value || '').length <= Number(expected),
  (param) => `Please enter no more than ${param} characters.`
);
