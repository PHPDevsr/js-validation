import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'notEqualTo',
  (value, selector, _field, validator) => {
    if (!validator.form || typeof validator.form.querySelector !== 'function') return true;
    const target = validator.form.querySelector(selector);
    return !!target && String(value || '') !== String(target.value || '');
  },
  'Please enter a different value.'
);
