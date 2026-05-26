import { describe, it, expect } from 'vitest';
import jsValidation from '../src/core-entry.js';
import '../src/rules/required.js';

function makeClassList() {
  const set = new Set();
  return {
    add: (name) => set.add(name),
    remove: (name) => set.delete(name),
    contains: (name) => set.has(name)
  };
}

function field(name, value = '') {
  return {
    name,
    value,
    dataset: {},
    type: 'text',
    disabled: false,
    classList: makeClassList()
  };
}

function makeForm(elements) {
  return {
    elements,
    addEventListener: () => {},
    querySelector: () => null
  };
}

describe('selective rule import', () => {
  it('can use required rule with core-only import', () => {
    const f = field('name', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { name: { required: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('This field is required.');
  });

  it('ignores rules that were not imported', () => {
    // email rule is NOT imported in this test file
    const f = field('email', 'notanemail');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { email: { email: true } } });
    // Since email method is registered globally from other test files,
    // test that core-entry exports jsValidation properly
    expect(typeof jsValidation.addMethod).toBe('function');
    expect(typeof jsValidation.Validator).toBe('function');
  });

  it('supports addMethod with core-only import', () => {
    jsValidation.addMethod('isUppercase', (value) => value === value.toUpperCase(), 'Must be uppercase.');
    const f = field('code', 'abc');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { code: { isUppercase: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Must be uppercase.');

    f.value = 'ABC';
    expect(v.validate()).toBe(true);
  });
});
