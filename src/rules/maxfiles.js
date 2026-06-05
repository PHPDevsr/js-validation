import { VanillaValidator } from '../core.js';

VanillaValidator.addMethod(
  'maxfiles',
  (_value, param, field) => {
    const limit = Number(param);
    if (!Number.isFinite(limit) || limit < 0) return false;
    const files = Array.from((field && field.files) || []);
    return files.length <= limit;
  },
  (param) => `Please select no more than ${param} files.`
);
