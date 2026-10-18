/**
 * Shared helpers for built-in rules. Not a rule file — do not import from index.js.
 */

// Parse a numeric param, or read it from a data-rule-* attribute when param is `true`.
export function numericParam(param, field, ruleName) {
  if (param === true) {
    const raw = field && field.dataset && field.dataset[`rule${ruleName.charAt(0).toUpperCase()}${ruleName.slice(1)}`];
    return Number(raw);
  }
  return Number(param);
}

// Decimal places, used to compare floats without 0.1 + 0.2 drift.
export function decimalPlaces(num) {
  const str = String(num);
  const dot = str.indexOf('.');
  return dot === -1 ? 0 : str.length - dot - 1;
}

// Parse a [min, max] param (array, JSON string, or "min,max") — same shape as `range`.
export function parseBounds(param) {
  if (Array.isArray(param)) return param;
  const str = String(param || '').trim();
  if (str.startsWith('[')) {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  const parts = str.split(',').map((part) => Number(part.trim()));
  return parts.length === 2 && parts.every(Number.isFinite) ? parts : null;
}

// Plain-text value of a field: strings, checkbox groups, file count, etc.
export function textValue(value) {
  if (Array.isArray(value)) return value.join(',');
  return String(value == null ? '' : value);
}
