import { describe, it, expect } from 'vitest';
import jsValidation from '../src/index.js';

function makeClassList() {
  const set = new Set();
  return {
    add: (name) => set.add(name),
    remove: (name) => set.delete(name),
    contains: (name) => set.has(name)
  };
}

function field(name, value = '', extra = {}) {
  return {
    name,
    value,
    dataset: {},
    type: 'text',
    disabled: false,
    classList: makeClassList(),
    ...extra
  };
}

function makeForm(elements, byId = {}) {
  const bySelector = new Map(Object.entries(byId));
  return {
    elements,
    addEventListener: () => {},
    querySelector: (selector) => bySelector.get(selector) || null,
    querySelectorAll: (selector) => elements.filter((el) => el.matches && el.matches(selector))
  };
}

// Validate one field with one rule and return whether it passed.
function check(value, rules, options = {}) {
  const f = field('f', value, options.extra);
  const form = options.form || makeForm([f]);
  if (!form.elements.includes(f)) form.elements = [...form.elements, f];
  const v = jsValidation(form, { rules: { f: rules }, ...options.opts });
  return { valid: v.validate(), message: f._jsvMessage };
}

describe('digits / integer / number rules', () => {
  it.each([
    ['123', true], ['12.3', false], ['-1', false], ['', false]
  ])('digits "%s" -> %s', (value, expected) => {
    expect(check(value, { digits: true }).valid).toBe(expected);
  });

  it.each([
    ['123', true], ['-123', true], ['+42', true], ['1.5', false], ['', false]
  ])('integer "%s" -> %s', (value, expected) => {
    expect(check(value, { integer: true }).valid).toBe(expected);
  });

  it.each([
    ['12.5', true], ['-3', true], ['1,234.56', true], ['1.2.3', false], ['', false]
  ])('number "%s" -> %s', (value, expected) => {
    expect(check(value, { number: true }).valid).toBe(expected);
  });
});

describe('letters rule', () => {
  it('accepts letters only by default', () => {
    expect(check('John', { letters: true }).valid).toBe(true);
    expect(check('John Doe', { letters: true }).valid).toBe(false);
    expect(check('', { letters: true }).valid).toBe(false);
  });

  it('accepts spaces and dashes for birthdate option', () => {
    expect(check('Mary-Jane Smith', { letters: 'birthdate' }).valid).toBe(true);
    expect(check('Mary1', { letters: 'birthdate' }).valid).toBe(false);
  });

  it('accepts apostrophes and commas for id option', () => {
    expect(check("O'Brien, Jr", { letters: 'id' }).valid).toBe(true);
  });
});

describe('notblank rule', () => {
  it('rejects empty but accepts whitespace', () => {
    expect(check('', { notblank: true }).valid).toBe(false);
    expect(check('   ', { notblank: true }).valid).toBe(true);
  });
});
