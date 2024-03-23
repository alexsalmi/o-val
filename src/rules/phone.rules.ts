import Rule from "classes/rule.class.js";
import StringRules from "./string.rules.js";

const PhoneRules: RuleSet = {
	// Checks that the value passed is a phone number
	phone: new Rule('phone',
		function (): Function {
			return (value: string): boolean => {
        return (value.match(/^(\+[0-9]+)? ?(\(?[0-9]+\)?)?([-. ]?[0-9])*$/) || []).length > 0;
			}
		},
		`'{key}' must be a valid phone number`
	),

	// Checks if the phone number has a set country code
	hasCountryCode: new Rule('hasCountryCode',
		function (country: string): Function {
			const code = "+" + country.replace("+", "");
			return (value: string): boolean => {
        return value.startsWith(code);
			}
		},
		`'{key}' must have country code '{arg0}'`
	)
}

PhoneRules.__proto__ = StringRules;

export default PhoneRules;