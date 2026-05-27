import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'range',
  (value, param) => {
    try {
      const bounds = Array.isArray(param) ? param : JSON.parse(param);
      if (!Array.isArray(bounds) || bounds.length < 2) return false;
      const num = Number(value);
      if (String(value || '').trim() === '' || isNaN(num)) return false;
      return num >= Number(bounds[0]) && num <= Number(bounds[1]);
    } catch {
      return false;
    }
  },
  (param) => {
    try {
      const bounds = Array.isArray(param) ? param : JSON.parse(param);
      return `Please enter a value between ${bounds[0]} and ${bounds[1]}.`;
    } catch {
      return 'Please enter a valid range.';
    }
  }
);
