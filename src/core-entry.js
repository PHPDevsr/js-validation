/**
 * js-validation – core only (no built-in rules).
 *
 * Use this entry point when you want to selectively import rules:
 *
 *   import jsValidation from 'js-validation/core';
 *   import 'js-validation/rules/required';
 *   import 'js-validation/rules/email';
 */
import { VanillaValidator } from './core.js';

function jsValidation(formOrSelector, options = {}) {
  let form = formOrSelector;
  if (typeof formOrSelector === 'string' && typeof document !== 'undefined') {
    form = document.querySelector(formOrSelector);
  }
  return new VanillaValidator(form, options);
}

jsValidation.Validator = VanillaValidator;
jsValidation.addMethod = VanillaValidator.addMethod.bind(VanillaValidator);
jsValidation.addLocaleMessages = VanillaValidator.addLocaleMessages.bind(VanillaValidator);


export default jsValidation;
export { VanillaValidator };
