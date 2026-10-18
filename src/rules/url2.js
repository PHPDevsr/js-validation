import { VanillaValidator } from '../core.js';

// Stricter than `url`: requires an http(s) scheme and a host with a dotted name (no bare IPs/localhost).
VanillaValidator.addMethod(
  'url2',
  (value) => {
    const str = String(value || '').trim();
    if (str === '') return false;
    let parsed;
    try {
      parsed = new URL(str);
    } catch {
      return false;
    }
    return /^https?:$/.test(parsed.protocol) && parsed.hostname.includes('.');
  },
  'Please enter a valid URL including http:// or https://.'
);
