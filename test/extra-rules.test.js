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

describe('creditcard rule', () => {
  it.each([
    ['4111111111111111', true],
    ['4111 1111 1111 1111', true],
    ['5555555555554444', true],
    ['378282246310005', true],
    ['6011111111111117', true],
    ['4111111111111112', false],
    ['1234567890123456', false],
    ['', false]
  ])('"%s" -> %s', (value, expected) => {
    expect(check(value, { creditcard: true }).valid).toBe(expected);
  });
});

describe('creditcardExpiry rule', () => {
  function future() {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
  }

  it('accepts a future expiry', () => {
    expect(check(future(), { creditcardExpiry: true }).valid).toBe(true);
  });

  it.each(['13/30', '00/30', '12-30', ''])('rejects "%s"', (value) => {
    expect(check(value, { creditcardExpiry: true }).valid).toBe(false);
  });

  it('rejects an expired card', () => {
    expect(check('01/20', { creditcardExpiry: true }).valid).toBe(false);
  });
});

describe('extension rule', () => {
  function fileField(files) {
    return field('upload', '', { type: 'file', files });
  }

  it('checks file names', () => {
    const f = fileField([{ name: 'a.PNG', size: 1 }, { name: 'b.jpg', size: 1 }]);
    const form = makeForm([]);
    expect(check('', { extension: 'jpg|png' }, { form, extra: { files: f.files } }).valid).toBe(true);
  });

  it('fails when a file has a disallowed extension', () => {
    const f = fileField([{ name: 'a.exe', size: 1 }]);
    const form = makeForm([]);
    expect(check('', { extension: 'jpg|png' }, { form, extra: { files: f.files } }).valid).toBe(false);
  });

  it('checks a plain value when there are no files', () => {
    expect(check('photo.webp', { extension: 'webp' }).valid).toBe(true);
    expect(check('photo.gif', { extension: 'webp' }).valid).toBe(false);
  });
});

describe('accept rule', () => {
  it('supports wildcard MIME types', () => {
    const f = field('upload', '', { type: 'file', files: [{ name: 'a.png', type: 'image/png', size: 1 }] });
    const form = makeForm([]);
    expect(check('', { accept: 'image/*' }, { form, extra: { files: f.files } }).valid).toBe(true);

    const bad = field('upload', '', { type: 'file', files: [{ name: 'a.pdf', type: 'application/pdf', size: 1 }] });
    const badForm = makeForm([]);
    expect(check('', { accept: 'image/*' }, { form: badForm, extra: { files: bad.files } }).valid).toBe(false);
  });
});
