// src/core.js
/**
* js-validation core – vanilla JS form validator (jquery-validation style).
*/
function createClassList() {
	const set = /* @__PURE__ */ new Set();
	return {
		add(name) {
			set.add(name);
		},
		remove(name) {
			set.delete(name);
		},
		contains(name) {
			return set.has(name);
		}
	};
}
var VanillaValidator = class VanillaValidator {
	static methods = Object.create(null);
	static locales = Object.create(null);
	static addLocaleMessages(lang, messages) {
		if (lang === "__proto__" || lang === "constructor" || lang === "prototype") throw new Error("Invalid locale key.");
		if (!VanillaValidator.locales[lang]) VanillaValidator.locales[lang] = Object.create(null);
		if (!messages || typeof messages !== "object") return;
		for (const key of Object.keys(messages)) {
			if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
			VanillaValidator.locales[lang][key] = messages[key];
		}
	}
	static addMethod(name, validateFn, message) {
		if (name === "__proto__" || name === "constructor" || name === "prototype") throw new Error("Invalid method name.");
		VanillaValidator.methods[name] = {
			validate: validateFn,
			message: message || "Please fix this field."
		};
	}
	constructor(form, options = {}) {
		this.form = form;
		this.options = options;
		this.lang = options.lang || "en";
		this.errorClass = options.errorClass || "is-invalid";
		this.errorElement = options.errorElement || "span";
		this.errorElementClass = options.errorElementClass || "invalid-feedback";
		this.errors = {};
		if (!this.form) throw new Error("A form element is required for validation.");
		this._bindEvents();
	}
	_bindEvents() {
		if (!this.form || typeof this.form.addEventListener !== "function") return;
		this.form.addEventListener("submit", (event) => {
			if (event && typeof event.preventDefault === "function") event.preventDefault();
			if (this.validate()) {
				if (this._submitHandler) this._submitHandler(this.form);
			}
		});
		if (this.options.onkeyup === false) return;
		this.form.addEventListener("input", (event) => {
			if (event && event.target && event.target.name) this.element(event.target);
		});
	}
	submit(handler) {
		this._submitHandler = handler;
		return this;
	}
	_elements() {
		const formElements = this.form.elements || [];
		return Array.prototype.filter.call(formElements, (field) => field && field.name && !field.disabled && field.type !== "submit");
	}
	_rulesFromDataset(field) {
		const rules = {};
		const dataset = field.dataset || {};
		Object.keys(dataset).forEach((key) => {
			if (key.indexOf("rule") !== 0 || key.length <= 4) return;
			const ruleName = key.charAt(4).toLowerCase() + key.slice(5);
			const raw = dataset[key];
			rules[ruleName] = raw === "" ? true : raw;
		});
		return rules;
	}
	_rulesFor(field) {
		const optionRules = this.options.rules && this.options.rules[field.name] || {};
		return Object.assign({}, this._rulesFromDataset(field), optionRules);
	}
	_messageFor(field, ruleName, param, methodDef) {
		const custom = this.options.messages && this.options.messages[field.name] && this.options.messages[field.name][ruleName];
		if (custom) return custom;
		const localeMessages = VanillaValidator.locales[this.lang];
		if (localeMessages && localeMessages[ruleName] !== void 0) {
			const localeMsg = localeMessages[ruleName];
			if (typeof localeMsg === "function") return localeMsg(param, field);
			return localeMsg;
		}
		if (this.lang !== "en" && VanillaValidator.locales["en"] && VanillaValidator.locales["en"][ruleName] !== void 0) {
			const enMsg = VanillaValidator.locales["en"][ruleName];
			if (typeof enMsg === "function") return enMsg(param, field);
			return enMsg;
		}
		const message = methodDef.message;
		if (typeof message === "function") return message(param, field);
		return message || "Please fix this field.";
	}
	_getClassList(field) {
		if (!field.classList) field.classList = createClassList();
		return field.classList;
	}
	showError(field, message) {
		this.errors[field.name] = message;
		this._getClassList(field).add(this.errorClass);
		if (field.setAttribute) {
			field.setAttribute("aria-invalid", "true");
			field.setAttribute("invalid", "true");
			field.setAttribute("data-jsv-message", message);
		} else {
			field["aria-invalid"] = "true";
			field["invalid"] = "true";
		}
		field._jsvMessage = message;
		this._showErrorElement(field, message);
	}
	clearError(field) {
		delete this.errors[field.name];
		this._getClassList(field).remove(this.errorClass);
		if (field.setAttribute) {
			field.setAttribute("aria-invalid", "false");
			field.removeAttribute("invalid");
			field.removeAttribute("data-jsv-message");
		} else {
			field["aria-invalid"] = "false";
			delete field["invalid"];
		}
		field._jsvMessage = "";
		this._removeErrorElement(field);
	}
	_showErrorElement(field, message) {
		if (!field.parentNode || typeof document === "undefined") return;
		this._removeErrorElement(field);
		const el = document.createElement(this.errorElement);
		el.className = this.errorElementClass;
		el.textContent = message;
		el.setAttribute("data-jsv-error-for", field.name);
		field.parentNode.insertBefore(el, field.nextSibling);
	}
	_removeErrorElement(field) {
		if (!field.parentNode) return;
		const existing = field.parentNode.querySelector(`[data-jsv-error-for="${field.name}"]`);
		if (existing) existing.parentNode.removeChild(existing);
	}
	element(field) {
		if (!field || !field.name) return true;
		const rules = this._rulesFor(field);
		const ruleNames = Object.keys(rules);
		for (let i = 0; i < ruleNames.length; i += 1) {
			const ruleName = ruleNames[i];
			const methodDef = VanillaValidator.methods[ruleName];
			if (!methodDef) continue;
			const param = rules[ruleName];
			if (param === false || param === "false") continue;
			if (!methodDef.validate(field.value, param, field, this)) {
				this.showError(field, this._messageFor(field, ruleName, param, methodDef));
				return false;
			}
		}
		this.clearError(field);
		return true;
	}
	validate() {
		let valid = true;
		this._elements().forEach((field) => {
			if (!this.element(field)) valid = false;
		});
		return valid;
	}
	resetForm() {
		this._elements().forEach((field) => {
			this.clearError(field);
		});
		this.errors = {};
	}
};
// src/locales.js
/**
* Localization messages for js-validation rules.
*
* Each locale lives in its own file under src/locales/<lang>.js.
* Add a new locale by creating src/locales/<lang>.js and re-exporting it here.
*/
var locales = {
	en: {
		required: "This field is required.",
		email: "Please enter a valid email address.",
		minlength: (param) => `Please enter at least ${param} characters.`,
		maxlength: (param) => `Please enter no more than ${param} characters.`,
		range: (param) => {
			try {
				const bounds = Array.isArray(param) ? param : JSON.parse(param);
				return `Please enter a value between ${bounds[0]} and ${bounds[1]}.`;
			} catch {
				return "Please enter a valid range.";
			}
		},
		pattern: "Please match the requested format.",
		equalTo: "Please enter the same value again.",
		notEqualTo: "Please enter a different value.",
		numeric: "Please enter only numeric values.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid ISO date (YYYY-MM-DD).",
		ipv4: "Please enter a valid IPv4 address.",
		ipv6: "Please enter a valid IPv6 address.",
		alpha: "Please enter only alphabetic letters.",
		alphanumeric: "Please enter only letters, numbers, and underscores.",
		maxfiles: (param) => `Please select no more than ${param} files.`,
		maxsize: (param) => `Please select files no larger than ${param}.`,
		maxsizetotal: (param) => `Total size of all files must not exceed ${param}.`,
		ishexcolor: "Please enter a valid hex color (e.g. #fff or #ffffff).",
		time: "Please enter a valid time (HH:MM or HH:MM:SS).",
		min: (param) => `Please enter a value greater than or equal to ${param}.`,
		max: (param) => `Please enter a value less than or equal to ${param}.`,
		step: (param) => `Please enter a multiple of ${param}.`,
		rangelength: (param) => {
			let bounds;
			try {
				bounds = Array.isArray(param) ? param : JSON.parse(param);
			} catch {
				bounds = String(param || "").split(",");
			}
			return `Please enter a value between ${bounds[0]} and ${bounds[1]} characters long.`;
		},
		digits: "Please enter only digits.",
		integer: "Please enter an integer.",
		number: "Please enter a valid number.",
		letters: "Please enter only letters.",
		notblank: "This field is required.",
		creditcard: "Please enter a valid credit card number.",
		creditcardExpiry: "Please enter a valid expiry date (MM/YY).",
		extension: (param) => `Please select a file with one of these extensions: ${String(param).replace(/\|/g, ", ")}.`,
		accept: (param) => `Please select a file with an accepted type: ${param}.`,
		domain: "Please enter a valid domain name.",
		url2: "Please enter a valid URL including http:// or https://.",
		phoneUS: "Please enter a valid US phone number.",
		dateBefore: (param) => `Please enter a date before ${param}.`,
		dateAfter: (param) => `Please enter a date after ${param}.`,
		require_from_group: (param) => {
			const count = Array.isArray(param) ? param[0] : String(param || "").split(",")[0];
			return `Please fill at least ${String(count).trim()} of these fields.`;
		},
		different: "Please enter a different value."
	},
	es: {
		required: "Este campo es obligatorio.",
		email: "Por favor ingrese una dirección de correo electrónico válida.",
		minlength: (param) => `Por favor ingrese al menos ${param} caracteres.`,
		maxlength: (param) => `Por favor ingrese no más de ${param} caracteres.`,
		range: (param) => {
			try {
				const bounds = Array.isArray(param) ? param : JSON.parse(param);
				return `Por favor ingrese un valor entre ${bounds[0]} y ${bounds[1]}.`;
			} catch {
				return "Por favor ingrese un rango válido.";
			}
		},
		pattern: "Por favor cumpla con el formato solicitado.",
		equalTo: "Por favor ingrese el mismo valor nuevamente.",
		notEqualTo: "Por favor ingrese un valor diferente.",
		numeric: "Por favor ingrese solo valores numéricos.",
		url: "Por favor ingrese una URL válida.",
		date: "Por favor ingrese una fecha válida.",
		dateISO: "Por favor ingrese una fecha ISO válida (AAAA-MM-DD).",
		ipv4: "Por favor ingrese una dirección IPv4 válida.",
		ipv6: "Por favor ingrese una dirección IPv6 válida.",
		alpha: "Por favor ingrese solo letras.",
		alphanumeric: "Por favor ingrese solo letras, números y guiones bajos.",
		maxfiles: (param) => `Por favor seleccione no más de ${param} archivos.`,
		maxsize: (param) => `Por favor seleccione archivos no mayores que ${param}.`,
		maxsizetotal: (param) => `El tamaño total de todos los archivos no debe exceder ${param}.`,
		ishexcolor: "Por favor ingrese un color hexadecimal válido (p. ej. #fff o #ffffff).",
		time: "Por favor ingrese una hora válida (HH:MM o HH:MM:SS).",
		min: (param) => `Por favor ingrese un valor mayor o igual a ${param}.`,
		max: (param) => `Por favor ingrese un valor menor o igual a ${param}.`,
		step: (param) => `Por favor ingrese un múltiplo de ${param}.`,
		rangelength: (param) => {
			let bounds;
			try {
				bounds = Array.isArray(param) ? param : JSON.parse(param);
			} catch {
				bounds = String(param || "").split(",");
			}
			return `Por favor ingrese un valor entre ${bounds[0]} y ${bounds[1]} caracteres.`;
		},
		digits: "Por favor ingrese solo dígitos.",
		integer: "Por favor ingrese un número entero.",
		number: "Por favor ingrese un número válido.",
		letters: "Por favor ingrese solo letras.",
		notblank: "Este campo es obligatorio.",
		creditcard: "Por favor ingrese un número de tarjeta de crédito válido.",
		creditcardExpiry: "Por favor ingrese una fecha de caducidad válida (MM/AA).",
		extension: (param) => `Por favor seleccione un archivo con una de estas extensiones: ${String(param).replace(/\|/g, ", ")}.`,
		accept: (param) => `Por favor seleccione un archivo con un tipo aceptado: ${param}.`,
		domain: "Por favor ingrese un nombre de dominio válido.",
		url2: "Por favor ingrese una URL válida que incluya http:// o https://.",
		phoneUS: "Por favor ingrese un número de teléfono de EE. UU. válido.",
		dateBefore: (param) => `Por favor ingrese una fecha anterior a ${param}.`,
		dateAfter: (param) => `Por favor ingrese una fecha posterior a ${param}.`,
		require_from_group: (param) => {
			const count = Array.isArray(param) ? param[0] : String(param || "").split(",")[0];
			return `Por favor complete al menos ${String(count).trim()} de estos campos.`;
		},
		different: "Por favor ingrese un valor diferente."
	}
};
// src/rules/required.js
VanillaValidator.addMethod("required", (value) => String(value || "").trim().length > 0, "This field is required.");
// src/rules/email.js
VanillaValidator.addMethod("email", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
}, "Please enter a valid email address.");
// src/rules/minlength.js
VanillaValidator.addMethod("minlength", (value, expected) => String(value || "").length >= Number(expected), (param) => `Please enter at least ${param} characters.`);
// src/rules/maxlength.js
VanillaValidator.addMethod("maxlength", (value, expected) => String(value || "").length <= Number(expected), (param) => `Please enter no more than ${param} characters.`);
// src/rules/range.js
VanillaValidator.addMethod("range", (value, param) => {
	try {
		const bounds = Array.isArray(param) ? param : JSON.parse(param);
		if (!Array.isArray(bounds) || bounds.length < 2) return false;
		const num = Number(value);
		if (String(value || "").trim() === "" || isNaN(num)) return false;
		return num >= Number(bounds[0]) && num <= Number(bounds[1]);
	} catch {
		return false;
	}
}, (param) => {
	try {
		const bounds = Array.isArray(param) ? param : JSON.parse(param);
		return `Please enter a value between ${bounds[0]} and ${bounds[1]}.`;
	} catch {
		return "Please enter a valid range.";
	}
});
// src/rules/pattern.js
VanillaValidator.addMethod("pattern", (value, expected) => {
	if (String(value || "").trim() === "") return false;
	return new RegExp(expected).test(String(value));
}, "Please match the requested format.");
// src/rules/equalTo.js
VanillaValidator.addMethod("equalTo", (value, selector, _field, validator) => {
	if (!validator.form || typeof validator.form.querySelector !== "function") return true;
	const target = validator.form.querySelector(selector);
	return !!target && String(value || "") === String(target.value || "");
}, "Please enter the same value again.");
// src/rules/notEqualTo.js
VanillaValidator.addMethod("notEqualTo", (value, selector, _field, validator) => {
	if (!validator.form || typeof validator.form.querySelector !== "function") return true;
	const target = validator.form.querySelector(selector);
	return !!target && String(value || "") !== String(target.value || "");
}, "Please enter a different value.");
// src/rules/numeric.js
VanillaValidator.addMethod("numeric", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^[0-9]+$/.test(String(value).trim());
}, "Please enter only numeric values.");
// src/rules/url.js
VanillaValidator.addMethod("url", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^(?:(?:(?:https?|ftp):)?\/\/)(?:(?:[^\]\[?\/<~#`!@$^&*()+=}|:";',>{ ]|%[0-9A-Fa-f]{2})+(?::(?:[^\]\[?\/<~#`!@$^&*()+=}|:";',>{ ]|%[0-9A-Fa-f]{2})*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(String(value));
}, "Please enter a valid URL.");
// src/rules/date.js
VanillaValidator.addMethod("date", (value) => !/Invalid|NaN/.test(new Date(value)), "Please enter a valid date.");
// src/rules/dateISO.js
VanillaValidator.addMethod("dateISO", (value) => /^\d{4}[\/\-]\d{2}[\/\-]\d{2}$/.test(String(value)), "Please enter a valid ISO date (YYYY-MM-DD).");
// src/rules/ipv4.js
VanillaValidator.addMethod("ipv4", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(String(value));
}, "Please enter a valid IPv4 address.");
// src/rules/ipv6.js
VanillaValidator.addMethod("ipv6", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(String(value));
}, "Please enter a valid IPv6 address.");
// src/rules/alpha.js
VanillaValidator.addMethod("alpha", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^[a-zA-Z]+$/i.test(String(value));
}, "Please enter only alphabetic letters.");
// src/rules/alphanumeric.js
VanillaValidator.addMethod("alphanumeric", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^\w+$/i.test(String(value));
}, "Please enter only letters, numbers, and underscores.");
// src/rules/maxfiles.js
VanillaValidator.addMethod("maxfiles", (_value, param, field) => {
	const limit = Number(param);
	if (!Number.isFinite(limit) || limit < 0) return false;
	return Array.from(field && field.files || []).length <= limit;
}, (param) => `Please select no more than ${param} files.`);
// src/rules/maxsize.js
function parseSize$1(param) {
	if (typeof param === "number") return param;
	const value = String(param || "").trim();
	if (/^\d+(?:\.\d+)?$/.test(value)) return Number(value);
	const match = value.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);
	if (!match) return NaN;
	return Number(match[1]) * {
		B: 1,
		KB: 1024,
		MB: 1048576,
		GB: 1073741824
	}[match[2].toUpperCase()];
}
VanillaValidator.addMethod("maxsize", (_value, param, field) => {
	const limit = parseSize$1(param);
	if (!Number.isFinite(limit) || limit < 0) return false;
	return Array.from(field && field.files || []).every((file) => Number(file && file.size) <= limit);
}, (param) => `Please select files no larger than ${param}.`);
// src/rules/maxsizetotal.js
function parseSize(param) {
	if (typeof param === "number") return param;
	const value = String(param || "").trim();
	if (/^\d+(?:\.\d+)?$/.test(value)) return Number(value);
	const match = value.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);
	if (!match) return NaN;
	return Number(match[1]) * {
		B: 1,
		KB: 1024,
		MB: 1048576,
		GB: 1073741824
	}[match[2].toUpperCase()];
}
VanillaValidator.addMethod("maxsizetotal", (_value, param, field) => {
	const limit = parseSize(param);
	if (!Number.isFinite(limit) || limit < 0) return false;
	return Array.from(field && field.files || []).reduce((sum, file) => sum + Number(file && file.size), 0) <= limit;
}, (param) => `Total size of all files must not exceed ${param}.`);
// src/rules/ishexcolor.js
VanillaValidator.addMethod("ishexcolor", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^#(?:[0-9a-f]{6}|[0-9a-f]{3})$/i.test(String(value));
}, "Please enter a valid hex color (e.g. #fff or #ffffff).");
// src/rules/time.js
VanillaValidator.addMethod("time", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^([01]\d|2[0-3]|[0-9])(:[0-5]\d){1,2}$/.test(String(value).trim());
}, "Please enter a valid time (HH:MM or HH:MM:SS).");
// src/rules/domain.js
var LABEL = "[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?";
VanillaValidator.addMethod("domain", (value) => {
	const domain = String(value || "").trim();
	if (domain === "" || domain.length > 253) return false;
	const labels = domain.split(".");
	return labels.length >= 2 && labels.every((label) => new RegExp(`^${LABEL}$`, "i").test(label)) && /^[a-z]{2,}$/i.test(labels[labels.length - 1]);
}, "Please enter a valid domain name.");
// src/rules/url2.js
VanillaValidator.addMethod("url2", (value) => {
	const str = String(value || "").trim();
	if (str === "") return false;
	let parsed;
	try {
		parsed = new URL(str);
	} catch {
		return false;
	}
	return /^https?:$/.test(parsed.protocol) && parsed.hostname.includes(".");
}, "Please enter a valid URL including http:// or https://.");
// src/rules/phoneUS.js
VanillaValidator.addMethod("phoneUS", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^\+?1?[\s.-]?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/.test(String(value).trim());
}, "Please enter a valid US phone number.");
// src/rules/dateBefore.js
function parseDate(value) {
	const str = String(value || "").trim();
	if (str === "") return null;
	const time = new Date(str).getTime();
	return isNaN(time) ? null : time;
}
function resolveDate(param, validator) {
	const raw = String(param || "").trim();
	if (!raw) return null;
	if (raw.toLowerCase() === "today") {
		const today = /* @__PURE__ */ new Date();
		today.setHours(0, 0, 0, 0);
		return today.getTime();
	}
	let target = null;
	if (validator && validator.form && typeof validator.form.querySelector === "function") try {
		target = validator.form.querySelector(raw);
	} catch {
		target = null;
	}
	return parseDate(target ? target.value : raw);
}
VanillaValidator.addMethod("dateBefore", (value, param, _field, validator) => {
	const date = parseDate(value);
	const limit = resolveDate(param, validator);
	return date !== null && limit !== null && date < limit;
}, (param) => `Please enter a date before ${param}.`);
// src/rules/dateAfter.js
VanillaValidator.addMethod("dateAfter", (value, param, _field, validator) => {
	const date = parseDate(value);
	const limit = resolveDate(param, validator);
	return date !== null && limit !== null && date > limit;
}, (param) => `Please enter a date after ${param}.`);
// src/rules/requireFromGroup.js
function parseGroup(param) {
	const raw = Array.isArray(param) ? param : String(param || "").split(",");
	const count = Number(String(raw[0]).trim());
	const selector = String(raw[1] || "").trim();
	return Number.isFinite(count) && count > 0 && selector ? [count, selector] : null;
}
VanillaValidator.addMethod("require_from_group", (_value, param, _field, validator) => {
	const group = parseGroup(param);
	if (!group) return false;
	const form = validator && validator.form;
	if (!form || typeof form.querySelectorAll !== "function") return true;
	return Array.from(form.querySelectorAll(group[1])).filter((el) => String(el && el.value || "").trim() !== "").length >= group[0];
}, (param) => {
	const group = parseGroup(param);
	return group ? `Please fill at least ${group[0]} of these fields.` : "Please fill the required number of fields in this group.";
});
// src/rules/different.js
VanillaValidator.addMethod("different", (value, selector, _field, validator) => {
	if (!validator.form || typeof validator.form.querySelector !== "function") return true;
	const target = validator.form.querySelector(selector);
	return !!target && String(value || "") !== String(target.value || "");
}, "Please enter a different value.");
// src/rules/creditcard.js
var CARDS = [
	{
		re: /^4/,
		lengths: [
			13,
			16,
			19
		]
	},
	{
		re: /^(5[1-5]|2(22[1-9]|2[3-9]\d|[3-6]\d\d|7[01]\d|720))/,
		lengths: [16]
	},
	{
		re: /^3[47]/,
		lengths: [15]
	},
	{
		re: /^6(011|5)/,
		lengths: [16, 19]
	},
	{
		re: /^35(2[89]|[3-8]\d)/,
		lengths: [16, 19]
	},
	{
		re: /^3(0[0-5]|[68]\d)/,
		lengths: [14]
	}
];
function luhn(digits) {
	let sum = 0;
	let double = false;
	for (let i = digits.length - 1; i >= 0; i -= 1) {
		let digit = Number(digits.charAt(i));
		if (double) {
			digit *= 2;
			if (digit > 9) digit -= 9;
		}
		sum += digit;
		double = !double;
	}
	return sum % 10 === 0;
}
VanillaValidator.addMethod("creditcard", (value) => {
	const digits = String(value || "").replace(/[\s-]/g, "");
	if (!/^\d+$/.test(digits)) return false;
	const card = CARDS.find((c) => c.re.test(digits));
	if (!card || !card.lengths.includes(digits.length)) return false;
	return luhn(digits);
}, "Please enter a valid credit card number.");
// src/rules/creditcardExpiry.js
VanillaValidator.addMethod("creditcardExpiry", (value) => {
	const match = /^(\d{2})\/(\d{2}|\d{4})$/.exec(String(value || "").trim());
	if (!match) return false;
	const month = Number(match[1]);
	if (month < 1 || month > 12) return false;
	const year = match[2].length === 2 ? 2e3 + Number(match[2]) : Number(match[2]);
	const now = /* @__PURE__ */ new Date();
	const current = now.getFullYear() * 12 + now.getMonth();
	return year * 12 + (month - 1) >= current;
}, "Please enter a valid expiry date (MM/YY).");
// src/rules/extension.js
function extensionOf(name) {
	const match = /\.([^.\\/]+)$/.exec(String(name || ""));
	return match ? match[1].toLowerCase() : "";
}
VanillaValidator.addMethod("extension", (value, param, field) => {
	const allowed = String(param || "").toLowerCase().split("|").map((ext) => ext.trim()).filter(Boolean);
	if (!allowed.length) return false;
	const files = Array.from(field && field.files || []);
	if (files.length) return files.every((file) => allowed.includes(extensionOf(file && file.name)));
	const text = String(value || "").trim();
	return text !== "" && allowed.includes(extensionOf(text));
}, (param) => `Please select a file with one of these extensions: ${String(param).replace(/\|/g, ", ")}.`);
// src/rules/accept.js
function matches(type, allowed) {
	return allowed.some((pattern) => pattern.endsWith("/*") ? type.startsWith(pattern.slice(0, -1)) : type === pattern);
}
VanillaValidator.addMethod("accept", (value, param, field) => {
	const allowed = String(param || "").toLowerCase().split(",").map((type) => type.trim()).filter(Boolean);
	if (!allowed.length) return false;
	const files = Array.from(field && field.files || []);
	if (files.length) return files.every((file) => matches(String(file && file.type || "").toLowerCase(), allowed));
	return String(value || "").trim() !== "";
}, (param) => `Please select a file with an accepted type: ${param}.`);
// src/rules/_helpers.js
/**
* Shared helpers for built-in rules. Not a rule file — do not import from index.js.
*/
function numericParam(param, field, ruleName) {
	if (param === true) {
		const raw = field && field.dataset && field.dataset[`rule${ruleName.charAt(0).toUpperCase()}${ruleName.slice(1)}`];
		return Number(raw);
	}
	return Number(param);
}
function decimalPlaces(num) {
	const str = String(num);
	const dot = str.indexOf(".");
	return dot === -1 ? 0 : str.length - dot - 1;
}
function parseBounds(param) {
	if (Array.isArray(param)) return param;
	const str = String(param || "").trim();
	if (str.startsWith("[")) try {
		const parsed = JSON.parse(str);
		return Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
	const parts = str.split(",").map((part) => Number(part.trim()));
	return parts.length === 2 && parts.every(Number.isFinite) ? parts : null;
}
// src/rules/min.js
VanillaValidator.addMethod("min", (value, param, field) => {
	if (String(value || "").trim() === "") return false;
	const num = Number(value);
	const limit = numericParam(param, field, "min");
	return Number.isFinite(num) && Number.isFinite(limit) && num >= limit;
}, (param) => `Please enter a value greater than or equal to ${param}.`);
// src/rules/max.js
VanillaValidator.addMethod("max", (value, param, field) => {
	if (String(value || "").trim() === "") return false;
	const num = Number(value);
	const limit = numericParam(param, field, "max");
	return Number.isFinite(num) && Number.isFinite(limit) && num <= limit;
}, (param) => `Please enter a value less than or equal to ${param}.`);
// src/rules/step.js
function findStep(step, value, base) {
	const factor = 10 ** Math.max(decimalPlaces(step), base % 1 === 0 ? 0 : decimalPlaces(base), decimalPlaces(value));
	const stepInt = Math.round(step * factor);
	const diff = Math.round(value * factor) - Math.round(base * factor);
	return stepInt > 0 && diff % stepInt === 0;
}
VanillaValidator.addMethod("step", (value, param, field) => {
	if (String(value || "").trim() === "") return false;
	const num = Number(value);
	const step = field && field.step !== void 0 && field.step !== "" && Number(field.step) > 0 ? Number(field.step) : Number(param);
	const base = field && field.min !== void 0 && field.min !== "" && Number.isFinite(Number(field.min)) ? Number(field.min) : 0;
	if (!Number.isFinite(num) || !Number.isFinite(step) || step <= 0) return false;
	return findStep(step, num, base);
}, (param) => `Please enter a multiple of ${param}.`);
// src/rules/rangelength.js
VanillaValidator.addMethod("rangelength", (value, param) => {
	const bounds = parseBounds(param);
	if (!bounds || bounds.length < 2) return false;
	const length = String(value || "").length;
	return length >= Number(bounds[0]) && length <= Number(bounds[1]);
}, (param) => {
	const bounds = parseBounds(param);
	return bounds ? `Please enter a value between ${bounds[0]} and ${bounds[1]} characters long.` : "Please enter a valid length range.";
});
// src/rules/digits.js
VanillaValidator.addMethod("digits", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^\d+$/.test(String(value).trim());
}, "Please enter only digits.");
// src/rules/integer.js
VanillaValidator.addMethod("integer", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^[+-]?\d+$/.test(String(value).trim());
}, "Please enter an integer.");
// src/rules/number.js
VanillaValidator.addMethod("number", (value) => {
	if (String(value || "").trim() === "") return false;
	return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(String(value).trim());
}, "Please enter a valid number.");
// src/rules/letters.js
var LETTERS_PATTERNS = {
	birthdate: /^[a-zA-Z\s.\-]+$/,
	id: /^[a-zA-Z\s.,'\-]+$/
};
VanillaValidator.addMethod("letters", (value, param) => {
	const str = String(value || "");
	if (str === "") return false;
	return (LETTERS_PATTERNS[param] || /^[a-zA-Z]+$/).test(str);
}, "Please enter only letters.");
// src/rules/notblank.js
VanillaValidator.addMethod("notblank", (value) => String(value == null ? "" : value).length > 0, "This field is required.");
// src/index.js
/**
* js-validation – full bundle (core + all built-in rules).
*
* Default import includes all rules. For selective imports:
*   import jsValidation from 'js-validation/core';
*   import 'js-validation/rules/required';
*   import 'js-validation/rules/email';
*/
Object.entries(locales).forEach(([lang, messages]) => {
	VanillaValidator.addLocaleMessages(lang, messages);
});
function jsValidation(formOrSelector, options = {}) {
	let form = formOrSelector;
	if (typeof formOrSelector === "string" && typeof document !== "undefined") form = document.querySelector(formOrSelector);
	return new VanillaValidator(form, options);
}
jsValidation.Validator = VanillaValidator;
jsValidation.addMethod = VanillaValidator.addMethod.bind(VanillaValidator);
jsValidation.addLocaleMessages = VanillaValidator.addLocaleMessages.bind(VanillaValidator);
export { VanillaValidator, jsValidation as default };
