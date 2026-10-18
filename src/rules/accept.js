import { VanillaValidator } from '../core.js';

function matches(type, allowed) {
  return allowed.some((pattern) => (
    pattern.endsWith('/*') ? type.startsWith(pattern.slice(0, -1)) : type === pattern
  ));
}

VanillaValidator.addMethod(
  'accept',
  (value, param, field) => {
    const allowed = String(param || '').toLowerCase().split(',').map((type) => type.trim()).filter(Boolean);
    if (!allowed.length) return false;

    const files = Array.from((field && field.files) || []);
    if (files.length) return files.every((file) => matches(String((file && file.type) || '').toLowerCase(), allowed));

    return String(value || '').trim() !== '';
  },
  (param) => `Please select a file with an accepted type: ${param}.`
);
