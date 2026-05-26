/**
 * js-validation – full bundle (core + all built-in rules).
 */
import { VanillaValidator } from './core.js';
import './rules/required.js';
import './rules/email.js';
import './rules/minlength.js';
import './rules/maxlength.js';
import './rules/pattern.js';
import './rules/equalTo.js';

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
