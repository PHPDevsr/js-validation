import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'required',
  (value) => String(value || '').trim().length > 0,
  'This field is required.'
);
