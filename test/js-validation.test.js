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

describe('url rule', () => {
  it('fails for invalid url', () => {
    const f = field('url', 'wrong');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { url: { url: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Please enter a valid URL.');
  });

  it('fails for url without domain', () => {
    const f = field('url', 'http://');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { url: { url: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Please enter a valid URL.');
  });

  it('fails for url without TLD', () => {
    const f = field('url', 'http://example');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { url: { url: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Please enter a valid URL.');
  });

  it('passes for valid url with subdomain', () => {
    const f = field('url', 'https://sub.example.com');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { url: { url: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for valid url with HTTPS', () => {
    const f = field('url', 'https://example.com');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { url: { url: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for valid url with HTTP', () => {
    const f = field('url', 'http://example.com');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { url: { url: true } } });
    expect(v.validate()).toBe(true);
  });

  it('fails when empty', () => {
    const f = field('url', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { url: { url: true } } });
    expect(v.validate()).toBe(false);
  });
});

describe('date rule', () => {
  it('fails for invalid date', () => {
    const f = field('date', 'not-a-date');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { date: { date: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Please enter a valid date.');
  });

  it('passes for valid date', () => {
    const f = field('date', '2026-05-27');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { date: { date: true } } });
    expect(v.validate()).toBe(true);
  });
});

describe('dateISO rule', () => {
  it('fails for non-ISO format', () => {
    const f = field('startDate', '05/27/2026');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { startDate: { dateISO: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Please enter a valid ISO date (YYYY-MM-DD).');
  });

  it('passes for YYYY-MM-DD format', () => {
    const f = field('startDate', '2026-05-27');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { startDate: { dateISO: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for YYYY/MM/DD format', () => {
    const f = field('startDate', '2026/05/27');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { startDate: { dateISO: true } } });
    expect(v.validate()).toBe(true);
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

describe('range rule', () => {
  it('fails when value is below minimum', () => {
    const f = field('age', '1');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { range: [2, 8] } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toContain('between 2 and 8');
  });

  it('fails when value exceeds maximum', () => {
    const f = field('age', '9');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { range: [2, 8] } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toContain('between 2 and 8');
  });

  it('fails for non-numeric value', () => {
    const f = field('age', 'abc');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { range: [2, 8] } } });
    expect(v.validate()).toBe(false);
  });

  it('fails for empty value', () => {
    const f = field('age', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { range: [2, 8] } } });
    expect(v.validate()).toBe(false);
  });

  it('passes when value meets exact minimum', () => {
    const f = field('age', '2');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { range: [2, 8] } } });
    expect(v.validate()).toBe(true);
  });

  it('passes when value meets exact maximum', () => {
    const f = field('age', '8');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { range: [2, 8] } } });
    expect(v.validate()).toBe(true);
  });

  it('passes when value is within range', () => {
    const f = field('age', '5');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { range: [2, 8] } } });
    expect(v.validate()).toBe(true);
  });

  it('returns false when param is a single number instead of array', () => {
    const f = field('age', '5');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { range: 5 } } });
    expect(v.validate()).toBe(false);
  });

  it('returns false when param is an array with only one element', () => {
    const f = field('age', '5');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { range: [2] } } });
    expect(v.validate()).toBe(false);
  });

  it('returns false when param is an invalid JSON string', () => {
    const f = field('age', '5');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { range: 'invalid' } } });
    expect(v.validate()).toBe(false);
  });

  it('returns false when param is null', () => {
    const f = field('age', '5');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { age: { range: null } } });
    expect(v.validate()).toBe(false);
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

describe('notEqualTo rule', () => {
  it('fails when values match', () => {
    const current = field('currentPassword', 'secret');
    current.id = 'currentPassword';
    const next = field('newPassword', 'secret');
    const form = makeForm([current, next]);
    const v = jsValidation(form, { rules: { newPassword: { notEqualTo: '#currentPassword' } } });
    expect(v.validate()).toBe(false);
    expect(next._jsvMessage).toBe('Please enter a different value.');
  });

  it('passes when values are different', () => {
    const current = field('currentPassword', 'secret');
    current.id = 'currentPassword';
    const next = field('newPassword', 'secret-2');
    const form = makeForm([current, next]);
    const v = jsValidation(form, { rules: { newPassword: { notEqualTo: '#currentPassword' } } });
    expect(v.validate()).toBe(true);
  });
});

describe('maxfiles rule', () => {
  it('fails when selected files exceed the limit', () => {
    const upload = field('attachments', '');
    upload.type = 'file';
    upload.files = [{ name: 'one.txt', size: 10 }, { name: 'two.txt', size: 10 }, { name: 'three.txt', size: 10 }];
    const form = makeForm([upload]);
    const v = jsValidation(form, { rules: { attachments: { maxfiles: 2 } } });
    expect(v.validate()).toBe(false);
    expect(upload._jsvMessage).toBe('Please select no more than 2 files.');
  });

  it('passes when selected files are within the limit', () => {
    const upload = field('attachments', '', { ruleMaxfiles: '2' });
    upload.type = 'file';
    upload.files = [{ name: 'one.txt', size: 10 }, { name: 'two.txt', size: 10 }];
    const form = makeForm([upload]);
    const v = jsValidation(form);
    expect(v.validate()).toBe(true);
  });
});

describe('maxsize rule', () => {
  it('fails when any selected file exceeds the limit', () => {
    const upload = field('attachments', '', { ruleMaxsize: '2KB' });
    upload.type = 'file';
    upload.files = [{ name: 'small.txt', size: 512 }, { name: 'large.txt', size: 4096 }];
    const form = makeForm([upload]);
    const v = jsValidation(form);
    expect(v.validate()).toBe(false);
    expect(upload._jsvMessage).toBe('Please select files no larger than 2KB.');
  });

  it('passes when all selected files are within the limit', () => {
    const upload = field('attachments', '');
    upload.type = 'file';
    upload.files = [{ name: 'one.txt', size: 512 }, { name: 'two.txt', size: 1024 }];
    const form = makeForm([upload]);
    const v = jsValidation(form, { rules: { attachments: { maxsize: 2048 } } });
    expect(v.validate()).toBe(true);
  });
});

describe('maxsizetotal rule', () => {
  it('fails when the combined size of all files exceeds the limit', () => {
    const upload = field('attachments', '', { ruleMaxsizetotal: '2KB' });
    upload.type = 'file';
    upload.files = [{ name: 'a.txt', size: 1024 }, { name: 'b.txt', size: 1024 }, { name: 'c.txt', size: 1 }];
    const form = makeForm([upload]);
    const v = jsValidation(form);
    expect(v.validate()).toBe(false);
    expect(upload._jsvMessage).toBe('Total size of all files must not exceed 2KB.');
  });

  it('passes when the combined size of all files is within the limit', () => {
    const upload = field('attachments', '');
    upload.type = 'file';
    upload.files = [{ name: 'a.txt', size: 512 }, { name: 'b.txt', size: 512 }];
    const form = makeForm([upload]);
    const v = jsValidation(form, { rules: { attachments: { maxsizetotal: '2KB' } } });
    expect(v.validate()).toBe(true);
  });

  it('passes when combined size exactly equals the limit', () => {
    const upload = field('attachments', '');
    upload.type = 'file';
    upload.files = [{ name: 'a.txt', size: 1024 }, { name: 'b.txt', size: 1024 }];
    const form = makeForm([upload]);
    const v = jsValidation(form, { rules: { attachments: { maxsizetotal: '2KB' } } });
    expect(v.validate()).toBe(true);
  });

  it('passes when no files are selected', () => {
    const upload = field('attachments', '');
    upload.type = 'file';
    upload.files = [];
    const form = makeForm([upload]);
    const v = jsValidation(form, { rules: { attachments: { maxsizetotal: '1KB' } } });
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
  it('adds is-invalid class and invalid="true" attribute on error', () => {
    const f = field('name', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { name: { required: true } } });
    v.validate();
    expect(f.classList.contains('is-invalid')).toBe(true);
    expect(f['aria-invalid']).toBe('true');
    expect(f['invalid']).toBe('true');
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

describe('ipv4 rule', () => {
  it('fails for invalid IPv4 address', () => {
    const f = field('ip', '999.999.999.999');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv4: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Please enter a valid IPv4 address.');
  });

  it('fails for partial address', () => {
    const f = field('ip', '192.168.1');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv4: true } } });
    expect(v.validate()).toBe(false);
  });

  it('fails for address with letters', () => {
    const f = field('ip', '192.168.1.abc');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv4: true } } });
    expect(v.validate()).toBe(false);
  });

  it('fails for empty value', () => {
    const f = field('ip', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv4: true } } });
    expect(v.validate()).toBe(false);
  });

  it('passes for valid IPv4 address', () => {
    const f = field('ip', '192.168.1.1');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv4: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for loopback address', () => {
    const f = field('ip', '127.0.0.1');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv4: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for broadcast address', () => {
    const f = field('ip', '255.255.255.255');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv4: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for 0.0.0.0', () => {
    const f = field('ip', '0.0.0.0');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv4: true } } });
    expect(v.validate()).toBe(true);
  });
});

describe('ipv6 rule', () => {
  it('fails for invalid IPv6 address', () => {
    const f = field('ip', 'gggg::1');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv6: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Please enter a valid IPv6 address.');
  });

  it('fails for plain IPv4 address', () => {
    const f = field('ip', '192.168.1.1');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv6: true } } });
    expect(v.validate()).toBe(false);
  });

  it('fails for empty value', () => {
    const f = field('ip', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv6: true } } });
    expect(v.validate()).toBe(false);
  });

  it('passes for full IPv6 address', () => {
    const f = field('ip', '2001:0db8:85a3:0000:0000:8a2e:0370:7334');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv6: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for compressed IPv6 address', () => {
    const f = field('ip', '2001:db8::1');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv6: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for loopback ::1', () => {
    const f = field('ip', '::1');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv6: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for IPv6 with trailing colon groups', () => {
    const f = field('ip', 'fe80::');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { ip: { ipv6: true } } });
    expect(v.validate()).toBe(true);
  });
});

describe('alphanumeric rule', () => {
  it('fails for value with spaces', () => {
    const f = field('username', 'hello world');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { username: { alphanumeric: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Please enter only letters, numbers, and underscores.');
  });

  it('fails for value with special characters', () => {
    const f = field('username', 'hello@world');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { username: { alphanumeric: true } } });
    expect(v.validate()).toBe(false);
  });

  it('fails for value with hyphens', () => {
    const f = field('username', 'hello-world');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { username: { alphanumeric: true } } });
    expect(v.validate()).toBe(false);
  });

  it('fails for empty value', () => {
    const f = field('username', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { username: { alphanumeric: true } } });
    expect(v.validate()).toBe(false);
  });

  it('passes for letters only', () => {
    const f = field('username', 'helloworld');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { username: { alphanumeric: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for digits only', () => {
    const f = field('username', '12345');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { username: { alphanumeric: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for letters and digits mixed', () => {
    const f = field('username', 'hello123');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { username: { alphanumeric: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for value with underscores', () => {
    const f = field('username', 'hello_world');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { username: { alphanumeric: true } } });
    expect(v.validate()).toBe(true);
  });
});

describe('ishexcolor rule', () => {
  it('fails for invalid hex color (no hash)', () => {
    const f = field('color', 'ffffff');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { color: { ishexcolor: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Please enter a valid hex color (e.g. #fff or #ffffff).');
  });

  it('fails for invalid hex color (too short)', () => {
    const f = field('color', '#ff');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { color: { ishexcolor: true } } });
    expect(v.validate()).toBe(false);
  });

  it('fails for invalid hex color (too long)', () => {
    const f = field('color', '#fffffff');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { color: { ishexcolor: true } } });
    expect(v.validate()).toBe(false);
  });

  it('fails for invalid hex color (invalid characters)', () => {
    const f = field('color', '#zzzzzz');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { color: { ishexcolor: true } } });
    expect(v.validate()).toBe(false);
  });

  it('fails for empty value', () => {
    const f = field('color', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { color: { ishexcolor: true } } });
    expect(v.validate()).toBe(false);
  });

  it('passes for valid 6-digit hex color (lowercase)', () => {
    const f = field('color', '#1a2b3c');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { color: { ishexcolor: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for valid 6-digit hex color (uppercase)', () => {
    const f = field('color', '#AABBCC');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { color: { ishexcolor: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for valid 3-digit hex color (lowercase)', () => {
    const f = field('color', '#abc');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { color: { ishexcolor: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for valid 3-digit hex color (uppercase)', () => {
    const f = field('color', '#FFF');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { color: { ishexcolor: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for #000000 (black)', () => {
    const f = field('color', '#000000');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { color: { ishexcolor: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for #ffffff (white)', () => {
    const f = field('color', '#ffffff');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { color: { ishexcolor: true } } });
    expect(v.validate()).toBe(true);
  });
});

describe('time rule', () => {
  it('fails for invalid hour', () => {
    const f = field('appointment', '24:00');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { appointment: { time: true } } });
    expect(v.validate()).toBe(false);
    expect(f._jsvMessage).toBe('Please enter a valid time (HH:MM or HH:MM:SS).');
  });

  it('fails for invalid minute', () => {
    const f = field('appointment', '12:60');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { appointment: { time: true } } });
    expect(v.validate()).toBe(false);
  });

  it('fails for invalid second', () => {
    const f = field('appointment', '10:30:60');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { appointment: { time: true } } });
    expect(v.validate()).toBe(false);
  });

  it('fails for empty value', () => {
    const f = field('appointment', '');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { appointment: { time: true } } });
    expect(v.validate()).toBe(false);
  });

  it('passes for H:MM format', () => {
    const f = field('appointment', '9:05');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { appointment: { time: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for HH:MM format', () => {
    const f = field('appointment', '09:05');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { appointment: { time: true } } });
    expect(v.validate()).toBe(true);
  });

  it('passes for HH:MM:SS format', () => {
    const f = field('appointment', '23:59:59');
    const form = makeForm([f]);
    const v = jsValidation(form, { rules: { appointment: { time: true } } });
    expect(v.validate()).toBe(true);
  });
});
