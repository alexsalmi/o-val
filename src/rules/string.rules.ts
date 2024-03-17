import Rule from "classes/rule.class.js";
import BaseRules from "rules/base.rules.js";

const StringRules: RuleSet = {
  string: new Rule('string',
    function (value: string): boolean {
      return typeof value === 'string';
    },
    `'{key}' must be of type 'string'`
  ),

  isEmpty: new Rule('isEmpty',
    function (value: string): boolean {
      return value.length === 0;
    },
    `'{key}' must be an empty string`
  ),

  minLength: new Rule('minLength',
    function (limit: number): Function {
      return (value: string): boolean => {
        return value.length >= limit;
      }
    },
    `'{key}' must be at least {arg0} characters long`
  ),

  maxLength: new Rule('maxLength',
    function (limit: number): Function {
      return (value: string): boolean => {
        return value.length <= limit;
      }
    },
    `'{key}' must be at most {arg0} characters long`
  ),

  matches: new Rule('matches',
    function (regex: string): Function {
      return (value: string): boolean => {
        return (value.match(`^(${regex})$`) || []).length > 0;
      }
    },
    `'{key}' must match the format {arg0}`
  ),

  isNumeric: new Rule('isNumeric',
    function (value: string): boolean {
      return !Number.isNaN(Number(value));
    },
    `'{key}' must be numeric`
  ),

  isAlphaNumeric: new Rule('isAlphaNumeric',
    function (value: string): boolean {
      return (value.match("^([A-Za-z0-9]*)$") || []).length > 0;
    },
    `'{key}' must be alphanumeric`
  ),

  isAlpha: new Rule('isAlpha',
    function (value: string): boolean {
      return (value.match("^([A-Za-z]*)$") || []).length > 0;
    },
    `'{key}' must only contain alphabetical characters`
  ),
  
  isUpperCase: new Rule('isUpperCase',
    function (value: string): boolean {
      return (value.match("^([A-Z]*)$") || []).length > 0;
    },
    `'{key}' must only contain uppercase characters`
  ),
  
  isLowerCase: new Rule('isLowerCase',
    function (value: string): boolean {
      return (value.match("^([a-z]*)$") || []).length > 0;
    },
    `'{key}' must only contain lowercase characters`
  )
};

StringRules.__proto__ = BaseRules;

export default StringRules;