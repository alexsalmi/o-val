import Schema, { ArraySchema } from "classes/schema.class.js";

let schema: Schema;
let arraySchema: ArraySchema

jest.mock('../../src/classes/spec.class.js', () => {
	return jest.fn().mockImplementation(() => {
		return {}
	})
});

describe('Schema Class Tests', () => {
	test('Construct a new Schema', () => {
		schema = new Schema({
			key1: ''
		});

		expect(schema.specs).toEqual({
			key1: {}
		});
	});

	test('Add a new spec to existing Schema', () => {
		schema.addSpecs({
			key2: '', 
			key3: ''
		});

		expect(schema.specs).toEqual({
			key1: {},
			key2: {},
			key3: {}
		});
	});

	test('Attempt to a new spec with an existing key', () => {
		const fnCall = () => schema.addSpecs({
			key1: ''
		});

		expect(fnCall).toThrow(`Key 'key1' already exists`);
	});
});

describe('ArraySchema Class Tests', () => {
	test('Construct a new ArraySchema with all valid range types', () => {
		arraySchema = new ArraySchema({
			'[*]': '',
			'[0]': '',
			'[0,1]': ''
		}, 'path');

		expect(arraySchema.specs).toEqual({
			'[*]': {},
			'[0]': {},
			'[0,1]': {}
		});
	});

	test('Add a new spec to existing Schema', () => {
		arraySchema.addSpecs({
			'[1]': ''
		}, 'path');

		expect(arraySchema.specs).toEqual({
			'[*]': {},
			'[0]': {},
			'[0,1]': {},
			'[1]': {}
		});
	});

	test('Attempt to a new spec with an existing key', () => {
		const fnCall = () => arraySchema.addSpecs({
			'[*]': ''
		}, 'path');

		expect(fnCall).toThrow(`Key 'path[*]' already exists`);
	});

	test('Attempt to a new spec with an invalid range types', () => {
		const fnCall1 = () => arraySchema.addSpecs({
			'[]': ''
		}, 'path');

		const fnCall2 = () => arraySchema.addSpecs({
			'[1,0]': ''
		}, 'path');
		
		const fnCall3 = () => arraySchema.addSpecs({
			'[hello,there]': ''
		}, 'path');
		
		const fnCall4 = () => arraySchema.addSpecs({
			'[*,1]': ''
		}, 'path');

		expect(fnCall1).toThrow(`Key 'path' contains invalid range '[]'`);
		expect(fnCall2).toThrow(`Key 'path' contains invalid range '[1,0]'`);
		expect(fnCall3).toThrow(`Key 'path' contains invalid range '[hello,there]'`);
		expect(fnCall4).toThrow(`Key 'path' contains invalid range '[*,1]'`);
	});
});