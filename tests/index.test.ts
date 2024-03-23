import Validator, {OValConfig} from "index.js";

describe('Importing Modules Tests', () => {
	test('Validator imported from index.ts successfully', () => {
	  expect(new Validator({})).toBeInstanceOf(Validator);
	})

	test('OValConfig imported from index.ts successfully', () => {
		expect(OValConfig).not.toBeUndefined();
	})
})