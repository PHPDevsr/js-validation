/**
 * English (en) locale messages for js-validation rules.
 */

export const en = {
  required: 'This field is required.',
  email: 'Please enter a valid email address.',
  minlength: (param) => `Please enter at least ${param} characters.`,
  maxlength: (param) => `Please enter no more than ${param} characters.`,
  range: (param) => {
    try {
      const bounds = Array.isArray(param) ? param : JSON.parse(param);
      return `Please enter a value between ${bounds[0]} and ${bounds[1]}.`;
    } catch {
      return 'Please enter a valid range.';
    }
  },
  pattern: 'Please match the requested format.',
  equalTo: 'Please enter the same value again.',
  notEqualTo: 'Please enter a different value.',
  numeric: 'Please enter only numeric values.',
  url: 'Please enter a valid URL.',
  date: 'Please enter a valid date.',
  dateISO: 'Please enter a valid ISO date (YYYY-MM-DD).',
  ipv4: 'Please enter a valid IPv4 address.',
  ipv6: 'Please enter a valid IPv6 address.',
  alpha: 'Please enter only alphabetic letters.',
  alphanumeric: 'Please enter only letters, numbers, and underscores.',
  maxfiles: (param) => `Please select no more than ${param} files.`,
  maxsize: (param) => `Please select files no larger than ${param}.`,
  maxsizetotal: (param) => `Total size of all files must not exceed ${param}.`,
  ishexcolor: 'Please enter a valid hex color (e.g. #fff or #ffffff).',
  time: 'Please enter a valid time (HH:MM or HH:MM:SS).'
};
