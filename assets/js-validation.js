(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.jsValidation = {}));
})(this, function(exports) {
	Object.defineProperties(exports, {
		__esModule: { value: true },
		[Symbol.toStringTag]: { value: "Module" }
	});
	//#region src/core.js
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
		static methods = {};
		static addMethod(name, validateFn, message) {
			VanillaValidator.methods[name] = {
				validate: validateFn,
				message: message || "Please fix this field."
			};
		}
		constructor(form, options = {}) {
			this.form = form;
			this.options = options;
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
			this._getClassList(field).add("jsv-invalid");
			if (field.setAttribute) {
				field.setAttribute("aria-invalid", "true");
				field.setAttribute("data-jsv-message", message);
			} else field["aria-invalid"] = "true";
			field._jsvMessage = message;
		}
		clearError(field) {
			delete this.errors[field.name];
			this._getClassList(field).remove("jsv-invalid");
			if (field.setAttribute) {
				field.setAttribute("aria-invalid", "false");
				field.removeAttribute("data-jsv-message");
			} else field["aria-invalid"] = "false";
			field._jsvMessage = "";
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
	//#endregion
	//#region src/rules/required.js
	VanillaValidator.addMethod("required", (value) => String(value || "").trim().length > 0, "This field is required.");
	//#endregion
	//#region src/rules/email.js
	VanillaValidator.addMethod("email", (value) => {
		if (String(value || "").trim() === "") return false;
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
	}, "Please enter a valid email address.");
	//#endregion
	//#region src/rules/minlength.js
	VanillaValidator.addMethod("minlength", (value, expected) => String(value || "").length >= Number(expected), (param) => `Please enter at least ${param} characters.`);
	//#endregion
	//#region src/rules/maxlength.js
	VanillaValidator.addMethod("maxlength", (value, expected) => String(value || "").length <= Number(expected), (param) => `Please enter no more than ${param} characters.`);
	//#endregion
	//#region src/rules/pattern.js
	VanillaValidator.addMethod("pattern", (value, expected) => {
		if (String(value || "").trim() === "") return false;
		return new RegExp(expected).test(String(value));
	}, "Please match the requested format.");
	//#endregion
	//#region src/rules/equalTo.js
	VanillaValidator.addMethod("equalTo", (value, selector, _field, validator) => {
		if (!validator.form || typeof validator.form.querySelector !== "function") return true;
		const target = validator.form.querySelector(selector);
		return !!target && String(value || "") === String(target.value || "");
	}, "Please enter the same value again.");
	//#endregion
	//#region src/rules/numeric.js
	VanillaValidator.addMethod("numeric", (value) => {
		if (String(value || "").trim() === "") return false;
		return /^[0-9]+$/.test(String(value).trim());
	}, "Please enter only numeric values.");
	//#endregion
	//#region src/index.js
	/**
	* js-validation – full bundle (core + all built-in rules).
	*
	* Default import includes all rules. For selective imports:
	*   import jsValidation from 'js-validation/core';
	*   import 'js-validation/rules/required';
	*   import 'js-validation/rules/email';
	*/
	function jsValidation(formOrSelector, options = {}) {
		let form = formOrSelector;
		if (typeof formOrSelector === "string" && typeof document !== "undefined") form = document.querySelector(formOrSelector);
		return new VanillaValidator(form, options);
	}
	jsValidation.Validator = VanillaValidator;
	jsValidation.addMethod = VanillaValidator.addMethod.bind(VanillaValidator);
	//#endregion
	exports.VanillaValidator = VanillaValidator;
	exports.default = jsValidation;
});
