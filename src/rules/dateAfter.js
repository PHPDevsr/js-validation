import { VanillaValidator } from '../core.js';
import { parseDate, resolveDate } from './dateBefore.js';

VanillaValidator.addMethod(
  'dateAfter',
  (value, param, _field, validator) => {
    const date = parseDate(value);
    const limit = resolveDate(param, validator);
    return date !== null && limit !== null && date > limit;
  },
  (param) => `Please enter a date after ${param}.`
);
