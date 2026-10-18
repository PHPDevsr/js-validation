import { VanillaValidator } from '../core.js';

const CARDS = [
  { re: /^4/, lengths: [13, 16, 19] },
  { re: /^(5[1-5]|2(22[1-9]|2[3-9]\d|[3-6]\d\d|7[01]\d|720))/, lengths: [16] },
  { re: /^3[47]/, lengths: [15] },
  { re: /^6(011|5)/, lengths: [16, 19] },
  { re: /^35(2[89]|[3-8]\d)/, lengths: [16, 19] },
  { re: /^3(0[0-5]|[68]\d)/, lengths: [14] }
];

function luhn(digits) {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits.charAt(i));
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

VanillaValidator.addMethod(
  'creditcard',
  (value) => {
    const digits = String(value || '').replace(/[\s-]/g, '');
    if (!/^\d+$/.test(digits)) return false;
    const card = CARDS.find((c) => c.re.test(digits));
    if (!card || !card.lengths.includes(digits.length)) return false;
    return luhn(digits);
  },
  'Please enter a valid credit card number.'
);
