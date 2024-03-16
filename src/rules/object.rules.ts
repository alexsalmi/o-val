import Rule from "../classes/rule.class.js";
import BaseRules from "./base.rules.js"

const ObjectRules: RuleSet = {
  object: new Rule('object',
    function (obj: object): boolean {
      return typeof obj === 'object';
    },
    `'{key}' must be an object`
  ),

  notEmpty: new Rule('notEmpty',
    function (obj: object): boolean {
      return Object.keys(obj).length > 0;
    },
    `'{key}' must not be an empty object`
  ) 
}

ObjectRules.__proto__ = BaseRules;

export default ObjectRules;