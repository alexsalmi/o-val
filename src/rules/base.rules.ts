import Rule from "classes/rule.class.js";

const BaseRules: RuleSet = {
  // not: (value: any): boolean => {
  //   return !value;
  // },
  required: new Rule('required',
    function (): Function {
      return (value: any): boolean => {
        return value !== undefined && value !== null;
      }
    },
    `'{key}' is required`
  ),

  optional: new Rule('optional',
    function (): Function {
      return (value: any): boolean => {
        return value !== undefined && value !== null;
      }
    },
    ''
  ),

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