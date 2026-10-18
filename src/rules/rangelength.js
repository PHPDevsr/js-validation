import { VanillaValidator } from '../core.js';
import { parseBounds } from './_helpers.js';

VanillaValidator.addMethod(
  'rangelength',
  (value, param) => {
    const bounds = parseBounds(param);
    if (!bounds || bounds.length < 2) return false;
    const length = String(value || '').length;
    return length >= Number(bounds[0]) && length <= Number(bounds[1]);
  },
  (param) => {
    const bounds = parseBounds(param);
    return bounds
      ? `Please enter a value between ${bounds[0]} and ${bounds[1]} characters long.`
      : 'Please enter a valid length range.';
  }
);
