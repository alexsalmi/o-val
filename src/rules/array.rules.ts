import Rule from "classes/rule.class.js";
import BaseRules from "rules/base.rules.js"

const ArrayRules: RuleSet = {
  // Checks that the value passed is an array
  array: new Rule('array',
    function (): Function {
      return (arr: Array<any>): boolean => {
        return Array.isArray(arr);
      }
    },
    `'{key}' must be an array`
  ),

  // Checks that the array is not empty
  notEmpty: new Rule('notEmpty',
    function (): Function {
      return (arr: Array<any>): boolean => {
        return arr.length > 0;
      }
    },
    `'{key}' must not be an empty array`
  ),

  // Checks that the array has a minimum value of 'limit'
  minLength: new Rule('minLength',
    function (limit: number): Function {
      return (arr: Array<any>): boolean => {
        return arr.length >= limit;
      }
    },
    `'{key}' must contain at least {arg0} elements`
  ),

  // Checks that the array has a maximum value of 'limit'
  maxLength: new Rule('maxLength',
    function (limit: number): Function {
      return (arr: Array<any>): boolean => {
        return arr.length <= limit;
      }
    },
    `'{key}' must not contain more than {arg0} elements`
  ),

  // Checks that the array has an exact length of 'length'
  exactLength: new Rule('exactLength',
    function (length: number): Function {
      return (arr: Array<any>): boolean => {
        return arr.length == length;
      }
    },
    `'{key}' must contain exactly {arg0} elements`
  ),
}

ArrayRules.__proto__ = BaseRules;

export default ArrayRules;