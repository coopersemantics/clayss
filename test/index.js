"use strict";

var mocha = require("mocha");
var chai = require("chai");
var expect = chai.expect;
var clayss = require("../lib/clayss");

describe("clayss", function () {
	var Clayss;

	beforeEach(function () {
		Clayss = clayss(function (property, value) {
			this[property] = value;
		});
	});

	afterEach(function () {
		Clayss = null;
	});

	it("should have properties available on the constructor", function () {
		var clayssInstance = new Clayss("foo", "foo!");

		expect(clayssInstance.foo).to.be.a("string");
		expect(clayssInstance._super).to.be.an("undefined");
		expect(clayssInstance.methods).to.be.a("function");
		expect(clayssInstance.statics).to.be.a("function");
		expect(clayssInstance.extend).to.be.a("function");
	});

	describe("#methods()", function () {
		it("should add methods on the prototype", function () {
			var clayssInstance;

			Clayss.methods({
				a: function (value) {
					return value;
				},
				b: function () {
					this.methods({
						c: function (value) {
							return value;
						}
					});

					return this;
				}
			});

			clayssInstance = new Clayss("bar", "bar!");

			expect(clayssInstance.a("a")).to.equal("a");
			expect(clayssInstance.b().c("c")).to.equal("c");
		});
	});

	describe("#statics()", function () {
		it("should add statics on the constructor", function () {
			Clayss.statics({
				a: function (value) {
					return value;
				},
				b: function () {
					this.statics({
						c: function (value) {
							return value;
						}
					});

					return this;
				}
			});

			expect(Clayss.a("a")).to.equal("a");
			expect(Clayss.b().c("c")).to.equal("c");
		});
	});
	
	describe("subclassing", function () {
		var SubClayssA;
		var SubClayssB;

		beforeEach(function () {
			SubClayssA = Clayss.extend(function (property, value) {
				this._super(property, value);
			});

			SubClayssB = SubClayssA.extend(function (property, value) {
				this._super(property, value);
			});
		});

		afterEach(function () {
			SubClayssA = null;
			SubClayssB = null;
		});

		it("should inherit the super constructor", function () {
			var subClayssAInstance = new SubClayssA("baz", "baz!");
			var subClayssBInstance = new SubClayssB("boo", "boo!");

			expect(subClayssAInstance).to.have.property("baz", "baz!");
			expect(subClayssBInstance).to.have.property("boo", "boo!");
		});

		it("should inherit the super proto", function () {
			var subClayssAInstance;
			var subClayssBInstance;
			
			Clayss.methods({
				a: function (value) {
					return value;
				}
			});

			SubClayssA.methods({
				a: function (value) {
					return this._super(value) + "!";
				}
			});

			SubClayssB.methods({
				a: function (value) {
					return this._super(value) + "!";
				}
			});

			subClayssAInstance = new SubClayssA("baz", "baz!");
			subClayssBInstance = new SubClayssB("boo", "boo!");

			expect(subClayssAInstance.a("a")).to.equal("a!");
			expect(subClayssBInstance.a("a")).to.equal("a!!");
		});
	});
});