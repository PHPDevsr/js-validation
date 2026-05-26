import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'equalTo',
  (value, selector, _field, validator) => {
    if (!validator.form || typeof validator.form.querySelector !== 'function') return true;
    const target = validator.form.querySelector(selector);
    return !!target && String(value || '') === String(target.value || '');
  },
  'Please enter the same value again.'
);
