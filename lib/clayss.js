"use strict";

/**
 * @param {function} subclass
 * @returns {function}
 * @public
 */

module.exports = function clayss(subclass) {
	return augment(subclass);
};

/**
 * Augments `subclass` with `superclass`.
 * @param {function} subclass
 * @param {function} superclass
 * @returns {function}
 * @private
 */

var augment = function augment(subclass, superclass) {
	superclass = superclass || function () {};
	subclass = wrap(subclass, superclass);

	extend(subclass, clayssMixin);
	subclass.prototype = Object.create(superclass.prototype);
	extend(subclass.prototype, clayssMixin);
	subclass.prototype.constructor = subclass;

	return subclass;
};

/**
 * Copies all properties from `source` to `destination`.
 * @param {object|function} destination
 * @param {object|function} source
 * @returns {object|function}
 */

var extend = function extend(destination, source) {
	var property;

	for (property in source) {
		if (isOwnProperty(source, property)) {
			destination[property] = source[property];
		}
	}

	return destination;
};

/**
 * Wraps `_super` in a newly created method.
 * @param {function} subclassOrMixin
 * @param {function} _super
 * @returns {function}
 */

var wrap = function wrap(subclassOrMixin, _super) {
	return function () {
		var that = this;
		var temporary = that._super;
		var subclassOrMixinAsReturned;

		that._super = _super;

		try {
			subclassOrMixinAsReturned = subclassOrMixin.apply(that, arguments);
		} finally {
			that._super = temporary;
		}

		return subclassOrMixinAsReturned;
	};
};

/**
 * Determines if a given `_super` method is a valid `_super` match.
 * @param {function} mixin
 * @param {function} protoValue
 * @returns {boolean}
 */

var isSuper = function isSuper(mixin, protoValue) {
	return "function" === typeof mixin &&
		"function" === typeof protoValue &&
		/\b_super\b/.test(mixin);
};

/**
 * @param {object} object
 * @param {string} property
 * @returns {boolean}
 */

var isOwnProperty = function isOwnProperty(object, property) {
	return Object.prototype.hasOwnProperty.call(object, property);
};

/**
 * @private
 */

var clayssMixin = {

	/**
	 * Adds mixin methods on prototype.
	 * @param {object} mixins
	 * @returns {function|object}
	 */

	methods: function (mixins) {
		var that = this;
		var proto = that.prototype || that.constructor.prototype;
		var property;

		for (property in mixins) {
			if (isOwnProperty(mixins, property)) {
				proto[property] = !isSuper(mixins[property], proto[property]) ?
					mixins[property] :
					wrap(mixins[property], proto[property]);
			}
		}

		return that;
	},

	/**
	 * Adds mixin properties (static) on constructor.
	 * @param {object} mixins
	 * @returns {function|object}
	 */

	statics: function (mixins) {
		var that = this;

		extend(that.prototype && that.prototype.constructor || that.constructor, mixins);

		return that;
	},

	/**
	 * Extends `superclass` with `subclass`.
	 * @param {function} subclass
	 * @returns {function}
	 */

	extend: function (subclass) {
		if ("function" !== typeof subclass || "function" !== typeof this) {
			return console.error("`.extend` should not be used within a class.");
		}

		return augment(subclass, this);
	}
};