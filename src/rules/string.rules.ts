import Rule from "classes/rule.class.js";
import BaseRules from "rules/base.rules.js";

const StringRules: RuleSet = {
  // Checks that the value passed is a string
  string: new Rule('string',
    function (): Function {
      return (value: string): boolean => {
        return typeof value === 'string';
      }
    },
    `'{key}' must be of type 'string'`
  ),

  // Checks to see if the string is empty
  isEmpty: new Rule('isEmpty',
    function (): Function {
      return (value: string): boolean => {
        return value.length === 0;
      }
    },
    `'{key}' must be an empty string`
  ),

  // Checks to see if the string is at least as long as a set value
  minLength: new Rule('minLength',
    function (limit: number): Function {
      if(!limit)
        throw Error(`Rule 'minLength' requires a number as input`);

      return (value: string): boolean => {
        return value.length >= limit;
      }
    },
    `'{key}' must be at least {arg0} characters long`
  ),

  // Checks to see if the string is at most as long as a set value
  maxLength: new Rule('maxLength',
    function (limit: number): Function {
      if(!limit)
        throw Error(`Rule 'maxLength' requires a number as input`);

      return (value: string): boolean => {
        return value.length <= limit;
      }
    },
    `'{key}' must be at most {arg0} characters long`
  ),

  // Checks to see if the string matches a set regex pattern
  matches: new Rule('matches',
    function (regex: string): Function {
      if(!regex)
        throw Error(`Rule 'matches' requires a regex string as input`);

      return (value: string): boolean => {
        return (value.match(`^(${regex})$`) || []).length > 0;
      }
    },
    `'{key}' must match the format {arg0}`
  ),

  // Checks to see if the string contains only numeric characters
  isNumeric: new Rule('isNumeric',
    function (): Function {
      return (value: string): boolean => {
        return !Number.isNaN(Number(value));
      }
    },
    `'{key}' must be numeric`
  ),

  // Checks to see if the string contains only alphanumeric characters
  isAlphaNumeric: new Rule('isAlphaNumeric',
    function (): Function {
      return (value: string): boolean => {
        return (value.match("^([A-Za-z0-9]*)$") || []).length > 0;
      }
    },
    `'{key}' must be alphanumeric`
  ),

  // Checks to see if the string contains only alphabetical characters
  isAlpha: new Rule('isAlpha',
    function (): Function {
      return (value: string): boolean => {
        return (value.match("^([A-Za-z]*)$") || []).length > 0;
      }
    },
    `'{key}' must only contain alphabetical characters`
  ),
  
  // Checks to see if the string contains only uppercase characters
  isUpperCase: new Rule('isUpperCase',
    function (): Function {
      return (value: string): boolean => {
        return (value.match("^([A-Z]*)$") || []).length > 0;
      }
    },
    `'{key}' must only contain uppercase characters`
  ),
  
  // Checks to see if the string contains only lowercase characters
  isLowerCase: new Rule('isLowerCase',
    function (): Function {
      return (value: string): boolean => {
        return (value.match("^([a-z]*)$") || []).length > 0;
      }
    },
    `'{key}' must only contain lowercase characters`
  )
};

StringRules.__proto__ = BaseRules;

export default StringRules;