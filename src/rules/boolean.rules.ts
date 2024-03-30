import Rule from "classes/rule.class.js";
import BaseRules from "./base.rules.js";

const BooleanRules: RuleSet = {
	// Checks that the value passed is a boolean
	boolean: new Rule('boolean',
		function (): Function {
			return (bool: boolean): boolean => {
				return typeof bool === 'boolean';
			}
		},
		`'{key}' must be a boolean'`
	),

	// Checks that the boolean is true
	isTrue: new Rule('isTrue',
		function (): Function {
			return (bool: boolean): boolean => {
				return bool === true;
			}
		},
		`'{key}' must be 'true'`
	),

	// Checks that the boolean is false
	isFalse: new Rule('isFalse',
		function (): Function {
			return (bool: boolean): boolean => {
				return bool === false;
			}
		},
		`'{key}' must be 'false'`
	)
}

BooleanRules.__proto__ = BaseRules;

export default BooleanRules;