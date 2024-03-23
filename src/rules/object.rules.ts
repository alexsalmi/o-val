import Rule from "classes/rule.class.js";
import BaseRules from "rules/base.rules.js"

const ObjectRules: RuleSet = {
  // Checks that the value passed is an object
  object: new Rule('object',
    function (): Function {
      return (obj: object): boolean => {
        return typeof obj === 'object';
      }
    },
    `'{key}' must be an object`
  ),

  // Checks to see if the object is empty
  notEmpty: new Rule('notEmpty',
    function (): Function {
      return (obj: object): boolean => {
        return Object.keys(obj).length > 0;
      }
    },
    `'{key}' must not be an empty object`
  ) 
}

ObjectRules.__proto__ = BaseRules;

export default ObjectRules;