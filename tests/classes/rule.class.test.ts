import Rule from "classes/rule.class.js";

let ruleWithParams: Rule;
let ruleWithoutParams: Rule;

describe('Rule Class Tests', () => {
	test('Construct a rule which does not accept params', () => {
		ruleWithoutParams = new Rule('ruleWithoutParams', 
			function (value: any) {
				return value === 'Valid Value';
			},
			`{rule} failed: Key {key}'s value {value} does not equal Valid Value`
		);

		expect(ruleWithoutParams).toBeInstanceOf(Rule);
	});
	
	test('Construct a rule which accepts params', () => {
		ruleWithParams = new Rule('ruleWithParams', 
			function (val1: string, val2: string) {
				return (value: any) => {
					return (value === val1) || (value === val2);
				}
			},
			`{rule} failed: Key {key}'s value {value} does not equal {arg0} or {arg1}. Args: [{args}]`
		);
		
		expect(ruleWithParams).toBeInstanceOf(Rule);
	});

	test('Get function which does not accept params', () => {
		const fn: Function = ruleWithoutParams.getFunc();
		const res: boolean = fn('Valid Value');

		expect(fn).toBeInstanceOf(Function);
		expect(res).toEqual(true);
	});
	
	test('Get function which accepts params', () => {
		const fn: Function = ruleWithParams.getFunc('ARG1', 'ARG2');
		const res: boolean = fn('ARG2');

		expect(fn).toBeInstanceOf(Function);
		expect(res).toEqual(true);
	});

	test('Get error message which does not accept params', () => {
		const errMsgFn: Function = ruleWithoutParams.getErrorMsg();
		const errMsg: string = errMsgFn('KEY', 'VALUE');

		expect(errMsgFn).toBeInstanceOf(Function);
		expect(errMsg).toEqual(`ruleWithoutParams failed: Key KEY's value VALUE does not equal Valid Value`);
	});
	
	test('Get error message which accepts params', () => {
		const errMsgFn: Function = ruleWithParams.getErrorMsg('ARG1', 'ARG2');
		const errMsg: string = errMsgFn('KEY', 'VALUE');

		expect(errMsgFn).toBeInstanceOf(Function);
		expect(errMsg).toEqual(`ruleWithParams failed: Key KEY's value VALUE does not equal ARG1 or ARG2. Args: [ARG1, ARG2]`);
	});
});