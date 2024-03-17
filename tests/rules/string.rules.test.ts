import Validator from "classes/validator.class.js";
import StringRules from "rules/string.rules.js";

const VALID_RESPONSE = {
  valid: true,
  errors: {}
}

describe('----- String Rule Tests -----', () => {
  test('Type Validation: Pass', () => {
    let validator = new Validator({
      name: 'string'
    });

    let res = validator.validate({
      name: 'Hello, world!'
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('Type Validation: Fail', () => {
    let validator = new Validator({
      name: 'string'
    });

    let res = validator.validate({
      name: 0
    });
    let error_message = StringRules['string'].getErrorMsg()('name', 0);

    expect(res).toEqual({
      valid: false,
      errors: {
        name: [error_message]
      }
    });
  });

  test('isEmpty: Pass', () => {
    let validator = new Validator({
      name: ['string', 'isEmpty']
    });

    let res = validator.validate({
      name: ''
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('isEmpty: Fail', () => {
    let validator = new Validator({
      name: ['string', 'isEmpty']
    });

    let res = validator.validate({
      name: 'Hello, world!'
    });
    let error_message = StringRules['isEmpty'].getErrorMsg()('name', 'Hello, world!');

    expect(res).toEqual({
      valid: false,
      errors: {
        name: [error_message]
      }
    });
  });

  test('minLength: Pass', () => {
    let validator = new Validator({
      name: ['string', 'minLength=7']
    });

    let res = validator.validate({
      name: 'Hello, world!'
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('minLength: Fail', () => {
    let validator = new Validator({
      name: ['string', 'minLength=7']
    });

    let res = validator.validate({
      name: 'Hello!'
    });
    let error_message = StringRules['minLength'].getErrorMsg(7)('name', 'Hello!');

    expect(res).toEqual({
      valid: false,
      errors: {
        name: [error_message]
      }
    });
  });

  test('maxLength: Pass', () => {
    let validator = new Validator({
      name: ['string', 'maxLength=6']
    });

    let res = validator.validate({
      name: 'Hello!'
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('maxLength: Fail', () => {
    let validator = new Validator({
      name: ['string', 'maxLength=6']
    });

    let res = validator.validate({
      name: 'Hello, World!'
    });
    let error_message = StringRules['maxLength'].getErrorMsg(6)('name', 'Hello, World!');

    expect(res).toEqual({
      valid: false,
      errors: {
        name: [error_message]
      }
    });
  });

  test('matches: Pass', () => {
    let validator = new Validator({
      name: ['string', 'matches=[0-9]+']
    });

    let res = validator.validate({
      name: '123'
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('matches: Fail', () => {
    let validator = new Validator({
      name: ['string', 'matches=[0-9]+']
    });

    let res = validator.validate({
      name: 'a123'
    });
    let error_message = StringRules['matches'].getErrorMsg('[0-9]+')('name', 'a123');

    expect(res).toEqual({
      valid: false,
      errors: {
        name: [error_message]
      }
    });
  });

  test('isNumeric: Pass', () => {
    let validator = new Validator({
      intStr: ['string', 'isNumeric'],
      decStr: ['string', 'isNumeric']
    });

    let res = validator.validate({
      intStr: '123',
      decStr: '123.45'
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('isNumeric: Fail', () => {
    let validator = new Validator({
      intStr: ['string', 'isNumeric'],
      decStr: ['string', 'isNumeric']
    });

    let res = validator.validate({
      intStr: '123a',
      decStr: '123.45/'
    });
    let intStr_error_message = StringRules['isNumeric'].getErrorMsg()('intStr', '123a');
    let decStr_error_message = StringRules['isNumeric'].getErrorMsg()('decStr', '123.45/');

    expect(res).toEqual({
      valid: false,
      errors: {
        intStr: [intStr_error_message],
        decStr: [decStr_error_message]
      }
    });
  });

  test('isAlphaNumeric: Pass', () => {
    let validator = new Validator({
      str: ['string', 'isAlphaNumeric']
    });

    let res = validator.validate({
      str: 'aAbBcC123'
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('isAlphaNumeric: Fail', () => {
    let validator = new Validator({
      str1: ['string', 'isAlphaNumeric'],
      str2: ['string', 'isAlphaNumeric'],
      str3: ['string', 'isAlphaNumeric']
    });

    let res = validator.validate({
      str1: '#aAbBcC123',
      str2: 'aAbB/cC123',
      str3: 'aAbBcC123-'
    });
    let str1_error_message = StringRules['isAlphaNumeric'].getErrorMsg()('str1', '#aAbBcC123');
    let str2_error_message = StringRules['isAlphaNumeric'].getErrorMsg()('str2', 'aAbB/cC123');
    let str3_error_message = StringRules['isAlphaNumeric'].getErrorMsg()('str3', 'aAbBcC123-');

    expect(res).toEqual({
      valid: false,
      errors: {
        str1: [str1_error_message],
        str2: [str2_error_message],
        str3: [str3_error_message]
      }
    });
  });

  test('isAlpha: Pass', () => {
    let validator = new Validator({
      str: ['string', 'isAlpha']
    });

    let res = validator.validate({
      str: 'aAbBcC'
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('isAlpha: Fail', () => {
    let validator = new Validator({
      str1: ['string', 'isAlpha'],
      str2: ['string', 'isAlpha'],
      str3: ['string', 'isAlpha']
    });

    let res = validator.validate({
      str1: 'aAbBcC123',
      str2: '#aAbBcC',
      str3: 'aAbB-cC123'
    });
    let str1_error_message = StringRules['isAlpha'].getErrorMsg()('str1', 'aAbBcC123');
    let str2_error_message = StringRules['isAlpha'].getErrorMsg()('str2', '#aAbBcC');
    let str3_error_message = StringRules['isAlpha'].getErrorMsg()('str3', 'aAbB-cC123');

    expect(res).toEqual({
      valid: false,
      errors: {
        str1: [str1_error_message],
        str2: [str2_error_message],
        str3: [str3_error_message]
      }
    });
  });

  test('isUpperCase: Pass', () => {
    let validator = new Validator({
      str: ['string', 'isUpperCase']
    });

    let res = validator.validate({
      str: 'ABC'
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('isUpperCase: Fail', () => {
    let validator = new Validator({
      str: ['string', 'isUpperCase']
    });

    let res = validator.validate({
      str: 'aAbBcC'
    });
    let error_message = StringRules['isUpperCase'].getErrorMsg()('str', 'aAbBcC');

    expect(res).toEqual({
      valid: false,
      errors: {
        str: [error_message]
      }
    });
  });

  test('isLowerCase: Pass', () => {
    let validator = new Validator({
      str: ['string', 'isLowerCase']
    });

    let res = validator.validate({
      str: 'abc'
    });

    expect(res).toEqual(VALID_RESPONSE);
  });

  test('isLowerCase: Fail', () => {
    let validator = new Validator({
      str: ['string', 'isLowerCase']
    });

    let res = validator.validate({
      str: 'aAbBcC'
    });
    let error_message = StringRules['isLowerCase'].getErrorMsg()('str', 'aAbBcC');

    expect(res).toEqual({
      valid: false,
      errors: {
        str: [error_message]
      }
    });
  });
})