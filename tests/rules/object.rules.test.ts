import Validator from "classes/validator.class.js";
import rules from "rules/index.js";

const ObjectRules = rules['object'];

const VALID_RESPONSE = {
	valid: true,
	errors: {}
}

describe('Object Rule Tests', () => {
	test('Type Validation: Pass', () => {
	  let validator = new Validator({
			object: ['object', {}]
	  });
  
	  let res = validator.validate({
			object: {}
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('Type Validation: Fail', () => {
	  let validator = new Validator({
			object: ['object', {}]
	  });
  
	  let res = validator.validate({
			object: '',
	  });

	  let error_message = ObjectRules['object'].getErrorMsg()('object');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				object: [error_message]
			}
	  });
	});

	test('notEmpty: Pass', () => {
	  let validator = new Validator({
			object: ['object', 'notEmpty', {
				child1: ['string', 'optional'],
				child2: ['string', 'optional']
			}]
	  });
  
	  let res = validator.validate({
			object: {
				child1: ''
			}
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('notEmpty: Fail', () => {
	  let validator = new Validator({
			object: ['object', 'notEmpty', {
				child1: ['string', 'optional'],
				child2: ['string', 'optional']
			}]
	  });
  
	  let res = validator.validate({
			object: {}
	  });

	  let error_message = ObjectRules['notEmpty'].getErrorMsg()('object');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				object: [error_message]
			}
	  });
	});
});