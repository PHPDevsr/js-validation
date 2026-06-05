/**
 * js-validation – full bundle (core + all built-in rules).
 *
 * Default import includes all rules. For selective imports:
 *   import jsValidation from 'js-validation/core';
 *   import 'js-validation/rules/required';
 *   import 'js-validation/rules/email';
 */
import { VanillaValidator } from './core.js';
import './rules/required.js';
import './rules/email.js';
import './rules/minlength.js';
import './rules/maxlength.js';
import './rules/range.js';
import './rules/pattern.js';
import './rules/equalTo.js';
import './rules/notEqualTo.js';
import './rules/numeric.js';
import './rules/url.js';
import './rules/date.js';
import './rules/dateISO.js';
import './rules/ipv4.js';
import './rules/ipv6.js';
import './rules/alphanumeric.js';
import './rules/maxfiles.js';
import './rules/maxsize.js';
import './rules/maxsizetotal.js';

function jsValidation(formOrSelector, options = {}) {
  let form = formOrSelector;
  if (typeof formOrSelector === 'string' && typeof document !== 'undefined') {
    form = document.querySelector(formOrSelector);
  }
  return new VanillaValidator(form, options);
}

jsValidation.Validator = VanillaValidator;
jsValidation.addMethod = VanillaValidator.addMethod.bind(VanillaValidator);

export default jsValidation;
export { VanillaValidator };
