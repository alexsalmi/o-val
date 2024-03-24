import Validator from "classes/validator.class.js";
import rules from "rules/index.js";

const NumberRules = rules['number'];

const VALID_RESPONSE = {
  valid: true,
  errors: {}
}

describe('Number Rule Tests', () => {
  test('Type Validation: Pass', () => {
    let validator = new Validator({
      age: 'number'
    });

    let res = validator.validate({
      age: 18
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('Type Validation: Fail', () => {
    let validator = new Validator({
      age: 'number'
    });

    let res = validator.validate({
      age: '18'
    });
    let error_message = NumberRules['number'].getErrorMsg()('age', '18');

    expect(res).toEqual({
      valid: false,
      errors: {
        age: [error_message]
      }
    });
  });

  test('minValue: Pass', () => {
    let validator = new Validator({
      age: ['number', 'minValue=18']
    });

    let res = validator.validate({
      age: 18
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('minValue: Fail', () => {
    let validator = new Validator({
      age: ['number', 'minValue=18']
    });

    let res = validator.validate({
      age: 17
    });
    let error_message = NumberRules['minValue'].getErrorMsg(18)('age', 17);

    expect(res).toEqual({
      valid: false,
      errors: {
        age: [error_message]
      }
    });
  });

	test('minValue: Invalid params', () => {
	  let fn = () => new Validator({
			age: ['number', 'minValue']
	  });
  
	  expect(fn).toThrow(`Rule 'minValue' requires a number as input`);
	});

  test('maxValue: Pass', () => {
    let validator = new Validator({
      age: ['number', 'maxValue=18']
    });

    let res = validator.validate({
      age: 18
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('maxValue: Fail', () => {
    let validator = new Validator({
      age: ['number', 'maxValue=18']
    });

    let res = validator.validate({
      age: 19
    });
    let error_message = NumberRules['maxValue'].getErrorMsg(18)('age', 19);

    expect(res).toEqual({
      valid: false,
      errors: {
        age: [error_message]
      }
    });
  });

	test('maxValue: Invalid params', () => {
	  let fn = () => new Validator({
			age: ['number', 'maxValue']
	  });
  
	  expect(fn).toThrow(`Rule 'maxValue' requires a number as input`);
	});

  test('between: Pass', () => {
    let validator = new Validator({
      age1: ['number', 'between=0,10'],
      age2: ['number', 'between=0,10'],
      age3: ['number', 'between=0,10']
    });

    let res = validator.validate({
      age1: 0,
      age2: 5,
      age3: 10,
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('between: Fail', () => {
    let validator = new Validator({
      age1: ['number', 'between=0,10'],
      age2: ['number', 'between=0,10']
    });

    let res = validator.validate({
      age1: -1,
      age2: 11
    });
    let age1_error_message = NumberRules['between'].getErrorMsg(0,10)('age1', -1);
    let age2_error_message = NumberRules['between'].getErrorMsg(0,10)('age2', 10);

    expect(res).toEqual({
      valid: false,
      errors: {
        age1: [age1_error_message],
        age2: [age2_error_message]
      }
    });
  });

	test('between: Invalid params', () => {
	  let fn1 = () => new Validator({
			age: ['number', 'between']
	  });
	  let fn2 = () => new Validator({
			age: ['number', 'between=1']
	  });
  
	  expect(fn1).toThrow(`Rule 'between' requires two numbers as input`);
	  expect(fn2).toThrow(`Rule 'between' requires two numbers as input`);
	});

  test('isInt: Pass', () => {
    let validator = new Validator({
      num1: ['number', 'isInt'],
      num2: ['number', 'isInt']
    });

    let res = validator.validate({
      num1: 10.0,
      num2: 0
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('isInt: Fail', () => {
    let validator = new Validator({
      num1: ['number', 'isInt'],
      num2: ['number', 'isInt']
    });

    let res = validator.validate({
      num1: 0.1,
      num2: 100.5
    });
    let num1_error_message = NumberRules['isInt'].getErrorMsg()('num1', 0.1);
    let num2_error_message = NumberRules['isInt'].getErrorMsg()('num2', 100.5);

    expect(res).toEqual({
      valid: false,
      errors: {
        num1: [num1_error_message],
        num2: [num2_error_message]
      }
    });
  });

  test('isDecimal: Pass', () => {
    let validator = new Validator({
      num1: ['number', 'isDecimal'],
      num2: ['number', 'isDecimal']
    });

    let res = validator.validate({
      num1: 0.01,
      num2: 5.6
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('isDecimal: Fail', () => {
    let validator = new Validator({
      num1: ['number', 'isDecimal'],
      num2: ['number', 'isDecimal']
    });

    let res = validator.validate({
      num1: 100.,
      num2: 5
    });
    let num1_error_message = NumberRules['isDecimal'].getErrorMsg()('num1', 100.);
    let num2_error_message = NumberRules['isDecimal'].getErrorMsg()('num2', 5);

    expect(res).toEqual({
      valid: false,
      errors: {
        num1: [num1_error_message],
        num2: [num2_error_message]
      }
    });
  });
})