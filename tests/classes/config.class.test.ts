import _config from "classes/config.class.js";
import rules from "rules/index.js";

const config = new _config();

describe('Config class tests', () => {
  test('Type added with default proto successfully', () => {
    config.addType('testType');

    expect(rules['testType']).not.toBeUndefined();
    expect(rules['testType']['isIn']).not.toBeUndefined();
  })

  test('Type added with proto successfully', () => {
    config.addType('testTypeStr', 'string');

    expect(rules['testTypeStr']).not.toBeUndefined();
    expect(rules['testTypeStr']['maxLength']).not.toBeUndefined();
  })

  test('Type fails to be added when already exists', () => {
    const testFn = () => config.addType('string');

    expect(testFn).toThrow(`Type 'string' already exists`);
  })

  test('Type fails to be added when prototype doesnt exists', () => {
    const testFn = () => config.addType('testTypeFail', 'notreal');

    expect(testFn).toThrow(`Type 'notreal' doesn't exist, can't inherit from it`);
    expect(rules['testTypeFail']).toBeUndefined();
  })

  test('Rule added successfully', () => {
    config.addRule('testType', 'testFn', function (){ return () => {true}}, 'ERROR MESSAGE');

    expect(rules['testType']['testFn']).not.toBeUndefined();
  })

  test('Rule fails to be added when type doesnt exists', () => {
    const testFn = () => config.addRule('notreal', 'testFn', function (){ return () => {true}}, 'ERROR MESSAGE');

    expect(testFn).toThrow(`Type 'notreal' is not an existing type`);
  })

  test('Rule fails to be added when rule already exists', () => {
    const testFn = () => config.addRule('string', 'maxLength', function (){ return () => {true}}, 'ERROR MESSAGE');

    expect(testFn).toThrow(`Rule 'maxLength' already exists on type 'string'`);
  })
});