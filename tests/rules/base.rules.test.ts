import Validator from "../../src/classes/validator.class.js";
import BaseRules from "../../src/rules/base.rules.js";

const VALID_RESPONSE = {
  valid: true,
  errors: {}
}

describe('----- Base Rule Tests -----', () => {
  test('Required: Pass when valid value is passed', () => {
    let validator = new Validator({
      name: 'string'
    });

    let res = validator.validate({
      name: 'Alvin'
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('Required: Error if param is undefined', () => {
    let validator = new Validator({
      name: ['string', 'isIn=Alvin']
    });

    let res = validator.validate({});
    let error_message = BaseRules['required'].getErrorMsg()('name');

    expect(res).toEqual({
      valid: false,
      errors: {
        name: [error_message]
      }
    });
  });

  test('Required: Error if param is null', () => {
    let validator = new Validator({
      name: ['string', 'isIn=Alvin']
    });

    let res = validator.validate({
      name: null
    });
    let error_message = BaseRules['required'].getErrorMsg()('name');

    expect(res).toEqual({
      valid: false,
      errors: {
        name: [error_message]
      }
    });
  });

  test('Required: Rules are enforced if param is empty', () => {
    let validator = new Validator({
      name: ['string', 'isIn=Alvin']
    });

    let res = validator.validate({
      name: ''
    });
    let error_message = BaseRules['isIn'].getErrorMsg('Alvin')('name', '');

    expect(res).toEqual({
      valid: false,
      errors: {
        name: [error_message]
      }
    });
  });

  test('Required: Rules are enforced if param is zero', () => {
    let validator = new Validator({
      age: ['number', 'isIn=1']
    });

    let res = validator.validate({
      age: 0
    });
    let error_message = BaseRules['isIn'].getErrorMsg(1)('age', 0);

    expect(res).toEqual({
      valid: false,
      errors: {
        age: [error_message]
      }
    });
  });

  test('Optional: Rules get skipped if param is undefined', () => {
    let validator = new Validator({
      name: ['string', 'optional', 'isIn=Alvin']
    });

    let res = validator.validate({});

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('Optional: Rules get skipped if param is null', () => {
    let validator = new Validator({
      name: ['string', 'optional', 'isIn=Alvin']
    });

    let res = validator.validate({
      name: null
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('Optional: Rules are enforced if param is empty', () => {
    let validator = new Validator({
      name: ['string', 'optional', 'isIn=Alvin']
    });

    let res = validator.validate({
      name: ''
    });
    let error_message = BaseRules['isIn'].getErrorMsg('Alvin')('name', '');

    expect(res).toEqual({
      valid: false,
      errors: {
        name: [error_message]
      }
    });
  });

  test('Optional: Rules are enforced if param is zero', () => {
    let validator = new Validator({
      age: ['number', 'optional', 'isIn=1']
    });

    let res = validator.validate({
      age: 0
    });
    let error_message = BaseRules['isIn'].getErrorMsg(1)('age', 0);

    expect(res).toEqual({
      valid: false,
      errors: {
        age: [error_message]
      }
    });
  });

  test('Optional: Rules are enforced when valid value is passed', () => {
    let validator = new Validator({
      name: ['string', 'optional', 'isIn=Alvin']
    });

    let res = validator.validate({
      name: 'Dave'
    });
    let error_message = BaseRules['isIn'].getErrorMsg('Alvin')('name', 'Dave');

    expect(res).toEqual({
      valid: false,
      errors: {
        name: [error_message]
      }
    });
  });

  test('isIn: Pass (string)', () => {
    let validator = new Validator({
      name: ['string', 'isIn=Alvin,Simon,Theo']
    });

    let res = validator.validate({
      name: 'Alvin'
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('isIn: Failed (string)', () => {
    let validator = new Validator({
      name: ['string', 'isIn=Alvin,Simon,Theo']
    });

    let res = validator.validate({
      name: 'Dave'
    });
    let error_message = BaseRules['isIn'].getErrorMsg('Alvin', 'Simon', 'Theo')('name', 'Dave');

    expect(res).toEqual({
      valid: false,
      errors: {
        name: [error_message]
      }
    });
  });

  test('isIn: Pass (number)', () => {
    let validator = new Validator({
      age: ['number', 'isIn=1,20,300']
    });

    let res = validator.validate({
      age: 20
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('isIn: Failed (number)', () => {
    let validator = new Validator({
      age: ['number', 'isIn=1,20,300']
    });

    let res = validator.validate({
      age: 10
    });
    let error_message = BaseRules['isIn'].getErrorMsg(1, 20, 300)('age', 10);

    expect(res).toEqual({
      valid: false,
      errors: {
        age: [error_message]
      }
    });
  });
})