/**
 * Localization messages for js-validation rules.
 *
 * Each locale lives in its own file under src/locales/<lang>.js.
 * Add a new locale by creating src/locales/<lang>.js and re-exporting it here.
 */

import { en } from './locales/en.js';
import { es } from './locales/es.js';

export const locales = { en, es };

// Named re-exports so consumers can import individual locales directly:
//   import { en } from 'js-validation/locales'
export { en, es };
