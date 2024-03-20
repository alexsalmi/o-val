import BaseRules from "rules/base.rules.js";
import rules from "rules/index.js";
import Rule from "classes/rule.class.js";

/** @class Config class add types and rules as needed */
export default class OValConfig {
  /**
   * Adds a new type, with the option to have the new type inherit the rules of an existing type
   * 
   * @param {string} name The name of the new type
   * @param {string} proto (optional) The name of the type the new type should inherit from 
   */
  addType = (name: string, proto?: string) => {
    if (rules[name])
      throw Error(`Type '${name}' already exists`);

    if (proto && !rules[proto])
      throw Error(`Type '${proto}' doesn't exist, can't inherit from it`);

    rules[name] = {};
    rules[name].__proto__ = proto ? rules[proto] : BaseRules;
  }

  /**
   * Adds a new rule to an existing type
   * 
   * @param {string} type The name of the type the new rule should be added to
   * @param {string} name The name of the new rule
   * @param {Function} fn The function which the new rule should be enforced with
   * @param {string} errorMsg The error message that should be returned if the new rule fails
   */
  addRule = (type : string, name : string, fn : Function, errorMsg: string) => {
    if (!rules[type])
      throw Error(`Type '${type}' is not an existing type`);

    if (rules[type][name])
      throw Error(`Rule '${name}' already exists on type '${type}'`);

    rules[type][name] = new Rule(name, fn, errorMsg);
  }
}