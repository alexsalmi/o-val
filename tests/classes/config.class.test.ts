import Validator, { OValConfig } from "index.js";
import rules from "rules/index.js";

const VALID_RESPONSE = {
	valid: true,
	errors: {}
}

describe('Config class tests', () => {
  test('Type added with default proto successfully', () => {
    OValConfig.addType('testType', 
    (value: string) => {
      return value.startsWith('test');
    });

    expect(rules['testType']).not.toBeUndefined();
    expect(rules['testType']['isIn']).not.toBeUndefined();
  })

  test('Type added with proto successfully', () => {
    OValConfig.addType('testTypeStr', 
    (value: string) => {
      return value === 'test';
    }, 'string');

    expect(rules['testTypeStr']).not.toBeUndefined();
    expect(rules['testTypeStr']['maxLength']).not.toBeUndefined();
  })

  test('Validation of new type succeeds correctly', () => {
    let val = new Validator({
      test: 'testType'
    });

    let res = val.validate({
      test: 'test'
    });
  
	  expect(res).toEqual(VALID_RESPONSE);
  })

  test('Validation of new type fails correctly', () => {
    let val = new Validator({
      test: 'testType'
    });

    let res = val.validate({
      test: 'nottest'
    });
	  let error_message = rules['testType']['testType'].getErrorMsg()('test', 'nottest');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				test: [error_message]
			}
	  });
  })

  test('Type fails to be added when already exists', () => {
    const testFn = () => OValConfig.addType('string', () => {});

    expect(testFn).toThrow(`Type 'string' already exists`);
  })

  test('Type fails to be added when prototype doesnt exists', () => {
    const testFn = () => OValConfig.addType('testTypeFail', () => {}, 'notreal');

    expect(testFn).toThrow(`Type 'notreal' doesn't exist, can't inherit from it`);
    expect(rules['testTypeFail']).toBeUndefined();
  })

  test('Rule added successfully', () => {
    OValConfig.addRule('testType', 'testFn', 
    function (){ 
      return (value: string) => {
        return value === 'test_true'
      }
    }, 'ERROR MESSAGE');

    expect(rules['testType']['testFn']).not.toBeUndefined();
  })

  test('Validation of new rule succeeds correctly', () => {
    let val = new Validator({
      test: ['testType', 'testFn']
    });

    let res = val.validate({
      test: 'test_true'
    });
  
	  expect(res).toEqual(VALID_RESPONSE);
  })

  test('Validation of new rule fails correctly', () => {
    let val = new Validator({
      test: ['testType', 'testFn']
    });

    let res = val.validate({
      test: 'test_false'
    });
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				test: ['ERROR MESSAGE']
			}
	  });
  })

  test('Rule fails to be added when type doesnt exists', () => {
    const testFn = () => OValConfig.addRule('notreal', 'testFn', function (){ return () => {true}}, 'ERROR MESSAGE');

    expect(testFn).toThrow(`Type 'notreal' is not an existing type`);
  })

  test('Rule fails to be added when rule already exists', () => {
    const testFn = () => OValConfig.addRule('string', 'maxLength', function (){ return () => {true}}, 'ERROR MESSAGE');

    expect(testFn).toThrow(`Rule 'maxLength' already exists on type 'string'`);
  })
});