import Validator from "classes/validator.class.js";
import rules from "rules/index.js";

const EmailRules = rules['email'];

const VALID_RESPONSE = {
	valid: true,
	errors: {}
}

describe('Email Rule Tests', () => {
	test('Type Validation: Pass', () => {
	  let validator = new Validator({
			email: 'email'
	  });
  
	  let res = validator.validate({
			email: 'a@b.com'
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('Type Validation: Fail', () => {
	  let validator = new Validator({
			email: 'email',
			email2: 'email',
			email3: 'email',
			email4: 'email'
	  });
  
	  let res = validator.validate({
			email: 'abc',
			email2: 'a@b',
			email3: 'a@.c',
			email4: '@b.c',
	  });

	  let error_message = EmailRules['email'].getErrorMsg()('email');
	  let error_message2 = EmailRules['email'].getErrorMsg()('email2');
	  let error_message3 = EmailRules['email'].getErrorMsg()('email3');
	  let error_message4 = EmailRules['email'].getErrorMsg()('email4');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				email: [error_message],
				email2: [error_message2],
				email3: [error_message3],
				email4: [error_message4]
			}
	  });
	});

	test('hasDomain: Pass', () => {
	  let validator = new Validator({
			email: ['email', 'hasDomain=asalmi.com']
	  });
  
	  let res = validator.validate({
			email: 'alex@asalmi.com'
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('hasDomain: Fail', () => {
	  let validator = new Validator({
			email: ['email', 'hasDomain=asalmi.com']
	  });
  
	  let res = validator.validate({
			email: 'alex@gmail.com'
	  });

	  let error_message = EmailRules['hasDomain'].getErrorMsg('asalmi.com')('email');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				email: [error_message]
			}
	  });
	});

});