import Validator from "classes/validator.class.js";
import rules from "rules/index.js";

const PhoneRules = rules['phone'];

const VALID_RESPONSE = {
	valid: true,
	errors: {}
}

describe('Phone Rule Tests', () => {
	test('Type Validation: Pass', () => {
	  let validator = new Validator({
			phone: 'phone',
			phone2: 'phone',
			phone3: 'phone'
	  });
  
	  let res = validator.validate({
			phone: '1234567890',
			phone2: '+11234567890',
			phone3: '(123) 456-7890'
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('Type Validation: Fail', () => {
	  let validator = new Validator({
			phone: 'phone',
			phone2: 'phone',
			phone3: 'phone'
	  });
  
	  let res = validator.validate({
			phone: '+ 1234567890',
			phone2: '()4567890',
			phone3: '(123 456--7890'
	  });

	  let error_message = PhoneRules['phone'].getErrorMsg()('phone');
	  let error_message2 = PhoneRules['phone'].getErrorMsg()('phone2');
	  let error_message3 = PhoneRules['phone'].getErrorMsg()('phone3');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				phone: [error_message],
				phone2: [error_message2],
				phone3: [error_message3]
			}
	  });
	});

	test('hasCountryCode: Pass', () => {
	  let validator = new Validator({
			phone: ['phone', 'hasCountryCode=1'],
			phone1: ['phone', 'hasCountryCode=+1']
	  });
  
	  let res = validator.validate({
			phone: '+1 1234567890',
			phone1: '+11234567890',
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('hasCountryCode: Fail', () => {
	  let validator = new Validator({
			phone: ['phone', 'hasCountryCode=+1'],
			phone2: ['phone', 'hasCountryCode=+1']
	  });
  
	  let res = validator.validate({
			phone: '+461234567890',
			phone2: '1234567890',
	  });

	  let error_message = PhoneRules['hasCountryCode'].getErrorMsg('+1')('phone');
	  let error_message2 = PhoneRules['hasCountryCode'].getErrorMsg('+1')('phone2');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				phone: [error_message],
				phone2: [error_message2]
			}
	  });
	});

	test('hasCountryCode: Invalid params', () => {
	  let fn = () => new Validator({
			phone: ['phone', 'hasCountryCode']
	  });
  
	  expect(fn).toThrow(`Rule 'hasCountryCode' requires a country code as input`);
	});
});