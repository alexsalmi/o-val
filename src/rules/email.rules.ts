import Rule from "classes/rule.class.js";
import StringRules from "./string.rules.js";

const EmailRules: RuleSet = {
	// Checks that the value passed is an email address
	email: new Rule('email',
		function (): Function {
			return (value: string): boolean => {
        return (value.match('^[a-zA-Z0-9.!#$%&\'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$') || []).length > 0;
			}
		},
		`'{key}' must be a valid email address`
	),

	// Checks if the email address has a set domain
	hasDomain: new Rule('hasDomain',
		function (domain: string): Function {
      if(!domain)
        throw Error(`Rule 'hasDomain' requires a domain as input`);

			return (value: string): boolean => {
				let emailDomain = value.split("@")[1];

				return domain.toLowerCase() === emailDomain.toLowerCase();
			}
		},
		`'{key}' must be an email address on the domain '{arg0}'`
	)
}

EmailRules.__proto__ = StringRules;

export default EmailRules;