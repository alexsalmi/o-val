import Schema from "classes/schema.class.js";
import Spec from "classes/spec.class.js";

/** @class Validator class used to validate objects against specifications */
class Validator {
  /** @type {Schema} The defined Schema that the object should be validated against */
  #schema: Schema;

  /** @type {boolean} Sets whether the Validate should operate in strict mode */
  strict: boolean = false;

  /**
   * @contrast
   * 
   * @param {IntpuSpecs} input The provided specifications which the Schema should adhere to 
   */
  constructor(input: InputSpecs) {
    this.#schema = new Schema(input);
  }
  
  /**
   * Public function which begins the validation process
   * 
   * @param {InputObj} obj The object which should be validated against the Schema
   * @returns {ValidationResponse} Response indicating whether the pbject is valid or not, and any errors
   */
  validate = (obj: InputObj): ValidationResponse => {
    return this.#validateObject(obj, this.#schema.specs);
  }

  /**
   * Validates an object against the Specifications
   * 
   * @param {InputObj} obj The object to be validated
   * @param {SpecObj} specs The specifications which the object should adhere to
   * @param {string} path (optional) The path to get to this object, if it is nested
   * @returns {ValidationResponse} Response indicating whether the object is valid or not, and any errors
   */
  #validateObject = (obj: InputObj, specs: SpecObj, path: string = ''): ValidationResponse => {
    let valid: boolean = true;
    let errors: ValidationErrors = {};

    // Helper function to add an error to the error object
    const addError = (key: string, errorMsg: string): void => {
      valid = false;

      if (!errors[key])
        errors[key] = [];
  
      errors[key].push(errorMsg);
    }

    // Loop through the keys in the Specs for this object
    for (const key of Object.keys(specs)) {
      let spec: Spec = specs[key];
      let value = obj[key];
      let fullKey: string = `${path}${key}`;

      // The required/optional rule will always be the first rule in the specs
      let requiredRule = spec.rules[0];
      if (!requiredRule.ruleFn(value)) {
        let error = requiredRule.getErrorMsg(fullKey, value);

        // If no error was returned, no need to add it. This is needed for the 'optional' rule, 
        // no error should be added if a key is optional and is not included in the object
        if (error)
          addError(fullKey, error);
        continue;
      }

      // The type rule will always be the second rule in the specs
      let typeRule = spec.rules[1];
      if (!typeRule.ruleFn(value)) {
        addError(fullKey, typeRule.getErrorMsg(fullKey, value));
        continue;
      }

      // Loop through the rest of the rules and capture any errors that may get triggered
      for (const rule of spec.rules.slice(2)) {
        let rulePassed: boolean = rule.ruleFn(value);

        if (!rulePassed)
          addError(fullKey, rule.getErrorMsg(fullKey, value));
      }

      // If this key is specified to be an object, recursively call #validateObject to validate the nested object
      if (spec.type === 'object' && !errors[key]) {
        let nestedRes = this.#validateObject(value, spec.children!.specs, `${fullKey}.`);
        valid = valid && nestedRes.valid;
        errors = {
          ...errors,
          ...nestedRes.errors
        };
      }

      // If this key is specified to be an array, recursively call #validateArray to validate the nested array
      if (spec.type === 'array' && !errors[key]) {
        let nestedRes = this.#validateArray(value, spec.children!.specs, `${fullKey}`);
        valid = valid && nestedRes.valid;
        errors = {
          ...errors,
          ...nestedRes.errors
        };
      }
    }

    // If strict mode is enabled, check to see if any extra keys was included in the object that wasn't included in the specs
    if (this.strict) {
      for (const key of Object.keys(obj)) {
        if (specs[key] === undefined)
          addError(path + key, `Key '${path}${key}' is not included in the specs`);
      }
    }

    return {
      valid,
      errors
    };
  }

  /**
   * Validates an array against the Specifications
   * 
   * @param {InputArr} arr The array to be validated
   * @param {SpecObj} specs The specifications which the object should adhere to
   * @param {string} path The path to get to this object, if it is nested
   * @returns {ValidationResponse} Response indicating whether the array is valid or not, and any errors
   */
  #validateArray = (arr: InputArr, specs: SpecObj, path: string = ''): ValidationResponse => {
    let valid: boolean = true;
    let errors: ValidationErrors = {};
    let maxInd: number = 0;

    // Helper function to add an error to the error object
    const addError = (key: string, errorMsg: string, reset: boolean = false): void => {
      valid = false;

      if(reset)
        errors = {};

      if (!errors[key])
        errors[key] = [];
  
      errors[key].push(errorMsg);
    }

    // Loop through the specs for this array
    for (const spec of Object.values(specs)) {
      // Get the range of indices that this spec applies to
      let range: SpecRange = [...spec.range] as SpecRange;
      if (range[1] === -1)
        range[1] = arr.length - 1;

      // If strict mode is enabled, and this spec applies to indices longer than the inputted array, return error
      if (this.strict && range[1] >= arr.length) {
        addError(path, `Array at key '${path}' contains less elements than defined in the specs`, true);
        break;
      }

      maxInd = Math.max(maxInd, range[1]);

      for (let i = range[0]; i <= range[1]; i++){
        let value = arr[i];

        // The required/optional rule will always be the first rule in the specs
        let requiredRule = spec.rules[0];
        if (!requiredRule.ruleFn(value)) {
          let error = requiredRule.getErrorMsg(`${path}[${i}]`, value);

          // If no error was returned, no need to add it. This is needed for the 'optional' rule, 
          // no error should be added if a key is optional and is not included in the object
          if (error)
            addError(path, error);
          continue;
        }

        // The type rule will always be the second rule in the specs
        let typeRule = spec.rules[1];
        if (!typeRule.ruleFn(value)) {
          addError(path, typeRule.getErrorMsg(`${path}[${i}]`, value));
          continue;
        }

        // Loop through the rest of the rules and capture any errors that may get triggered
        for (const rule of spec.rules.slice(2)) {
          let rulePassed: boolean = rule.ruleFn(value);
  
          if (!rulePassed)
            addError(path, rule.getErrorMsg(`${path}[${i}]`, value));
        }

        // If this index is specified to be an object and we haven't encountered any errors yet, 
        // recursively call #validateObject to validate the nested object
        if (spec.type === 'object' && valid) {
          let nestedRes = this.#validateObject(value, spec.children!.specs, `${path}[${i}].`);
          valid = valid && nestedRes.valid;
          errors = {
            ...errors,
            ...nestedRes.errors
          };
        }

        // If this index is specified to be an array and we haven't encountered any errors yet, 
        // recursively call #validateArray to validate the nested array
        if (spec.type === 'array' && valid) {
          let nestedRes = this.#validateArray(value, spec.children!.specs, `${path}[${i}]`);
          valid = valid && nestedRes.valid;
          errors = {
            ...errors,
            ...nestedRes.errors
          };
        }
      }
    }

    // If strict mode is enabled, and this spec applies only to indices shorter than the inputted array, return error
    if (this.strict && maxInd < arr.length-1)
      addError(path, `Array at key '${path}' contains more elements than defined in the specs`, true);

    return {
      valid,
      errors
    };
  }
}

export default Validator;