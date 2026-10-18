import { VanillaValidator } from '../core.js';

// `letters` > default: letters only
// `letters` > birthdate: letters, spaces, dots and dashes
// `letters` > id: letters, spaces, dots, commas, dashes and apostrophes
const LETTERS_PATTERNS = {
  birthdate: /^[a-zA-Z\s.\-]+$/,
  id: /^[a-zA-Z\s.,'\-]+$/
};

VanillaValidator.addMethod(
  'letters',
  (value, param) => {
    const str = String(value || '');
    if (str === '') return false;
    return (LETTERS_PATTERNS[param] || /^[a-zA-Z]+$/).test(str);
  },
  'Please enter only letters.'
);
