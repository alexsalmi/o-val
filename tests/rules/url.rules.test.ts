import Validator from "classes/validator.class.js";
import rules from "rules/index.js";

const UrlRules = rules['url'];

const VALID_RESPONSE = {
	valid: true,
	errors: {}
}

describe('URL Rule Tests', () => {
	test('Type Validation: Pass', () => {
	  let validator = new Validator({
			url: 'url',
			url2: 'url',
			url3: 'url'
	  });
  
	  let res = validator.validate({
			url: 'http://www.asalmi.com',
			url2: 'https://www.asalmi.com',
			url3: 'https://asalmi.com'
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('Type Validation: Fail', () => {
	  let validator = new Validator({
			url: 'url',
			url2: 'url',
			url3: 'url',
			url4: 'url',
			url5: 'url'
	  });
  
	  let res = validator.validate({
			url: 'abc',
			url2: 'abs/abs',
			url3: 'test.c',
			url4: '.abc',
			url5: 'abc.',
	  });

	  let error_message = UrlRules['url'].getErrorMsg()('url');
	  let error_message2 = UrlRules['url'].getErrorMsg()('url2');
	  let error_message3 = UrlRules['url'].getErrorMsg()('url3');
	  let error_message4 = UrlRules['url'].getErrorMsg()('url4');
	  let error_message5 = UrlRules['url'].getErrorMsg()('url5');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				url: [error_message],
				url2: [error_message2],
				url3: [error_message3],
				url4: [error_message4],
				url5: [error_message5]
			}
	  });
	});

	test('hasDomain: Pass', () => {
	  let validator = new Validator({
			url: ['url', 'hasDomain=asalmi.com']
	  });
  
	  let res = validator.validate({
			url: 'https://www.asalmi.com'
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('hasDomain: Fail', () => {
	  let validator = new Validator({
			url: ['url', 'hasDomain=asalmi.com']
	  });
  
	  let res = validator.validate({
			url: 'https://www.gmail.com'
	  });

	  let error_message = UrlRules['hasDomain'].getErrorMsg('asalmi.com')('url');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				url: [error_message]
			}
	  });
	});

});