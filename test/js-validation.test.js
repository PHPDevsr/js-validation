const test = require('node:test');
const assert = require('node:assert/strict');
const jsValidation = require('../src/js-validation');

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

test('validates required and email rules from options', () => {
  const email = field('email', 'wrong');
  const form = makeForm([email]);
  const validator = jsValidation(form, {
    rules: {
      email: { required: true, email: true }
    }
  });

  assert.equal(validator.validate(), false);
  assert.equal(email.validationMessage, 'Please enter a valid email address.');

  email.value = 'user@example.com';
  assert.equal(validator.validate(), true);
  assert.equal(email.validationMessage, '');
});

test('supports dataset rules and custom messages', () => {
  const username = field('username', 'ab', { ruleMinlength: '3' });
  const form = makeForm([username]);
  const validator = jsValidation(form, {
    messages: {
      username: {
        minlength: 'Need at least 3 chars.'
      }
    }
  });

  assert.equal(validator.validate(), false);
  assert.equal(username.validationMessage, 'Need at least 3 chars.');
});

test('supports equalTo rule', () => {
  const password = field('password', 'secret');
  password.id = 'password';
  const confirm = field('confirmPassword', 'different');
  const form = makeForm([password, confirm]);
  const validator = jsValidation(form, {
    rules: {
      confirmPassword: { equalTo: '#password' }
    }
  });

  assert.equal(validator.validate(), false);

  confirm.value = 'secret';
  assert.equal(validator.validate(), true);
});
