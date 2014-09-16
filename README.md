# Clayss

A module for constructing classes in node.js and the browser.

## Example Usage

```
var clayss = require("clayss");
```

### Class

```js
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
```

### Subclassing

```js
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

truck.getMake();
```

## API

### .extend(subclass)

Extends `superclass` with `subclass`.

Type: (`subclass {function}`)

### .methods(mixins)

Adds mixin methods on prototype.

Type: (`mixins {object}`)

### .statics(mixins)

Adds mixin properties (static) on constructor.

Type: (`mixins {object}`)

## Gulp Tasks

```bash
# JSHint
$ gulp lint

# Unit Tests
$ gulp test

# Compile Client Code
$ gulp dist

# JSHint, Unit Tests and Compile Client Code
$ gulp build

# Watch (Default)
$ gulp watch
```

## Versioning

Releases will be numbered using the following format:

```
<major>.<minor>.<patch>
```

And constructed with the following guidelines:

- Breaking backward compatibility **bumps the major** while resetting minor and patch.
- New additions without breaking backward compatibility **bumps the minor** while resetting the patch.
- Bug fixes and misc. changes **bumps only the patch**.

For more information on SemVer, please visit <http://semver.org/>.

## License

[MIT License](https://github.com/coopersemantics/clayss/blob/master/MIT-LICENSE.txt).