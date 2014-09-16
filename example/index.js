"use strict";

var clayss = require("../lib/clayss");

var Vehicle = clayss(function (type) {
	this.type = type;
}).methods({
	setType: function (type) {
		this.type = type;
	},

	getType: function () {
		return this.type;
	},

	setMake: function (make) {
		this.make = make;
	},

	getMake: function () {
		return this.make;
	}
}).statics({
	category: "land"
});

var Car = Vehicle.extend(function (type) {
	this._super(type);

	this.type = type;
}).methods({
	getType: function (type) {
		return this._super(type);
	}
});

var Truck = Car.extend(function (type) {
	this._super(type);

	this.type = type;

	this.methods({
		getMake: function () {
			return this._super() + "!!!";
		}
	});
}).methods({
	setMake: function (make) {
		this._super(make);
	}
}).statics({
	color: "red"
});

var truck = new Truck("Pickup");

truck.setMake("Toyota");

console.log(truck.getMake());