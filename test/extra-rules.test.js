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

describe('different rule', () => {
  function run(value) {
    const other = field('other', 'secret', { id: 'other' });
    return check(value, { different: '#other' }, { form: makeForm([], { '#other': other }) });
  }

  it('fails when values match', () => {
    expect(run('secret').valid).toBe(false);
  });

  it('passes when values differ', () => {
    expect(run('othervalue').valid).toBe(true);
  });
});

describe('phoneUS rule', () => {
  it.each([
    ['5555555555', true], ['(555) 555-5555', true], ['+1 555-555-5555', true], ['12345', false], ['', false]
  ])('"%s" -> %s', (value, expected) => {
    expect(check(value, { phoneUS: true }).valid).toBe(expected);
  });
});

describe('domain rule', () => {
  it.each([
    ['example.com', true], ['sub.example.co.id', true], ['example', false], ['-bad.com', false], ['example..com', false], ['', false]
  ])('"%s" -> %s', (value, expected) => {
    expect(check(value, { domain: true }).valid).toBe(expected);
  });
});

describe('url2 rule', () => {
  it.each([
    ['https://example.com/path', true], ['http://sub.example.id', true], ['example.com', false], ['http://localhost', false], ['', false]
  ])('"%s" -> %s', (value, expected) => {
    expect(check(value, { url2: true }).valid).toBe(expected);
  });
});

describe('dateBefore / dateAfter rules', () => {
  it('compares against a fixed date', () => {
    expect(check('2020-01-01', { dateBefore: '2024-01-01' }).valid).toBe(true);
    expect(check('2025-01-01', { dateBefore: '2024-01-01' }).valid).toBe(false);
    expect(check('2025-01-01', { dateAfter: '2024-01-01' }).valid).toBe(true);
  });

  it('compares against another field', () => {
    const start = field('start', '2024-06-01', { id: 'start' });
    const end = field('end', '2024-05-01');
    const form = makeForm([start, end], { '#start': start });
    const v = jsValidation(form, { rules: { end: { dateAfter: '#start' } } });
    expect(v.validate()).toBe(false);
    end.value = '2024-07-01';
    expect(v.validate()).toBe(true);
  });

  it('rejects empty or unparsable values', () => {
    expect(check('', { dateBefore: 'today' }).valid).toBe(false);
    expect(check('not-a-date', { dateAfter: '2000-01-01' }).valid).toBe(false);
  });
});

describe('require_from_group rule', () => {
  function groupForm() {
    const phone = field('phone', '', { id: 'phone' });
    const email = field('email', '', { id: 'email' });
    [phone, email].forEach((el) => {
      el.matches = (selector) => selector === '.contact';
    });
    return makeForm([phone, email]);
  }

  it('fails when no group field is filled', () => {
    const form = groupForm();
    const v = jsValidation(form, { rules: { phone: { require_from_group: [1, '.contact'] } } });
    expect(v.validate()).toBe(false);
    expect(form.elements[0]._jsvMessage).toBe('Please fill at least 1 of these fields.');
  });

  it('passes when enough group fields are filled', () => {
    const form = groupForm();
    form.elements[1].value = 'a@b.co';
    const v = jsValidation(form, { rules: { phone: { require_from_group: '1,.contact' } } });
    expect(v.validate()).toBe(true);
  });

  it('fails on an invalid param', () => {
    const form = groupForm();
    const v = jsValidation(form, { rules: { phone: { require_from_group: 'nope' } } });
    expect(v.validate()).toBe(false);
  });
});
