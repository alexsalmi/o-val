import Rule from "classes/rule.class.js";
import BaseRules from "rules/base.rules.js"

const ArrayRules: RuleSet = {
  array: new Rule('array',
    function (arr: Array<any>): boolean {
      return Array.isArray(arr);
    },
    `'{key}' must be an array`
  ),

  notEmpty: new Rule('notEmpty',
    function (arr: Array<any>): boolean {
      return arr.length > 0;
    },
    `'{key}' must not be an empty array`
  ),

  minLength: new Rule('minLength',
    function (limit: number): Function {
      return (arr: Array<any>): boolean => {
        return arr.length >= limit;
      }
    },
    `'{key}' must contain at least {arg0} elements`
  ),

  maxLength: new Rule('maxLength',
    function (limit: number): Function {
      return (arr: Array<any>): boolean => {
        return arr.length <= limit;
      }
    },
    `'{key}' must not contain more than {arg0} elements`
  ),

  exactLength: new Rule('exactLength',
    function (limit: number): Function {
      return (arr: Array<any>): boolean => {
        return arr.length === limit;
      }
    },
    `'{key}' must contain exactly {arg0} elements`
  ),
}

ArrayRules.__proto__ = BaseRules;

export default ArrayRules;