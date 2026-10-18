import { VanillaValidator } from '../core.js';

const LABEL = '[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?';

VanillaValidator.addMethod(
  'domain',
  (value) => {
    const domain = String(value || '').trim();
    if (domain === '' || domain.length > 253) return false;
    const labels = domain.split('.');
    return labels.length >= 2
      && labels.every((label) => new RegExp(`^${LABEL}$`, 'i').test(label))
      && /^[a-z]{2,}$/i.test(labels[labels.length - 1]);
  },
  'Please enter a valid domain name.'
);
