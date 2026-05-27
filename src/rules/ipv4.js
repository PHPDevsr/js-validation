import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'ipv4',
  (value) => {
    if (String(value || '').trim() === '') return false;
    return /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(String(value));
  },
  'Please enter a valid IPv4 address.'
);
