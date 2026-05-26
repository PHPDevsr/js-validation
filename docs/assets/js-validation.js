(function (globalFactory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = globalFactory();
  } else {
    globalThis.jsValidation = globalFactory();
  }
})(function () {
  function defaultMessage(name, value) {
    if (name === 'minlength') return 'Please enter at least ' + value + ' characters.';
    if (name === 'maxlength') return 'Please enter no more than ' + value + ' characters.';
    return 'Please fix this field.';
  }

  function createClassList() {
    var set = new Set();
    return {
      add: function (name) {
        set.add(name);
      },
      remove: function (name) {
        set.delete(name);
      },
      contains: function (name) {
        return set.has(name);
      }
    };
  }

  function VanillaValidator(form, options) {
    this.form = form;
    this.options = options || {};
    this.errors = {};

    if (!this.form) {
      throw new Error('A form element is required for validation.');
    }

    this._bindEvents();
  }

  VanillaValidator.prototype._bindEvents = function () {
    if (!this.form || typeof this.form.addEventListener !== 'function') return;

    var self = this;
    this.form.addEventListener('submit', function (event) {
      if (!self.validate() && event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
    });

    if (this.options.onkeyup === false) return;

    this.form.addEventListener('input', function (event) {
      if (event && event.target && event.target.name) {
        self.element(event.target);
      }
    });
  };

  VanillaValidator.methods = {
    required: {
      validate: function (value) {
        return String(value || '').trim().length > 0;
      },
      message: 'This field is required.'
    },
    email: {
      validate: function (value) {
        if (String(value || '').trim() === '') return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
      },
      message: 'Please enter a valid email address.'
    },
    minlength: {
      validate: function (value, expected) {
        return String(value || '').length >= Number(expected);
      },
      message: function (param) {
        return defaultMessage('minlength', param);
      }
    },
    maxlength: {
      validate: function (value, expected) {
        return String(value || '').length <= Number(expected);
      },
      message: function (param) {
        return defaultMessage('maxlength', param);
      }
    },
    pattern: {
      validate: function (value, expected) {
        if (String(value || '').trim() === '') return true;
        return new RegExp(expected).test(String(value));
      },
      message: 'Please match the requested format.'
    },
    equalTo: {
      validate: function (value, selector, field, validator) {
        if (!validator.form || typeof validator.form.querySelector !== 'function') return true;
        var target = validator.form.querySelector(selector);
        return !!target && String(value || '') === String(target.value || '');
      },
      message: 'Please enter the same value again.'
    }
  };

  VanillaValidator.addMethod = function (name, validateFn, message) {
    VanillaValidator.methods[name] = {
      validate: validateFn,
      message: message || defaultMessage(name)
    };
  };

  VanillaValidator.prototype._elements = function () {
    var formElements = this.form.elements || [];
    return Array.prototype.filter.call(formElements, function (field) {
      return field && field.name && !field.disabled && field.type !== 'submit';
    });
  };

  VanillaValidator.prototype._rulesFromDataset = function (field) {
    var rules = {};
    var dataset = field.dataset || {};

    Object.keys(dataset).forEach(function (key) {
      if (key.indexOf('rule') !== 0 || key.length <= 4) return;
      var ruleName = key.charAt(4).toLowerCase() + key.slice(5);
      var raw = dataset[key];
      rules[ruleName] = raw === '' ? true : raw;
    });

    return rules;
  };

  VanillaValidator.prototype._rulesFor = function (field) {
    var optionRules = (this.options.rules && this.options.rules[field.name]) || {};
    return Object.assign({}, this._rulesFromDataset(field), optionRules);
  };

  VanillaValidator.prototype._messageFor = function (field, ruleName, param, methodDef) {
    var custom = this.options.messages && this.options.messages[field.name] && this.options.messages[field.name][ruleName];
    if (custom) return custom;

    var message = methodDef.message;
    if (typeof message === 'function') return message(param, field);
    return message || defaultMessage(ruleName, param);
  };

  VanillaValidator.prototype._getClassList = function (field) {
    if (!field.classList) field.classList = createClassList();
    return field.classList;
  };

  VanillaValidator.prototype.showError = function (field, message) {
    this.errors[field.name] = message;
    this._getClassList(field).add('jsv-invalid');
    field['aria-invalid'] = 'true';
    field.validationMessage = message;
  };

  VanillaValidator.prototype.clearError = function (field) {
    delete this.errors[field.name];
    this._getClassList(field).remove('jsv-invalid');
    field['aria-invalid'] = 'false';
    field.validationMessage = '';
  };

  VanillaValidator.prototype.element = function (field) {
    var self = this;
    if (!field || !field.name) return true;

    var value = field.value;
    var rules = this._rulesFor(field);
    var ruleNames = Object.keys(rules);

    for (var i = 0; i < ruleNames.length; i += 1) {
      var ruleName = ruleNames[i];
      var methodDef = VanillaValidator.methods[ruleName];
      if (!methodDef) continue;

      var param = rules[ruleName];
      if (param === false || param === 'false') continue;

      var valid = methodDef.validate(value, param, field, self);
      if (!valid) {
        this.showError(field, this._messageFor(field, ruleName, param, methodDef));
        return false;
      }
    }

    this.clearError(field);
    return true;
  };

  VanillaValidator.prototype.validate = function () {
    var self = this;
    var valid = true;

    this._elements().forEach(function (field) {
      if (!self.element(field)) valid = false;
    });

    return valid;
  };

  VanillaValidator.prototype.resetForm = function () {
    var self = this;
    this._elements().forEach(function (field) {
      self.clearError(field);
    });
    this.errors = {};
  };

  function initValidation(formOrSelector, options) {
    var form = formOrSelector;
    if (typeof formOrSelector === 'string' && typeof document !== 'undefined') {
      form = document.querySelector(formOrSelector);
    }
    return new VanillaValidator(form, options || {});
  }

  initValidation.Validator = VanillaValidator;
  initValidation.addMethod = VanillaValidator.addMethod;

  return initValidation;
});
