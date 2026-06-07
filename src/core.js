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
  static locales = {};

  static addLocaleMessages(lang, messages) {
    if (!VanillaValidator.locales[lang]) {
      VanillaValidator.locales[lang] = {};
    }
    Object.assign(VanillaValidator.locales[lang], messages);
  }

  static addMethod(name, validateFn, message) {
    VanillaValidator.methods[name] = {
      validate: validateFn,
      message: message || 'Please fix this field.'
    };
  }

  constructor(form, options = {}) {
    this.form = form;
    this.options = options;
    this.lang = options.lang || 'en';
    this.errorClass = options.errorClass || 'is-invalid';
    this.errorElement = options.errorElement || 'span';
    this.errorElementClass = options.errorElementClass || 'invalid-feedback';
    this.errors = {};

    if (!this.form) {
      throw new Error('A form element is required for validation.');
    }

    this._bindEvents();
  }

  _bindEvents() {
    if (!this.form || typeof this.form.addEventListener !== 'function') return;

    this.form.addEventListener('submit', (event) => {
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      if (this.validate()) {
        if (this._submitHandler) {
          this._submitHandler(this.form);
        }
      }
    });

    if (this.options.onkeyup === false) return;

    this.form.addEventListener('input', (event) => {
      if (event && event.target && event.target.name) {
        this.element(event.target);
      }
    });
  }

  submit(handler) {
    this._submitHandler = handler;
    return this;
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

    // Check locale messages
    const localeMessages = VanillaValidator.locales[this.lang];
    if (localeMessages && localeMessages[ruleName] !== undefined) {
      const localeMsg = localeMessages[ruleName];
      if (typeof localeMsg === 'function') return localeMsg(param, field);
      return localeMsg;
    }

    // Fallback to English if current lang is not English
    if (this.lang !== 'en' && VanillaValidator.locales['en'] && VanillaValidator.locales['en'][ruleName] !== undefined) {
      const enMsg = VanillaValidator.locales['en'][ruleName];
      if (typeof enMsg === 'function') return enMsg(param, field);
      return enMsg;
    }

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
    this._getClassList(field).add(this.errorClass);
    if (field.setAttribute) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('invalid', 'true');
      field.setAttribute('data-jsv-message', message);
    } else {
      field['aria-invalid'] = 'true';
      field['invalid'] = 'true';
    }
    field._jsvMessage = message;
    this._showErrorElement(field, message);
  }

  clearError(field) {
    delete this.errors[field.name];
    this._getClassList(field).remove(this.errorClass);
    if (field.setAttribute) {
      field.setAttribute('aria-invalid', 'false');
      field.removeAttribute('invalid');
      field.removeAttribute('data-jsv-message');
    } else {
      field['aria-invalid'] = 'false';
      delete field['invalid'];
    }
    field._jsvMessage = '';
    this._removeErrorElement(field);
  }

  _showErrorElement(field, message) {
    if (!field.parentNode || typeof document === 'undefined') return;

    this._removeErrorElement(field);

    const el = document.createElement(this.errorElement);
    el.className = this.errorElementClass;
    el.textContent = message;
    el.setAttribute('data-jsv-error-for', field.name);
    field.parentNode.insertBefore(el, field.nextSibling);
  }

  _removeErrorElement(field) {
    if (!field.parentNode) return;

    const existing = field.parentNode.querySelector(
      `[data-jsv-error-for="${field.name}"]`
    );
    if (existing) {
      existing.parentNode.removeChild(existing);
    }
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
