import { VanillaValidator } from '../core.js';

export function parseDate(value) {
  const str = String(value || '').trim();
  if (str === '') return null;
  const time = new Date(str).getTime();
  return isNaN(time) ? null : time;
}

// Param: a date string, `"today"`, or a CSS selector of another field.
export function resolveDate(param, validator) {
  const raw = String(param || '').trim();
  if (!raw) return null;
  if (raw.toLowerCase() === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  }
  // Try the param as a selector first (e.g. `#endDate`); a plain date string is
  // not a valid selector, so querySelector throws and we fall back to parsing it.
  let target = null;
  if (validator && validator.form && typeof validator.form.querySelector === 'function') {
    try {
      target = validator.form.querySelector(raw);
    } catch {
      target = null;
    }
  }
  return parseDate(target ? target.value : raw);
}

VanillaValidator.addMethod(
  'dateBefore',
  (value, param, _field, validator) => {
    const date = parseDate(value);
    const limit = resolveDate(param, validator);
    return date !== null && limit !== null && date < limit;
  },
  (param) => `Please enter a date before ${param}.`
);
