import { describe, it, expect } from 'vitest';
import jsValidation, { VanillaValidator } from '../src/index.js';

function makeClassList() {
  const set = new Set();
  return {
    add: (name) => set.add(name),
    remove: (name) => set.delete(name),
    contains: (name) => set.has(name)
  };
}

function field(name, value = '', dataset = {}) {
  return {
    name,
    value,
    dataset,
    type: 'text',
    disabled: false,
    classList: makeClassList()
  };
}

function makeForm(elements) {
  const byId = new Map();
  elements.forEach((el) => {
    if (el.id) byId.set(`#${el.id}`, el);
  });
  return {
    elements,
    addEventListener: () => {},
    querySelector: (selector) => byId.get(selector) || null
  };
}

describe('jsValidation core', () => {
  it('exports Validator class and addMethod', () => {
    expect(jsValidation.Validator).toBe(VanillaValidator);
    expect(typeof jsValidation.addMethod).toBe('function');
  });

  it('throws when no form element is provided', () => {
    expect(() => jsValidation(null)).toThrow('A form element is required');
  });
});

describe('required rule', () => {
  it('fails for empty value', () => {
    const f = field('name', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { name: { required: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('This field is required.');
  });

  it('passes for non-empty value', () => {
    const f = field('name', 'hello');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { name: { required: true } } });
    expect(v.validate()).toBe(true);
  });
});

describe('email rule', () => {
  it('fails for invalid email', () => {
    const f = field('email', 'wrong');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { email: { email: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Please enter a valid email address.');
  });

  it('passes for valid email', () => {
    const f = field('email', 'user@example.com');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { email: { email: true } } });
    expect(v.validate()).toBe(true);
  });

  it('fails when empty', () => {
    const f = field('email', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { email: { email: true } } });
    expect(v.validate()).toBe(false);
  });
});

describe('minlength rule', () => {
  it('fails when value is too short', () => {
    const f = field('username', 'ab', { ruleMinlength: '3' });
    const form = makeForm([f]);
    const v = jsValidation(form, {});
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toContain('at least 3');
  });

  it('passes when value meets minimum', () => {
    const f = field('username', 'abc');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { username: { minlength: 3 } } });
    expect(v.validate()).toBe(true);
  });
});

describe('maxlength rule', () => {
  it('fails when value is too long', () => {
    const f = field('code', 'abcdef');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { code: { maxlength: 4 } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toContain('no more than 4');
  });

  it('passes when value is within limit', () => {
    const f = field('code', 'abc');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { code: { maxlength: 4 } } });
    expect(v.validate()).toBe(true);
  });
});

describe('pattern rule', () => {
  it('fails when pattern does not match', () => {
    const f = field('zip', 'abc');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { zip: { pattern: '^\\d{5}$' } } });
    expect(v.validate()).toBe(false);
  });

  it('passes when pattern matches', () => {
    const f = field('zip', '12345');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { zip: { pattern: '^\\d{5}$' } } });
    expect(v.validate()).toBe(true);
  });

  it('fails when value is empty', () => {
    const f = field('zip', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { zip: { pattern: '^\\d{5}$' } } });
    expect(v.validate()).toBe(false);
  });
});

describe('equalTo rule', () => {
  it('fails when values do not match', () => {
    const password = field('password', 'secret');
    password.id = 'password';
    const confirm = field('confirmPassword', 'different');
    const form = makeForm([password, confirm]);
    const v = jsValidation(form, { rules: { confirmPassword: { equalTo: '#password' } } });
    expect(v.validate()).toBe(false);
  });

  it('passes when values match', () => {
    const password = field('password', 'secret');
    password.id = 'password';
    const confirm = field('confirmPassword', 'secret');
    const form = makeForm([password, confirm]);
    const v = jsValidation(form, { rules: { confirmPassword: { equalTo: '#password' } } });
    expect(v.validate()).toBe(true);
  });
});

describe('numeric rule', () => {
  it('fails for non-numeric value', () => {
    const f = field('age', 'abc');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { numeric: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Please enter only numeric values.');
  });

  it('passes for numeric value', () => {
    const f = field('age', '123');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { numeric: true } } });
    expect(v.validate()).toBe(true);
  });

  it('fails for empty value', () => {
    const f = field('age', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { numeric: true } } });
    expect(v.validate()).toBe(false);
  });

  it('fails for mixed alphanumeric value', () => {
    const f = field('age', '12a3');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { numeric: true } } });
    expect(v.validate()).toBe(false);
  });
});

describe('custom messages', () => {
  it('uses custom message from options', () => {
    const f = field('username', 'ab');
    const form = makeForm([f]);
    const v = jsValidation(form, {
      rules: { username: { minlength: 3 } },
      messages: { username: { minlength: 'Need at least 3 chars.' } }
    });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Need at least 3 chars.');
  });
});

describe('addMethod', () => {
  it('registers and validates a custom rule', () => {
    jsValidation.addMethod('startsWithA', (value) => String(value).startsWith('A'), 'Must start with A.');
    const f = field('code', 'Bxx');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { code: { startsWithA: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Must start with A.');

    f.value = 'Abc';
    expect(v.validate()).toBe(true);
  });
});

describe('error class and invalid attribute', () => {
  it('adds is-invalid class and invalid attribute on error', () => {
    const f = field('name', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { name: { required: true } } });
    v.validate();
    expect(f.classList.contains('is-invalid')).toBe(true);
    expect(f['aria-invalid']).toBe('true');
    expect(f['invalid']).toBe('');
  });

  it('removes is-invalid class and invalid attribute on clearError', () => {
    const f = field('name', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { name: { required: true } } });
    v.validate();
    f.value = 'hello';
    v.validate();
    expect(f.classList.contains('is-invalid')).toBe(false);
    expect(f['aria-invalid']).toBe('false');
    expect(f['invalid']).toBeUndefined();
  });

  it('uses custom errorClass when provided', () => {
    const f = field('name', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { name: { required: true } }, errorClass: 'custom-error' });
    v.validate();
    expect(f.classList.contains('custom-error')).toBe(true);
    expect(f.classList.contains('is-invalid')).toBe(false);
  });
});

describe('resetForm', () => {
  it('clears all errors', () => {
    const f = field('name', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { name: { required: true } } });
    v.validate();
    expect(Object.keys(v.errors).length).toBe(1);
    v.resetForm();
    expect(Object.keys(v.errors).length).toBe(0);
  });
});

describe('submit handler', () => {
  it('calls submit handler when validation passes', () => {
    const f = field('name', 'hello');
    let submitCalled = false;
    let submitEvents = [];
    const form = {
      elements: [f],
      addEventListener: (event, handler) => { submitEvents.push({ event, handler }); },
      querySelector: () => null
    };
    const v = jsValidation(form, { rules: { name: { required: true } } })
      .submit(() => { submitCalled = true; });

    // Simulate form submit event
    const submitHandler = submitEvents.find(e => e.event === 'submit');
    submitHandler.handler({ preventDefault: () => {} });
    expect(submitCalled).toBe(true);
  });

  it('does not call submit handler when validation fails', () => {
    const f = field('name', '');
    let submitCalled = false;
    let submitEvents = [];
    const form = {
      elements: [f],
      addEventListener: (event, handler) => { submitEvents.push({ event, handler }); },
      querySelector: () => null
    };
    const v = jsValidation(form, { rules: { name: { required: true } } })
      .submit(() => { submitCalled = true; });

    const submitHandler = submitEvents.find(e => e.event === 'submit');
    submitHandler.handler({ preventDefault: () => {} });
    expect(submitCalled).toBe(false);
  });

  it('returns validator instance for chaining', () => {
    const f = field('name', 'hello');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { name: { required: true } } });
    const result = v.submit(() => {});
    expect(result).toBe(v);
  });
});
