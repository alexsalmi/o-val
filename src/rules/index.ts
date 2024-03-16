import ArrayRules from "./array.rules.js";
import NumberRules from "./number.rules.js";
import ObjectRules from "./object.rules.js";
import StringRules from "./string.rules.js";

const rules: RuleSetCollection = {
  string: StringRules,
  number: NumberRules,
  object: ObjectRules,
  array: ArrayRules
}

export const types: string[] = Object.keys(rules);

export default rules;