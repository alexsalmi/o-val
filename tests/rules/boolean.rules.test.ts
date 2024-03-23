import Validator from "classes/validator.class.js";
import rules from "rules/index.js";

const BooleanRules = rules['boolean'];

const VALID_RESPONSE = {
	valid: true,
	errors: {}
}

describe('Boolean Rule Tests', () => {
	test('Type Validation: Pass', () => {
	  let validator = new Validator({
			bool: 'boolean' 
	  });
  
	  let res = validator.validate({
			bool: true
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('Type Validation: Fail', () => {
	  let validator = new Validator({
			bool: 'boolean' 
	  });
  
	  let res = validator.validate({
			bool: 'true'
	  });
	  let error_message = BooleanRules['boolean'].getErrorMsg()('bool', 'true');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				bool: [error_message]
			}
	  });
	});

	test('isTrue: Pass', () => {
	  let validator = new Validator({
			bool: ['boolean', 'isTrue'] 
	  });
  
	  let res = validator.validate({
			bool: true
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('isTrue: Fail', () => {
	  let validator = new Validator({
			bool: ['boolean', 'isTrue'] 
	  });
  
	  let res = validator.validate({
			bool: false
	  });
	  let error_message = BooleanRules['isTrue'].getErrorMsg()('bool', false);
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				bool: [error_message]
			}
	  });
	});

	test('isFalse: Pass', () => {
	  let validator = new Validator({
			bool: ['boolean', 'isFalse'] 
	  });
  
	  let res = validator.validate({
			bool: false
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('isFalse: Fail', () => {
	  let validator = new Validator({
			bool: ['boolean', 'isFalse'] 
	  });
  
	  let res = validator.validate({
			bool: true
	  });
	  let error_message = BooleanRules['isFalse'].getErrorMsg()('bool', true);
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				bool: [error_message]
			}
	  });
	});
});