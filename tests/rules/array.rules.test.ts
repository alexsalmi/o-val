import Validator from "classes/validator.class.js";
import rules from "rules/index.js";

const ArrayRules = rules['array'];

const VALID_RESPONSE = {
	valid: true,
	errors: {}
}

describe('Array Rule Tests', () => {
	test('Type Validation: Pass', () => {
	  let validator = new Validator({
			arr: ['array', {
				'*': 'string'
			}]
	  });
  
	  let res = validator.validate({
			arr: ['str']
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('Type Validation: Fail', () => {
		let validator = new Validator({
			arr: ['array', {
				'*': 'string'
			}]
		});
  
	  let res = validator.validate({
			arr: 'str'
	  });
	  let error_message = ArrayRules['array'].getErrorMsg()('arr', 'str');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				arr: [error_message]
			}
	  });
	});

	test('notEmpty: Pass', () => {
	  let validator = new Validator({
			arr: ['array', 'notEmpty', {
				'*': 'string'
			}]
	  });
  
	  let res = validator.validate({
			arr: ['str']
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('notEmpty: Fail', () => {
		let validator = new Validator({
			arr: ['array', 'notEmpty', {
				'*': 'string'
			}]
		});
  
	  let res = validator.validate({
			arr: []
	  });
	  let error_message = ArrayRules['notEmpty'].getErrorMsg()('arr', []);
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				arr: [error_message]
			}
	  });
	});

	test('minLength: Pass', () => {
	  let validator = new Validator({
			arr: ['array', 'minLength=3', {
				'*': 'string'
			}],
			arr2: ['array', 'minLength=3', {
				'*': 'string'
			}]
	  });
  
	  let res = validator.validate({
			arr: ['str', 'str', 'str'],
			arr2: ['str', 'str', 'str', 'str']
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('minLength: Fail', () => {
		let validator = new Validator({
			arr: ['array', 'minLength=3', {
				'*': 'string'
			}]
		});
  
	  let res = validator.validate({
			arr: ['str','str']
	  });
	  let error_message = ArrayRules['minLength'].getErrorMsg(3)('arr', ['str','str']);
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				arr: [error_message]
			}
	  });
	});

	test('maxLength: Pass', () => {
	  let validator = new Validator({
			arr: ['array', 'maxLength=3', {
				'*': 'string'
			}],
			arr2: ['array', 'maxLength=3', {
				'*': 'string'
			}]
	  });
  
	  let res = validator.validate({
			arr: ['str', 'str'],
			arr2: ['str', 'str', 'str']
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('maxLength: Fail', () => {
		let validator = new Validator({
			arr: ['array', 'maxLength=3', {
				'*': 'string'
			}]
		});
  
	  let res = validator.validate({
			arr: ['str','str', 'str','str']
	  });
	  let error_message = ArrayRules['maxLength'].getErrorMsg(3)('arr', ['str','str', 'str','str']);
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				arr: [error_message]
			}
	  });
	});

	test('exactLength: Pass', () => {
	  let validator = new Validator({
			arr: ['array', 'exactLength=3', {
				'*': 'string'
			}]
	  });
  
	  let res = validator.validate({
			arr: ['str', 'str', 'str']
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('exactLength: Fail', () => {
		let validator = new Validator({
			arr: ['array', 'exactLength=3', {
				'*': 'string'
			}],
			arr2: ['array', 'exactLength=3', {
				'*': 'string'
			}]
		});
  
	  let res = validator.validate({
			arr: ['str','str'],
			arr2: ['str','str', 'str','str']
	  });
	  let error_message = ArrayRules['exactLength'].getErrorMsg(3)('arr', ['str','str']);
	  let error_message2 = ArrayRules['exactLength'].getErrorMsg(3)('arr2', ['str','str', 'str','str']);
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				arr: [error_message],
				arr2: [error_message2]
			}
	  });
	});
});