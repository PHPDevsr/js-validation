/**
 * js-validation core – vanilla JS form validator (jquery-validation style).
 */

function createClassList() {
  const set = new Set();
  return {
    add(name) { set.add(name); },
    remove(name) { set.delete(name); },
    contains(name) { return set.has(name); }
  };
}

export class VanillaValidator {
  static methods = {};

  static addMethod(name, validateFn, message) {
    VanillaValidator.methods[name] = {
      validate: validateFn,
      message: message || 'Please fix this field.'
    };
  }

  constructor(form, options = {}) {
    this.form = form;
    this.options = options;
    this.errors = {};

    if (!this.form) {
      throw new Error('A form element is required for validation.');
    }

    this._bindEvents();
  }

  _bindEvents() {
    if (!this.form || typeof this.form.addEventListener !== 'function') return;

    this.form.addEventListener('submit', (event) => {
      if (!this.validate() && event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
    });

    if (this.options.onkeyup === false) return;

    this.form.addEventListener('input', (event) => {
      if (event && event.target && event.target.name) {
        this.element(event.target);
      }
    });
  }

  _elements() {
    const formElements = this.form.elements || [];
    return Array.prototype.filter.call(formElements, (field) =>
      field && field.name && !field.disabled && field.type !== 'submit'
    );
  }

  _rulesFromDataset(field) {
    const rules = {};
    const dataset = field.dataset || {};

    Object.keys(dataset).forEach((key) => {
      if (key.indexOf('rule') !== 0 || key.length <= 4) return;
      const ruleName = key.charAt(4).toLowerCase() + key.slice(5);
      const raw = dataset[key];
      rules[ruleName] = raw === '' ? true : raw;
    });

    return rules;
  }

  _rulesFor(field) {
    const optionRules = (this.options.rules && this.options.rules[field.name]) || {};
    return Object.assign({}, this._rulesFromDataset(field), optionRules);
  }

  _messageFor(field, ruleName, param, methodDef) {
    const custom = this.options.messages
      && this.options.messages[field.name]
      && this.options.messages[field.name][ruleName];
    if (custom) return custom;

    const message = methodDef.message;
    if (typeof message === 'function') return message(param, field);
    return message || 'Please fix this field.';
  }

  _getClassList(field) {
    if (!field.classList) field.classList = createClassList();
    return field.classList;
  }

  showError(field, message) {
    this.errors[field.name] = message;
    this._getClassList(field).add('jsv-invalid');
    field['aria-invalid'] = 'true';
    field.validationMessage = message;
  }

  clearError(field) {
    delete this.errors[field.name];
    this._getClassList(field).remove('jsv-invalid');
    field['aria-invalid'] = 'false';
    field.validationMessage = '';
  }

  element(field) {
    if (!field || !field.name) return true;

    const rules = this._rulesFor(field);
    const ruleNames = Object.keys(rules);

    for (let i = 0; i < ruleNames.length; i += 1) {
      const ruleName = ruleNames[i];
      const methodDef = VanillaValidator.methods[ruleName];
      if (!methodDef) continue;

      const param = rules[ruleName];
      if (param === false || param === 'false') continue;

      const valid = methodDef.validate(field.value, param, field, this);
      if (!valid) {
        this.showError(field, this._messageFor(field, ruleName, param, methodDef));
        return false;
      }
    }

    this.clearError(field);
    return true;
  }

  validate() {
    let valid = true;
    this._elements().forEach((field) => {
      if (!this.element(field)) valid = false;
    });
    return valid;
  }

  resetForm() {
    this._elements().forEach((field) => {
      this.clearError(field);
    });
    this.errors = {};
  }
}
