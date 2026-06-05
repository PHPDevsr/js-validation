import { VanillaValidator } from '../core.js';

function parseSize(param) {
  if (typeof param === 'number') return param;

  const value = String(param || '').trim();
  if (/^\d+(?:\.\d+)?$/.test(value)) return Number(value);

  const match = value.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);
  if (!match) return NaN;

  const amount = Number(match[1]);
  const unit = match[2].toUpperCase();
  const multipliers = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024
  };

  return amount * multipliers[unit];
}

VanillaValidator.addMethod(
  'maxsize',
  (_value, param, field) => {
    const limit = parseSize(param);
    if (!Number.isFinite(limit) || limit < 0) return false;
    const files = Array.from((field && field.files) || []);
    return files.every((file) => Number(file && file.size) <= limit);
  },
  (param) => `Please select files no larger than ${param}.`
);
