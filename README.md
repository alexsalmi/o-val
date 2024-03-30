# O-Val Object Validation Library


[![NPM version][npm-image]][npm-url]
[![node version][node-image]][node-url]

[npm-image]: https://img.shields.io/npm/v/o-val.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@asalmi/o-val
[node-image]: https://img.shields.io/badge/node.js-%3E=_20-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

O-Val is a validation library for Javascript and Typescript. Can be used for any type of object validation, whether it be input validation in an Express.js app, or form validation in vanilla JS.

## Installation
```shell
npm i o-val
```

## Features
- Enforces all standard Javascript types, as well as extra types like email, phone number, and URL
- Ability to add your own custom types and rules
- Supports as many nested objects and arrays as you need
- Re-usable validator objects, to validate several objects with the same requirements
- Supports both CommonJS and ECMAScript modules

## Docs
### Object Validation
- [Validating an object](#validating-an-object)
- [Adding rules](#adding-rules)
- [Adding rules with parameters](#adding-rules-with-parameters)
- [Combining rules](#combining-rules)
- [Adding optional parameters](#adding-optional-parameters)
- [Validating nested objects](#validating-nested-objects)
- [Validating nested arrays](#validating-nested-arrays)
- [Strict mode validation](#strict-mode-validation)
### Custom Types and Rules
- [Adding custom types](#adding-custom-types)
- [Adding custom rules](#adding-custom-rules)
- [Adding custom rules with explicit parameters](#adding-custom-ruless-with-explicit-parameters)
- [Adding custom rules with any number of parameters](#adding-custom-rules-with-any-number-of-parameters)
- [Inheriting custom rules](#inheriting-custom-rules)
### Types and Rules
- [Base Type](#base-type)
- [String](#string)
- [Number](#number)
- [Boolean](#boolean)
- [Object](#object)
- [Array](#array)
- [Email](#email)
- [Phone](#phone)
- [Date](#date)
- [URL](#url)


## Object Validation
### Validating an object
When creating a new Validator, you must pass an object outlining the types and rules for each key. If you only need to specify the type without enforcing any other rules, you can simply pass the type as a string. 

To validate an object using your Validator, call the 'validate' method, passing the object you'd like to validate.
##### Success Example:
```javascript
const Validator from 'o-val';

const v = new Validator({
	name: 'string',
	age: 'number'
});

const res = v.validate({
	name: 'Alvin',
	age: 23
});

console.log(res);
```
##### Output:
```terminal
{ 
  valid: true, 
  errors: {} 
}
```
##### Error Example:
```javascript
const Validator from 'o-val';

const v = new Validator({
	name: 'string',
	age: 'number'
});

const res = v.validate({
	name: 'Alvin',
	age: '23'
});

console.log(res);
```
##### Output:
```terminal
{ 
  valid: false, 
  errors: { 
    age: [ "'age' must be of type 'number'" ] 
  } 
}
```
---
### Adding rules
If you are adding any further rules other than specifying the type, you must pass all requirements as an array of strings.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'isAlpha'],
	age: ['number', 'isInt']
});

const res = v.validate({
	name: 'Alvin',
	age: 18.5
});

console.log(res);
```
##### Output:
```terminal
{ 
  valid: false, 
  errors: { 
    age: [ "'age' must be an integer" ] 
  } 
}
```
---
### Adding rules with parameters
Some rules will require you to pass parameters to compare the validated object's values to. To pass parameters, append an equals sign and a comma separated list of parameters after the rule name.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'minLength=3'],
	age: ['number', 'between=1,18']
});

const res = v.validate({
	name: 'Alvin',
	age: 19
});

console.log(res);
```
##### Output:
```terminal
{ 
  valid: false, 
  errors: { 
    age: [ "'age' must be between 1 and 18" ] 
  } 
}
```
---
### Combining rules
You can provide any number of rules to a field, as long as the rules exist for the specified type for that field. Simply add as many rules as required to the rule array.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'isAlpha', 'minLength=1'],
	age: ['number', 'isInt', 'between=1,18']
});

const res = v.validate({
	name: 'Alvin',
	age: 19.5
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    age: [ 
      "'age' must be an integer", 
      "'age' must be between 1 and 18"
    ]
  }
}
```
---
### Adding optional parameters
Values are set to required by default, but you can explicitly specify this using the 'required' rule as well. On the flip side, if you'd like to set a rule to be optional, you can use the 'optional' rule. 

If a field is required and is not present in the validated object, an error will be thrown. If a field is optional and is not present in the validated object, no error will be thrown and the rest of the rules for that field will be skipped. 
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'required'],
	age: ['number', 'optional']
});

const res = v.validate({});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    name: [ "'name' is required" ] 
  }
}
```
---
### Validating nested objects
When validating nested objects and arrays, the specifications for the children must be passed as the last element of the rule array.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['object', {
		first: ['string', 'minLength=7'],
		last: ['string', 'minLength=7']
	}]
});

const res = v.validate({
	name: {
		first: 'Alvin',
		last: 'Chipmunk'
	}
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    'name.first': [ "'name.first' must be at least 7 characters long" ]
  }
}
```
---
### Validating nested arrays
When validating arrays, you can specify rules for its elements in a number of ways:
- Specify rules for all elements of the array with the key '*'
- Specify riules for a specific range of elements with a range as the key: '[0,1]'
- Specify a single element with the element's index as the key: '[1]'
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	arr: ['array', {
		'*': ['string'],
		'[0,1]': ['string', 'maxLength=5'],
		'[1]': ['string', 'isAlpha']
	}]
});

const res = v.validate({
	arr: ['test123', 'test1']
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    arr: [
      "'arr[0]' must be at most 5 characters long",
      "'arr[1]' must only contain alphabetical characters"
    ]
  }
}
```
---
### Strict mode validation
Enabling strict mode in a Validator will require the object being validated to match the Validator exactly. This includes:
- Any keys included in the object that are not included in the specifications will throw an error
- Any arrays must be the exact length covered by the array's element rules, and may not contain any elements past this defined range.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: 'string',
	arr1: ['array', {
		'[0,2]': 'string'
	}]
});

const res1 = v.validate({
	name: 'Alvin',
	arr1: ['This', 'is', 'an', 'example'],
	extra: 'Dave'
});

console.log('res1:', res1);

// Enable strict mode
v.strict = true;

const res2 = v.validate({
	name: 'Alvin',
	arr1: ['This', 'is', 'an', 'example'],
	extra: 'Dave'
});

console.log('res2:', res2);

```
##### Output:
```terminal
res1: { 
  valid: true, 
  errors: {} 
}

res2: {
  valid: false,
  errors: {
    arr1: [
      "Array at key 'arr1' contains more elements than defined in the specs"
    ],
    extra: [ "Key 'extra' is not included in the specs" ]
  }
}
```

## Custom Types and Rules
You can also import the OValConfig object to customize o-val to your needs. This includes the ability to add custom types that may not be covered by the build in types o-val provides, as well as adding new rules to both your custom types and the existing built in types.

### Adding custom types
You can create a custom type using the addType method in the OValConfig object. This method contains three parameters:
- Name: The name you want to give your new type
- Fn: The function that validates whether a value matches your new type. Should accept one parameter of any type, and return a boolean (true if the value matches your type, false if not)
- Proto (optional): The type which your custom type should inherit from. For example, if you pass 'string' as the proto, all of the string rules will also be made available for your new custom type. If this parameter is not provided, the default proto will be the Base type containing all of the base rules.
##### Example:
```javascript
import Validator, { OValConfig } from 'o-val';

OValConfig.addType('comment',
	(value) => {
		return value.startsWith('//');
	},
	'string'
);

const v = new Validator({
	comment1: 'comment',
	// Length minLength rule inherited from string type
	comment2: ['comment', 'minLength=12'],
	comment3: ['comment', 'minLength=12'] 
});

const res = v.validate({
	comment1: 'not a comment',
	comment2: '//tooshort',
	comment3: '// valid comment'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    comment1: [ "'comment1' must be of type 'comment'" ],
    comment2: [ "'comment2' must be at least 12 characters long" ]
  }
}
```
---
### Adding custom rules
You can create a custom rule using the addRule method in the OValConfig object. You can add rules to both built in types and custom types. Adding a new rule to a type will also add the rule for all the types that inherit off of it. This method contains four parameters:
- Type: The type your new rule will apply for
- Name: The name you want to give your new rule
- Fn: The function that validates whether a value matches your new rule. Needs to be a nested function. The outer function will take any parameters required when defining a new Validator with this rule (no parameters if none are required). The inner function should accept one parameter of any type, and return a boolean (true if the value passes your rule, false if not)
- Error message: The error message that should be returned if the rule fails. You can include a couple of replacements in the error message, and they will be replaced with the key, value, or arguments as needed:
	- {key}: Will be replaced with the key of the value that failed the rule
	- {value}: Will be replaced with the value that failed the rule
	- {arg0}, {arg1}, etc: Will be replaced with the specific argument passed for the rule
	- {args}: Will be replaced with all the arguments passed for the rule, comma separated
##### Example:
```javascript
import Validator, { OValConfig } from 'o-val';

OValConfig.addRule('string', 'hasX',
	() => {
		return (value) => {
			return value.toLowerCase().includes('x');
		}
	},
	`Key '{key}' with value {value} has no X`
);

const v = new Validator({
	name: ['string', 'hasX'],
});

const res = v.validate({
	name: 'Alvin'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: { 
    name: [ 'Key 'name' with value Alvin has no X' ] 
  }
}
```
---
### Adding custom rules with explicit parameters
To create a rule with explicit parameters, pass the parameters in the outer rule function.
##### Example:
```javascript
import Validator, { OValConfig } from 'o-val';

OValConfig.addRule('string', 'hasChars',
	(char1, char2) => {
		return (value) => {
			return value.toLowerCase().includes(char1)
				|| value.toLowerCase().includes(char2);
		}
	},
	`Key '{key}' with value {value} has neither char {arg0} nor {arg1}`
);

const v = new Validator({
	name: ['string', 'hasChars=z,1'],
});

const res = v.validate({
	name: 'Alvin'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: { 
    name: [ "Key 'name' with value Alvin has neither char z nor 1" ] 
  }
}
```
---
### Adding custom rules with any number of parameters
To create a rule with an undefined number parameters, pass the parameters in the outer rule function as ...args.
##### Example:
```javascript
import Validator, { OValConfig } from 'o-val';

OValConfig.addRule('string', 'isOneOf',
	(...args) => {
		return (value) => {
			return args.includes(value);
		}
	},
	`Key '{key}' with value {value} is none of {args}`
);

const v = new Validator({
	name: ['string', 'isOneOf=z,1,#,!'],
});

const res = v.validate({
	name: 'Alvin'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: { 
    name: [ "Key 'name' with value Alvin is none of z, 1, #, !" ]
  }
}
```
---
### Inheriting custom rules
Adding rule to a parent type will also make that new rule available to any types that inherit off of
##### Example:
```javascript
import Validator, { OValConfig } from 'o-val';

OValConfig.addType('comment',
	(value) => {
		return value.startsWith('//');
	},
	'string'
);

OValConfig.addRule('string', 'hasX',
	() => {
		return (value) => {
			return value.toLowerCase().includes('x');
		}
	},
	`Key '{key}' with value {value} has no X`
);

const v = new Validator({
	name: ['string', 'hasX'],
	comment: ['comment', 'hasX']
});

const res = v.validate({
	name: 'Alvin',
	comment: '// Comment',
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    name: [ "'name' must be of type 'comment'" ],
    comment: [ "Key 'comment' with value // Comment has no X" ]
  }
}
```

## Types and Rules

### Base Type
The base type is unaccessible, and cannot be used when defining a Validator. Instead, it is the type that all other types inherit off of, and the rules listed below are accessible by all other types.

#### <u>Required</u>
Sets a field as required. If the field is not present, an error gets thrown. Set by default, adding it to your rule arrays is not necessary.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'required']
});

const res = v.validate({});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    name: [ "'name' is required" ]
  }
}
```
#### <u>Optional</u>
Sets a field as optional. If the field is not present, no error is thrown and the rest of the rules for this field are not enforced.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'optional']
});

const res = v.validate({});

console.log(res);
```
##### Output:
```terminal
{
  valid: true,
  errors: {}
}
```
#### <u>isIn</u>
Checks to see if the value is one of a list of options.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'isIn=Alvin,Simon,Theodore']
});

const res = v.validate({
	name: 'Dave'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: { 
    name: [ "'name' must be one of [Alvin, Simon, Theodore]" ] 
  }
}
```
---

### String
String type

#### <u>string</u>
String's type rule. Checks if the given value's typeof is 'string'.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: 'string'
});

const res = v.validate({
	name: 0
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    name: [ "'name' must be of type 'string'" ]
  }
}
```
#### <u>isEmpty</u>
Checks if the string is empty.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'isEmpty']
});

const res = v.validate({
	name: 'Alvin'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    name: [ "'name' must be an empty string" ]
  }
}
```
#### <u>minLength</u>
Checks if the string is at least a certain length. Takes one number as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'minLength=6']
});

const res = v.validate({
	name: 'Alvin'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    name: [ "'name' must be at least 6 characters long" ]
  }
}
```
#### <u>maxLength</u>
Checks if the string is no more than a certain length. Takes one number as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'maxLength=4']
});

const res = v.validate({
	name: 'Alvin'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    name: [ "'name' must be at most 4 characters long" ]
  }
}
```
#### <u>matches</u>
Checks if the string matches a given Regex string. Takes one Regex string as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'matches=[0-9]+']
});

const res = v.validate({
	name: 'Alvin'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    name: [ "'name' must match the format [0-9]+" ]
  }
}
```
#### <u>isNumeric</u>
Checks if the string only contains numeric characters.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	ageStr: ['string', 'isNumeric'],
	ageStr2: ['string', 'isNumeric']
});

const res = v.validate({
	ageStr: '123',
	ageStr2: 'abc'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    ageStr2: [ "'ageStr2' must be numeric" ]
  }
}
```
#### <u>isAlphaNumeric</u>
Checks if the string only contains alphanumeric characters.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'isAlphaNumeric'],
	name2: ['string', 'isAlphaNumeric']
});

const res = v.validate({
	name: 'Alvin1',
	name2: 'Alvin_2'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    name2: [ "'name2' must be alphanumeric" ]
  }
}
```
#### <u>isAlpha</u>
Checks if the string only contains alphabetical characters.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'isAlpha']
});

const res = v.validate({
	name: 'Alvin1'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    name: [ "'name2' must only contain alphabetical characters" ]
  }
}
```
#### <u>isUpperCase</u>
Checks if the string only contains uppercase characters.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'isUpperCase']
});

const res = v.validate({
	name: 'Alvin'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    name: [ "'name' must only contain uppercase characters" ]
  }
}
```
#### <u>isLowerCase</u>
Checks if the string only contains lowercase characters.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	name: ['string', 'isLowerCase']
});

const res = v.validate({
	name: 'Alvin'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    name: [ "'name' must only contain lowercase characters" ]
  }
}
```
---

### Number
Number type

#### <u>number</u>
Number's type rule. Checks if the given value's typeof is 'number'.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	age: 'number'
});

const res = v.validate({
	age: 'Alvin'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    age: [ "'age' must be of type 'number'" ]
  }
}
```
#### <u>minValue</u>
Checks if the number is greater than or equal to a given value. Takes one number as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	age: ['number', 'minValue=5']
});

const res = v.validate({
	age: 4
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    age: [ "'age' must be 5 or greater" ]
  }
}
```
#### <u>maxValue</u>
Checks if the number is less than or equal to a given value. Takes one number as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	age: ['number', 'maxValue=5']
});

const res = v.validate({
	age: 6
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    age: [ "'age' must be 5 or less" ]
  }
}
```
#### <u>between</u>
Checks if the number is between two given values. Takes two numbers as parameters.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	age: ['number', 'between=5,10']
});

const res = v.validate({
	age: 4
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    age: [ "'age' must be between 5 and 10" ]
  }
}
```
#### <u>isInt</u>
Checks if the number is an integer.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	age: ['number', 'isInt']
});

const res = v.validate({
	age: 14.5
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    age: [ "'age' must be an integer" ]
  }
}
```
#### <u>isDecimal</u>
Checks if the number is an decimal value.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	age: ['number', 'isDecimal']
});

const res = v.validate({
	age: 14
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    age: [ "'age' must be a decimal" ]
  }
}
```
---

### Boolean
Boolean type

#### <u>boolean</u>
Boolean's type rule. Checks if the given value's typeof is 'boolean'.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	isRegistered: 'boolean'
});

const res = v.validate({
	isRegistered: 'Alvin'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    isRegistered: [ "'isRegistered' must be a boolean'" ]
  }
}
```
#### <u>isTrue</u>
Checks if the boolean is true.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	isRegistered: ['boolean', 'isTrue']
});

const res = v.validate({
	isRegistered: false
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    isRegistered: [ "'isRegistered' must be 'true'" ]
  }
}
```
#### <u>isFalse</u>
Checks if the boolean is false.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	isRegistered: ['boolean', 'isFalse']
});

const res = v.validate({
	isRegistered: true
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    isRegistered: [ "'isRegistered' must be 'false'" ]
  }
}
```
---

### Object
Object type

#### <u>object</u>
Object's type rule. Checks if the given value's typeof is 'object'.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	values: ['object', {
		name: 'string'
	}]
});

const res = v.validate({
	values: 'Alvin'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    values: [ "'values' must be an object" ]
  }
}
```
#### <u>notEmpty</u>
Checks if the object has values.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	values: ['object', 'notEmpty', {
		name: 'string'
	}]
});

const res = v.validate({
	values: {}
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    values: [ "'values' must not be an empty object" ]
  }
}
```
---

### Array
Array type

#### <u>array</u>
Array's type rule. Checks if the given value is a Javascript Array.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	values: ['array', {
		'[*]': 'number'
	}]
});

const res = v.validate({
	values: 1
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    values: [ "'values' must be an array" ]
  }
}
```
#### <u>notEmpty</u>
Checks if the array has values.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	values: ['array', 'notEmpty', {
		'[*]': 'number'
	}]
});

const res = v.validate({
	values: []
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    values: [ "'values' must not be an empty array" ]
  }
}
```
#### <u>minLength</u>
Checks if the array has at least a given number of values. Takes one number as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	values: ['array', 'minLength=3', {
		'[*]': 'number'
	}]
});

const res = v.validate({
	values: [1,2]
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    values: [ "'values' must contain at least 3 elements" ]
  }
}
```
#### <u>maxLength</u>
Checks if the array has at most a given number of values. Takes one number as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	values: ['array', 'maxLength=3', {
		'[*]': 'number'
	}]
});

const res = v.validate({
	values: [1,2,3,4]
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    values: [ "'values' must not contain more than 3 elements" ]
  }
}
```
#### <u>exactLength</u>
Checks if the array has exactly a given number of values. Takes one number as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	values: ['array', 'exactLength=3', {
		'[*]': 'number'
	}]
});

const res = v.validate({
	values: [1,2]
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    values: [ "'values' must contain exactly 3 elements" ]
  }
}
```
---

### Email
Email type. Inherits from the String type, meaning all of [String's](#string) rules can also be used for Email type values.

#### <u>email</u>
Email's type rule. Checks if the given value is string in the format of an email address.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	email: 'email'
});

const res = v.validate({
	email: 'abc'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    email: [ "'email' must be a valid email address" ]
  }
}
```
#### <u>hasDomain</u>
Checks if the email has a given domain. Takes one string as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	email: ['email','hasDomain=asalmi.com'],
	email2: ['email','hasDomain=asalmi.com']
});

const res = v.validate({
	email: 'abc@asalmi.com',
	email2: 'abc@gmail.com'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    email2: [ "'email2' must be an email address on the domain 'asalmi.com'" ]
  }
}
```
---

### Phone
Phone type. Inherits from the String type, meaning all of [String's](#string) rules can also be used for Phone type values.

#### <u>phone</u>
Phone's type rule. Checks if the given value is string in the format of a phone number.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	phone: 'phone'
});

const res = v.validate({
	phone: '()123'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    phone: [ "'phone' must be a valid phone number" ]
  }
}
```
#### <u>hasCountryCode</u>
Checks if the phone number contains a given country code. Takes one string as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	phone: ['phone', 'hasCountryCode=+1'],
	phone2: ['phone', 'hasCountryCode=+1'],
	phone3: ['phone', 'hasCountryCode=+1']
});

const res = v.validate({
	phone: '+1 (123)456-7890',
	phone2: '+11234567890',
	phone3: '+2 1234567890',
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    phone3: [ "'phone3' must have country code '+1'" ]
  }
}
```
---

### Date
Date type. Inherits from the String type, meaning all of [String's](#string) rules can also be used for Date type values.

#### <u>date</u>
Date's type rule. Checks if the given value is string in the format of a date, and is a valid date.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	DOB: 'date',
	DOB2: 'date',
});

const res = v.validate({
	DOB: '31/31/2000',
	DOB2: '0-0-2000'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    DOB: [ "'DOB' must be a valid date" ],
    DOB2: [ "'DOB2' must be a valid date" ]
  }
}
```
#### <u>before</u>
Checks if the date is before a given date. Takes one string as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	DOB: ['date', 'before=01/01/2000']
});

const res = v.validate({
	DOB: '01/01/2000'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    DOB: [ "'DOB' must be a date before 01/01/2000" ]
  }
}
```
#### <u>after</u>
Checks if the date is after a given date. Takes one string as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	DOB: ['date', 'after=01/01/2000']
});

const res = v.validate({
	DOB: '01/01/2000'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    DOB: [ "'DOB' must be a date after 01/01/2000" ]
  }
}
```
#### <u>between</u>
Checks if the date is between two given dates. Takes two strings as parameters.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	DOB: ['date', 'between=01/01/2000,12/31/2000']
});

const res = v.validate({
	DOB: '01/01/2000'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    DOB: [ "'DOB' must be a date between 01/01/2000 and 12/31/2000" ]
  }
}
```
#### <u>exactDate</u>
Checks if the date is the same as a given date. Takes one string as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	DOB: ['date', 'exactDate=01/01/2000']
});

const res = v.validate({
	DOB: '01/02/2000'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    DOB: [ "'DOB' must be 01/01/2000" ]
  }
}
```
#### <u>inYear</u>
Checks if the date is in a given year. Takes one string as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	DOB: ['date', 'inYear=2000']
});

const res = v.validate({
	DOB: '01/01/2001'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    DOB: [ "'DOB' must be in the year 2000" ]
  }
}
```
#### <u>inMonth</u>
Checks if the date is in a given month. Takes one string as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	DOB: ['date', 'inMonth=1']
});

const res = v.validate({
	DOB: '02/01/2001'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    DOB: [ "'DOB' must be in the month 1'" ]
  }
}
```
---

### URL
URL type. Inherits from the String type, meaning all of [String's](#string) rules can also be used for URL type values.

#### <u>url</u>
URL's type rule. Checks if the given value is string in the format of a URL.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	homepage: 'url'
});

const res = v.validate({
	homepage: 'asalmi'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    homepage: [ "'homepage' must be a valid URL" ]
  }
}
```
#### <u>hasDomain</u>
Checks if the URL has a given domain. Takes one string as a parameter.
##### Example:
```javascript
import Validator from 'o-val';

const v = new Validator({
	homepage: ['url', 'hasDomain=asalmi.com'],
	homepage2: ['url', 'hasDomain=asalmi.com']
});

const res = v.validate({
	homepage: 'https://www.asalmi.com',
	homepage2: 'https://www.google.com'
});

console.log(res);
```
##### Output:
```terminal
{
  valid: false,
  errors: {
    homepage2: [ "'homepage2' must be a URL with the domain 'asalmi.com'" ]
  }
}
```
---