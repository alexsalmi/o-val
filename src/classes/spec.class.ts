import rules, { types } from "rules/index.js";
import Schema, { ArraySchema } from "classes/schema.class.js";

export default class Spec {
  #key: string
  type: string
  checks: SpecCheck[] = [];
  children?: Schema
  range?: SpecRange
  
  constructor(key: string, inputSpec: InputSpec, range?: SpecRange) { 
    this.#key = key;
    this.range = range;

    let inputChecks: (string | InputSpecs)[];
    
    this.#validateInput(inputSpec);

    if (typeof inputSpec === 'string') {
      this.type = inputSpec;
      inputChecks = [inputSpec];
    } else {
      this.type = inputSpec[0] as string;
      inputChecks = inputSpec;      
    }

    if (this.type === 'object') {
      let nestedSpecs = inputChecks.pop() as InputSpecs;
      this.children = new Schema(nestedSpecs, `${key}.`);
    }

    if (this.type === 'array') {
      let nestedSpecs = inputChecks.pop() as InputSpecs;
      this.children = new ArraySchema(nestedSpecs, `${key}`);
    }

    let typeRules: RuleSet = rules[this.type];
    let requiredOrOptional: string = 'required';

    for (const str of inputChecks) {
      if (typeof str !== 'string')
        throw Error(`Rule provided for key '${key}' is not of type 'string'`);

      if (str === 'optional' || str === 'required') {
        requiredOrOptional = str;
        continue;
      }

      this.checks.push(new SpecCheck(str, typeRules))
    }

    // Add required check as first rule
    this.checks.unshift(new SpecCheck(requiredOrOptional, typeRules));
  }

  #validateInput = (inputSpec: InputSpec) => {
    if (!Array.isArray(inputSpec) && typeof inputSpec !== 'string')
      throw Error(`Invalid specifications for key ${this.#key}`);

    if (Array.isArray(inputSpec)) {
      if (inputSpec.length === 0)
        throw Error(`Type is required for key '${this.#key}`);

      if (typeof inputSpec[0] !== 'string')
        throw Error(`Invalid type specification for key '${this.#key}'`);

      if (!types.includes(inputSpec[0]))
        throw Error(`Type ${inputSpec[0]} does not exist for key '${this.#key}'`);

      if ((inputSpec[0] === 'object' || inputSpec[0] === 'array') && typeof inputSpec.slice(-1)[0] !== 'object') 
        throw Error(`Nested object must be provided for key '${this.#key}' of type '${inputSpec[0]}'`);
    }

    if (typeof inputSpec === 'string') {
      if (!types.includes(inputSpec))
        throw Error(`Invalid type provided for key ${this.#key}`);

      if (inputSpec === 'object' || inputSpec === 'array')
        throw Error(`Must provide rules in an array for key '${this.#key} of type ${inputSpec}'`);
    }
  }
}

class SpecCheck {
  checkFn: Function
  getErrorMsg: Function

  constructor(ruleName: string, rules: RuleSet) {
    let args: string[] = [];

    if (ruleName.includes('=')) {
      let split = ruleName.split("=");
      ruleName = split[0];
      args = split[1].split(",");
    }

    if (!rules[ruleName])
      throw Error(`Invalid rule ${ruleName}`);

    if(args.length > 0) {
      this.checkFn = rules[ruleName].getFunc(...args);
      this.getErrorMsg = rules[ruleName].getErrorMsg(...args);
    }
    else {
      this.checkFn = rules[ruleName].getFunc();
      this.getErrorMsg = rules[ruleName].getErrorMsg();
    }
  }
}
