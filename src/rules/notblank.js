import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'notblank',
  (value) => String(value == null ? '' : value).length > 0,
  'This field is required.'
);
