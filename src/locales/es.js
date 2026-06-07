/**
 * Spanish (es) locale messages for js-validation rules.
 */

export const es = {
  required: 'Este campo es obligatorio.',
  email: 'Por favor ingrese una dirección de correo electrónico válida.',
  minlength: (param) => `Por favor ingrese al menos ${param} caracteres.`,
  maxlength: (param) => `Por favor ingrese no más de ${param} caracteres.`,
  range: (param) => {
    try {
      const bounds = Array.isArray(param) ? param : JSON.parse(param);
      return `Por favor ingrese un valor entre ${bounds[0]} y ${bounds[1]}.`;
    } catch {
      return 'Por favor ingrese un rango válido.';
    }
  },
  pattern: 'Por favor cumpla con el formato solicitado.',
  equalTo: 'Por favor ingrese el mismo valor nuevamente.',
  notEqualTo: 'Por favor ingrese un valor diferente.',
  numeric: 'Por favor ingrese solo valores numéricos.',
  url: 'Por favor ingrese una URL válida.',
  date: 'Por favor ingrese una fecha válida.',
  dateISO: 'Por favor ingrese una fecha ISO válida (AAAA-MM-DD).',
  ipv4: 'Por favor ingrese una dirección IPv4 válida.',
  ipv6: 'Por favor ingrese una dirección IPv6 válida.',
  alpha: 'Por favor ingrese solo letras.',
  alphanumeric: 'Por favor ingrese solo letras, números y guiones bajos.',
  maxfiles: (param) => `Por favor seleccione no más de ${param} archivos.`,
  maxsize: (param) => `Por favor seleccione archivos no mayores que ${param}.`,
  maxsizetotal: (param) => `El tamaño total de todos los archivos no debe exceder ${param}.`,
  ishexcolor: 'Por favor ingrese un color hexadecimal válido (p. ej. #fff o #ffffff).',
  time: 'Por favor ingrese una hora válida (HH:MM o HH:MM:SS).'
};
