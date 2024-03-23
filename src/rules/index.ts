import ArrayRules from "rules/array.rules.js";
import NumberRules from "rules/number.rules.js";
import ObjectRules from "rules/object.rules.js";
import StringRules from "rules/string.rules.js";
import BooleanRules from "./boolean.rules.js";
import DateRules from "./date.rules.js";
import EmailRules from "./email.rules.js";
import PhoneRules from "./phone.rules.js";
import UrlRules from "./url.rules.js";

const rules: RuleSetCollection = {
  string: StringRules,
  number: NumberRules,
  object: ObjectRules,
  array: ArrayRules,
  boolean: BooleanRules,
  date: DateRules,
  email: EmailRules,
  phone: PhoneRules,
  url: UrlRules
}

export const types: string[] = (() => Object.keys(rules))();

export default rules;