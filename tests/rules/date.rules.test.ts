import Validator from "classes/validator.class.js";
import rules from "rules/index.js";

const DateRules = rules['date'];

const VALID_RESPONSE = {
	valid: true,
	errors: {}
}

describe('Date Rule Tests', () => {
	test('Type Validation: Pass', () => {
	  let validator = new Validator({
			date: 'date',
			date2: 'date'
	  });
  
	  let res = validator.validate({
			date: '12/31/2024',
			date2: '12-31-2024'
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('Type Validation: Fail', () => {
	  let validator = new Validator({
			date: 'date',
			date2: 'date',
			date3: 'date',
			date4: 'date'
	  });
  
	  let res = validator.validate({
			date: '31/12-2024',
			date2: '32-12-2024',
			date3: '13/31/2024',
			date4: '00/01/2024',
	  });

	  let error_message = DateRules['date'].getErrorMsg()('date');
	  let error_message2 = DateRules['date'].getErrorMsg()('date2');
	  let error_message3 = DateRules['date'].getErrorMsg()('date3');
	  let error_message4 = DateRules['date'].getErrorMsg()('date4');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				date: [error_message],
				date2: [error_message2],
				date3: [error_message3],
				date4: [error_message4]
			}
	  });
	});

	test('before: Pass', () => {
	  let validator = new Validator({
			date: ['date', 'before=06/15/2024'],
	  });
  
	  let res = validator.validate({
			date: '05/01/2024'
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('before: Fail', () => {
	  let validator = new Validator({
			date: ['date', 'before=06/15/2024'],
			date2: ['date', 'before=06/15/2024'],
	  });
  
	  let res = validator.validate({
			date: '06/15/2024',
			date2: '07/01/2024',
	  });

	  let error_message = DateRules['before'].getErrorMsg('06/15/2024')('date');
	  let error_message2 = DateRules['before'].getErrorMsg('06/15/2024')('date2');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				date: [error_message],
				date2: [error_message2]
			}
	  });
	});

	test('before: Invalid params', () => {
	  let fn = () => new Validator({
			date: ['date', 'before']
	  });
  
	  expect(fn).toThrow(`Rule 'before' requires a date as input`);
	});

	test('after: Pass', () => {
	  let validator = new Validator({
			date: ['date', 'after=06/15/2024'],
	  });
  
	  let res = validator.validate({
			date: '07/01/2024'
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('after: Fail', () => {
	  let validator = new Validator({
			date: ['date', 'after=06/15/2024'],
			date2: ['date', 'after=06/15/2024'],
	  });
  
	  let res = validator.validate({
			date: '06/15/2024',
			date2: '05/01/2024',
	  });

	  let error_message = DateRules['after'].getErrorMsg('06/15/2024')('date');
	  let error_message2 = DateRules['after'].getErrorMsg('06/15/2024')('date2');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				date: [error_message],
				date2: [error_message2]
			}
	  });
	});

	test('after: Invalid params', () => {
	  let fn = () => new Validator({
			date: ['date', 'after']
	  });
  
	  expect(fn).toThrow(`Rule 'after' requires a date as input`);
	});

	test('between: Pass', () => {
	  let validator = new Validator({
			date: ['date', 'between=01/01/2024,01/31/2024'],
	  });
  
	  let res = validator.validate({
			date: '01/15/2024'
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('between: Fail', () => {
	  let validator = new Validator({
			date: ['date', 'between=01/01/2024,01/31/2024'],
			date2: ['date', 'between=01/01/2024,01/31/2024'],
			date3: ['date', 'between=01/01/2024,01/31/2024'],
			date4: ['date', 'between=01/01/2024,01/31/2024'],
	  });
  
	  let res = validator.validate({
			date: '12/01/2023',
			date2: '01/01/2024',
			date3: '01/31/2024',
			date4: '02/01/2024',
	  });

	  let error_message = DateRules['between'].getErrorMsg('01/01/2024', '01/31/2024')('date');
	  let error_message2 = DateRules['between'].getErrorMsg('01/01/2024', '01/31/2024')('date2');
	  let error_message3 = DateRules['between'].getErrorMsg('01/01/2024', '01/31/2024')('date3');
	  let error_message4 = DateRules['between'].getErrorMsg('01/01/2024', '01/31/2024')('date4');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				date: [error_message],
				date2: [error_message2],
				date3: [error_message3],
				date4: [error_message4]
			}
	  });
	});

	test('between: Invalid params', () => {
	  let fn1 = () => new Validator({
			date: ['date', 'between']
	  });
	  let fn2 = () => new Validator({
			date: ['date', 'between=1']
	  });
  
	  expect(fn1).toThrow(`Rule 'between' requires two dates as input`);
	  expect(fn2).toThrow(`Rule 'between' requires two dates as input`);
	});

	test('exactDate: Pass', () => {
	  let validator = new Validator({
			date: ['date', 'exactDate=01/31/2024'],
	  });
  
	  let res = validator.validate({
			date: '01/31/2024'
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('exactDate: Fail', () => {
	  let validator = new Validator({
			date: ['date', 'exactDate=01/31/2024'],
			date2: ['date', 'exactDate=01/31/2024']
	  });
  
	  let res = validator.validate({
			date: '01/30/2024',
			date2: '02/01/2024'
	  });

	  let error_message = DateRules['exactDate'].getErrorMsg('01/31/2024')('date');
	  let error_message2 = DateRules['exactDate'].getErrorMsg('01/31/2024')('date2');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				date: [error_message],
				date2: [error_message2]
			}
	  });
	});

	test('exactDate: Invalid params', () => {
	  let fn = () => new Validator({
			date: ['date', 'exactDate']
	  });
  
	  expect(fn).toThrow(`Rule 'exactDate' requires a date as input`);
	});

	test('inYear: Pass', () => {
	  let validator = new Validator({
			date: ['date', 'inYear=2024'],
	  });
  
	  let res = validator.validate({
			date: '01/31/2024'
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('inYear: Fail', () => {
	  let validator = new Validator({
			date: ['date', 'inYear=2024'],
			date2: ['date', 'inYear=2024']
	  });
  
	  let res = validator.validate({
			date: '01/30/2023',
			date2: '02/01/2025'
	  });

	  let error_message = DateRules['inYear'].getErrorMsg('2024')('date');
	  let error_message2 = DateRules['inYear'].getErrorMsg('2024')('date2');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				date: [error_message],
				date2: [error_message2]
			}
	  });
	});

	test('inYear: Invalid params', () => {
	  let fn = () => new Validator({
			date: ['date', 'inYear']
	  });
  
	  expect(fn).toThrow(`Rule 'inYear' requires a year as input`);
	});

	test('inMonth: Pass', () => {
	  let validator = new Validator({
			date: ['date', 'inMonth=8'],
			date2: ['date', 'inMonth=12'],
	  });
  
	  let res = validator.validate({
			date: '08/31/2024',
			date2: '12/31/2025',
	  });
  
	  expect(res).toEqual(VALID_RESPONSE);
	});
  
	test('inMonth: Fail', () => {
	  let validator = new Validator({
			date: ['date', 'inMonth=8'],
			date2: ['date', 'inMonth=8']
	  });
  
	  let res = validator.validate({
			date: '01/30/2023',
			date2: '02/01/2025'
	  });

	  let error_message = DateRules['inMonth'].getErrorMsg('8')('date');
	  let error_message2 = DateRules['inMonth'].getErrorMsg('8')('date2');
  
	  expect(res).toEqual({
			valid: false,
			errors: {
				date: [error_message],
				date2: [error_message2]
			}
	  });
	});

	test('inMonth: Invalid params', () => {
	  let fn = () => new Validator({
			date: ['date', 'inMonth']
	  });
  
	  expect(fn).toThrow(`Rule 'inMonth' requires a month as input`);
	});
});