import Rule from "classes/rule.class.js";
import BaseRules from "rules/base.rules.js";

const NumberRules: RuleSet = {
  number: new Rule('number',
    function (value: number): boolean {
      return typeof value === 'number';
    },
    `'{key}' must be of type 'number'`
  ),

  minValue: new Rule('minValue',
    function (limit: number): Function {
      return function (value: number): boolean {
        return value >= limit;
      }
    },
    `'{key}' must be {arg0} or greater`
  ),

  maxValue: new Rule('maxValue',
    function (limit: number): Function {
      return function (value: number): boolean {
        return value <= limit;
      }
    },
    `'{key}' must be {arg0} or less`
  ),

  isBetween: new Rule('isBetween',
    function (...args: number[]): Function {
      let [lowerLimit, upperLimit] = args;
      return function (value: number): boolean {
        return value >= lowerLimit && value <= upperLimit;
      }
    },
    `'{key}' must be between {arg0} and {arg1}`
  ),

  isInt: new Rule('isInt',
    function (value: number): boolean {
      return Number.isInteger(value);
    },
    `'{key}' must be an integer`
  ),

  isDecimal: new Rule('isDecimal',
    function (value: number): boolean {
      return value.toString().includes('.');
    },
    `'{key}' must be a decimal`
  ) 


};
NumberRules.__proto__ = BaseRules;

export default NumberRules;