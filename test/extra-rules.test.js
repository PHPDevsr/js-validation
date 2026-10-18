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

describe('min / max rules', () => {
  it.each([
    ['5', 5, true], ['4.99', 5, false], ['', 5, false], ['abc', 5, false]
  ])('min: %s against %s -> %s', (value, param, expected) => {
    expect(check(value, { min: param }).valid).toBe(expected);
  });

  it.each([
    ['10', 10, true], ['10.01', 10, false], ['', 10, false]
  ])('max: %s against %s -> %s', (value, param, expected) => {
    expect(check(value, { max: param }).valid).toBe(expected);
  });

  it('shows param in message', () => {
    expect(check('1', { min: 3 }).message).toBe('Please enter a value greater than or equal to 3.');
  });
});

describe('step rule', () => {
  it.each([
    ['4', 2, true], ['5', 2, false], ['0', 2, true], ['', 2, false]
  ])('integer step: %s step %s -> %s', (value, param, expected) => {
    expect(check(value, { step: param }).valid).toBe(expected);
  });

  it.each([
    ['0.3', 0.1, true], ['0.7', 0.1, true], ['0.35', 0.1, false], ['1.25', 0.25, true]
  ])('decimal step: %s step %s -> %s', (value, param, expected) => {
    expect(check(value, { step: param }).valid).toBe(expected);
  });

  it('respects the field min as base', () => {
    const form = makeForm([]);
    expect(check('7', { step: 2 }, { form, extra: { min: '3' } }).valid).toBe(true);
    expect(check('8', { step: 2 }, { form, extra: { min: '3' } }).valid).toBe(false);
  });
});

describe('rangelength rule', () => {
  it.each([
    ['abc', [2, 4], true], ['ab', [2, 4], true], ['abcde', [2, 4], false], ['a', [2, 4], false]
  ])('"%s" in %j -> %s', (value, param, expected) => {
    expect(check(value, { rangelength: param }).valid).toBe(expected);
  });

  it('accepts JSON string and "min,max" params', () => {
    expect(check('abc', { rangelength: '[2,4]' }).valid).toBe(true);
    expect(check('abc', { rangelength: '2,4' }).valid).toBe(true);
  });

  it('fails on invalid param', () => {
    expect(check('abc', { rangelength: 'nope' }).valid).toBe(false);
  });
});
