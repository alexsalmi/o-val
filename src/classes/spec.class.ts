import rules, { types } from "rules/index.js";
import Schema, { ArraySchema } from "classes/schema.class.js";

/** @class Spec class to specify rules for a specific key in a Schema*/
export default class Spec {
  /** @type {string} The key in the Schema that this spec corresponds to */
  #key: string

  /** @type {string} The type of the value stored at this key */
  type: string

  /** @type {SpecRule[]} A list of Rules that the value at this key needs to adhere to */
  rules: SpecRule[] = [];

  /** @type {Schema} (optional) If this spec is for an object or array field, this value will store the children's Schema */
  children?: Schema

  /** @type {SpecRange} (optional) If this spec is part of an array field, this value will store the range of values this spec should apply to */
  range?: SpecRange
  

  /**
   * @constructor
   * 
   * @param {string} key 
   * @param inputSpec 
   * @param range 
   */
  constructor(key: string, inputSpec: InputSpec, range?: SpecRange) { 
    this.#key = key;
    this.range = range;

    let inputRules: (string | InputSpecs)[];
    
    this.#validateInput(inputSpec);

    // Get the type and list of rules, based on if input was provided as a string or array
    if (typeof inputSpec === 'string') {
      this.type = inputSpec;
      inputRules = [inputSpec];
    } else {
      this.type = inputSpec[0] as string;
      inputRules = inputSpec;      
    }

    // If this spec is for an object type, get the last element of the input and initialize the the nested object Schema specs
    if (this.type === 'object') {
      let nestedSpecs = inputRules.pop() as InputSpecs;
      this.children = new Schema(nestedSpecs, `${key}.`);
    }

    // If this spec is for an array type, get the last element of the input and initialize the the nested object Schema specs
    if (this.type === 'array') {
      let nestedSpecs = inputRules.pop() as InputSpecs;
      this.children = new ArraySchema(nestedSpecs, `${key}`);
    }

    // Get the RuleSet for this type and initialize the key as required
    let typeRules: RuleSet = rules[this.type];
    let requiredOrOptional: string = 'required';

    // Loop through the list of rules provided, and append SpecRules to the rules array for each
    for (const str of inputRules) {
      if (typeof str !== 'string')
        throw Error(`Rule provided for key '${key}' is not of type 'string'`);

      if (str === 'optional' || str === 'required') {
        requiredOrOptional = str;
        continue;
      }

      this.rules.push(new SpecRule(str, typeRules))
    }

    // Add required/optional rule as the first rule in the rules array
    this.rules.unshift(new SpecRule(requiredOrOptional, typeRules));
  }

  /**
   * Validates the format of the InputSpec before beginning to convert to Specs
   * 
   * @param {InputSpec} inputSpec Specifications provided by user
   */
  #validateInput = (inputSpec: InputSpec) => {
    // Input needs to be provided as an array or a single string
    if (!Array.isArray(inputSpec) && typeof inputSpec !== 'string')
      throw Error(`Invalid specifications for key ${this.#key}`);

    // Input validations if input is array
    if (Array.isArray(inputSpec)) {
      // Cannot be an empty array
      if (inputSpec.length === 0)
        throw Error(`Type is required for key '${this.#key}`);

      // Type (first element of array) needs to be provided as a string
      if (typeof inputSpec[0] !== 'string')
        throw Error(`Invalid type specification for key '${this.#key}'`);

      // Ensure the provided type is a valid type
      if (!types.includes(inputSpec[0]))
        throw Error(`Type '${inputSpec[0]}' does not exist for key '${this.#key}'`);

      // If the type is object or array, an Object needs to be provided as the last element for the nested Specs
      if ((inputSpec[0] === 'object' || inputSpec[0] === 'array') && typeof inputSpec.slice(-1)[0] !== 'object') 
        throw Error(`Nested object must be provided for key '${this.#key}' of type '${inputSpec[0]}'`);
    }

    // Input validations if input is string
    if (typeof inputSpec === 'string') {
      // Ensure the provided type is a valid type
      if (!types.includes(inputSpec))
        throw Error(`Type '${inputSpec}' does not exist for key '${this.#key}'`);

      // If the type is object or array, the input must be provided as an array
      if (inputSpec === 'object' || inputSpec === 'array')
        throw Error(`Must provide rules in an array for key '${this.#key} of type '${inputSpec}'`);
    }
  }
}

/** @class SpecRule class for defining a specific rule within a Spec */
class SpecRule {
  /** @type {Function} The function that needs to be applied to a value to determine if the value passes this rule */
  ruleFn: Function

  /** @type {Function} The function that needs to be applied to a key/value pair to get the corresponding error message */
  getErrorMsg: Function


  /**
   * @constructor
   * 
   * @param {string} ruleName The name of the rule that needs to be enforced
   * @param {string} rules The RuleSet where we are getting the rule and error functions from
   */
  constructor(ruleName: string, rules: RuleSet) {
    let args: string[] = [];

    // If input arguments were provided for the rule, get the argument list
    if (ruleName.includes('=')) {
      let split = ruleName.split("=");
      ruleName = split[0];
      args = split[1].split(",");
    }

    // If the rule doesn't exist in the RuleSet, throw an error
    if (!rules[ruleName])
      throw Error(`Invalid rule '${ruleName}'`);

    // Get the rule and error functions, passing any provided arguments
    this.ruleFn = rules[ruleName].getFunc(...args);
    this.getErrorMsg = rules[ruleName].getErrorMsg(...args);
  }
}
