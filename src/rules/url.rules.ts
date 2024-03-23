import Rule from "classes/rule.class.js";
import StringRules from "./string.rules.js";

const UrlRules: RuleSet = {
	// Checks that the value passed is a URL
	url: new Rule('url',
		function (): Function {
			return (value: string): boolean => {
				try{
					new URL(value);
					return true;
				}
				catch {
					return false;
				}
			}
		},
		`'{key}' must be a valid URL`
	),

	// Checks if the URL has a set domain
	hasDomain: new Rule('hasDomain',
		function (domain: string): Function {
			return (value: string): boolean => {
				return value.toLowerCase().includes(domain.toLowerCase());
			}
		},
		`'{key}' must be a URL with the domain '{arg0}'`
	)
}

UrlRules.__proto__ = StringRules;

export default UrlRules;