import Rule from "classes/rule.class.js";

const BaseRules: RuleSet = {
  // Checks that the required value passed is preset
  required: new Rule('required',
    function (): Function {
      return (value: any): boolean => {
        return value !== undefined && value !== null;
      }
    },
    `'{key}' is required`
  ),

  // Checks if the optional value passed is preset
  optional: new Rule('optional',
    function (): Function {
      return (value: any): boolean => {
        return value !== undefined && value !== null;
      }
    },
    ''
  ),

  // Checks that the value passed is in a set list of values
  isIn: new Rule('isIn',
    function (...items: any[]) {
      return (value: any): boolean => {
        return items.includes(value.toString());
      }
    },
    `'{key}' must be one of [{args}]`
  )
};

export default BaseRules;