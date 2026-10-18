import { VanillaValidator } from '../core.js';
import { decimalPlaces } from './_helpers.js';

function findStep(step, value, base) {
  const decimals = Math.max(decimalPlaces(step), base % 1 === 0 ? 0 : decimalPlaces(base), decimalPlaces(value));
  const factor = 10 ** decimals;
  const stepInt = Math.round(step * factor);
  const diff = Math.round(value * factor) - Math.round(base * factor);
  return stepInt > 0 && diff % stepInt === 0;
}

VanillaValidator.addMethod(
  'step',
  (value, param, field) => {
    if (String(value || '').trim() === '') return false;

    const num = Number(value);
    const fromField = field && field.step !== undefined && field.step !== '' && Number(field.step) > 0;
    const step = fromField ? Number(field.step) : Number(param);
    const base = field && field.min !== undefined && field.min !== '' && Number.isFinite(Number(field.min))
      ? Number(field.min)
      : 0;

    if (!Number.isFinite(num) || !Number.isFinite(step) || step <= 0) return false;
    return findStep(step, num, base);
  },
  (param) => `Please enter a multiple of ${param}.`
);
