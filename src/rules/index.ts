import ArrayRules from "rules/array.rules.js";
import NumberRules from "rules/number.rules.js";
import ObjectRules from "rules/object.rules.js";
import StringRules from "rules/string.rules.js";

const rules: RuleSetCollection = {
  string: StringRules,
  number: NumberRules,
  object: ObjectRules,
  array: ArrayRules
}

export const types: string[] = Object.keys(rules);

export default rules;