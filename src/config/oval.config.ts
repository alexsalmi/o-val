import rules from "../rules/index.js";
import BaseRules from "../rules/base.rules.js";
import Rule from "../classes/rule.class.js";

const config = {
  addType: (name : string) => {
    rules[name] = {};
    rules[name].__proto__ = BaseRules;
  },

  addRule: (type : string, name : string, fn : Function) => {
    rules[type][name] = new Rule('name', fn);
  }
}

export default config;