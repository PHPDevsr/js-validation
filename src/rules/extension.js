import { VanillaValidator } from '../core.js';

function extensionOf(name) {
  const match = /\.([^.\\/]+)$/.exec(String(name || ''));
  return match ? match[1].toLowerCase() : '';
}

VanillaValidator.addMethod(
  'extension',
  (value, param, field) => {
    const allowed = String(param || '').toLowerCase().split('|').map((ext) => ext.trim()).filter(Boolean);
    if (!allowed.length) return false;

    const files = Array.from((field && field.files) || []);
    if (files.length) return files.every((file) => allowed.includes(extensionOf(file && file.name)));

    const text = String(value || '').trim();
    return text !== '' && allowed.includes(extensionOf(text));
  },
  (param) => `Please select a file with one of these extensions: ${String(param).replace(/\|/g, ', ')}.`
);
