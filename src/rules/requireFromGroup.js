import { VanillaValidator } from '../core.js';

// Use on every field of a group: each field is valid while at least `param[0]`
// fields matching selector `param[1]` have a value. Params: [count, selector] or "count,selector".
function parseGroup(param) {
  const raw = Array.isArray(param) ? param : String(param || '').split(',');
  const count = Number(String(raw[0]).trim());
  const selector = String(raw[1] || '').trim();
  return Number.isFinite(count) && count > 0 && selector ? [count, selector] : null;
}

VanillaValidator.addMethod(
  'require_from_group',
  (_value, param, _field, validator) => {
    const group = parseGroup(param);
    if (!group) return false;
    const form = validator && validator.form;
    if (!form || typeof form.querySelectorAll !== 'function') return true;

    const filled = Array.from(form.querySelectorAll(group[1]))
      .filter((el) => String((el && el.value) || '').trim() !== '');
    return filled.length >= group[0];
  },
  (param) => {
    const group = parseGroup(param);
    return group
      ? `Please fill at least ${group[0]} of these fields.`
      : 'Please fill the required number of fields in this group.';
  }
);
