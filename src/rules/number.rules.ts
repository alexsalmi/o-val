import Rule from "classes/rule.class.js";
import BaseRules from "rules/base.rules.js";

const NumberRules: RuleSet = {
  // Checks that the value passed is a number
  number: new Rule('number',
    function (): Function {
      return (value: number): boolean => {
        return typeof value === 'number';
      }
    },
    `'{key}' must be of type 'number'`
  ),

  // Checks that the value is at least a set number
  minValue: new Rule('minValue',
    function (limit: number): Function {
      return function (value: number): boolean {
        return value >= limit;
      }
    },
    `'{key}' must be {arg0} or greater`
  ),

  // Checks that the value is at most a set number
  maxValue: new Rule('maxValue',
    function (limit: number): Function {
      return function (value: number): boolean {
        return value <= limit;
      }
    },
    `'{key}' must be {arg0} or less`
  ),

  // Checks that the value is between two set numbers
  isBetween: new Rule('isBetween',
    function (...args: number[]): Function {
      let [lowerLimit, upperLimit] = args;
      return function (value: number): boolean {
        return value >= lowerLimit && value <= upperLimit;
      }
    },
    `'{key}' must be between {arg0} and {arg1}`
  ),

  // Checks that the value is an integer
  isInt: new Rule('isInt',
    function (): Function {
      return (value: number): boolean => {
        return Number.isInteger(value);
      }
    },
    `'{key}' must be an integer`
  ),

  // Checks that the value is a decimal
  isDecimal: new Rule('isDecimal',
    function (): Function {
      return (value: number): boolean => {
        return value.toString().includes('.');
      }
    },
    `'{key}' must be a decimal`
  )
};

NumberRules.__proto__ = BaseRules;

export default NumberRules;