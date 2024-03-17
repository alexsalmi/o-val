import Validator from "classes/validator.class.js";
import NumberRules from "rules/number.rules.js";

const VALID_RESPONSE = {
  valid: true,
  errors: {}
}

describe('----- Number Rule Tests -----', () => {
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

  test('isBetween: Pass', () => {
    let validator = new Validator({
      age1: ['number', 'isBetween=0,10'],
      age2: ['number', 'isBetween=0,10'],
      age3: ['number', 'isBetween=0,10']
    });

    let res = validator.validate({
      age1: 0,
      age2: 5,
      age3: 10,
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('isBetween: Fail', () => {
    let validator = new Validator({
      age1: ['number', 'isBetween=0,10'],
      age2: ['number', 'isBetween=0,10']
    });

    let res = validator.validate({
      age1: -1,
      age2: 11
    });
    let age1_error_message = NumberRules['isBetween'].getErrorMsg(0,10)('age1', -1);
    let age2_error_message = NumberRules['isBetween'].getErrorMsg(0,10)('age2', 10);

    expect(res).toEqual({
      valid: false,
      errors: {
        age1: [age1_error_message],
        age2: [age2_error_message]
      }
    });
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