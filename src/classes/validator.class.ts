import Schema from "classes/schema.class.js";
import Spec from "classes/spec.class.js";

class Validator {
  #schema: Schema;
  strict: boolean = false;

  constructor(input: InputSpecs) {
    this.#schema = new Schema(input);
  }
  
  validate = (obj: InputObj): ValidationResponse => {
    return this.#validateObject(obj, this.#schema.specs);
  }

  #validateObject = (obj: InputObj, specs: SpecObj, path: string = ''): ValidationResponse => {
    let valid: boolean = true;
    let errors: ValidationErrors = {};
    let visited: Set<string> = new Set();

    const addError = (key: string, errorMsg: string): void => {
      valid = false;

      if (!errors[key])
        errors[key] = [];
  
      errors[key].push(errorMsg);
    }

    for (const key of Object.keys(specs)) {
      visited.add(key);
      let spec: Spec = specs[key];
      let value = obj[key];
      let fullKey: string = `${path}${key}`;

      let requiredRule = spec.rules[0];
      if (!requiredRule.ruleFn(value)) {
        let error = requiredRule.getErrorMsg(fullKey, value)
        if (error)
          addError(fullKey, error);
        continue;
      }

      let typeRule = spec.rules[1];
      if (!typeRule.ruleFn(value)) {
        addError(fullKey, typeRule.getErrorMsg(fullKey, value));
        continue;
      }

      for (const rule of spec.rules.slice(2)) {
        let rulePassed: boolean = rule.ruleFn(value);

        if (!rulePassed)
          addError(fullKey, rule.getErrorMsg(fullKey, value));
      }

      if (spec.type === 'object' && !errors[key]) {
        let nestedRes = this.#validateObject(value, spec.children!.specs, `${fullKey}.`);
        valid = valid && nestedRes.valid;
        errors = {
          ...errors,
          ...nestedRes.errors
        };
      }

      if (spec.type === 'array' && !errors[key]) {
        let nestedRes = this.#validateArray(value, spec.children!.specs, `${fullKey}`);
        valid = valid && nestedRes.valid;
        errors = {
          ...errors,
          ...nestedRes.errors
        };
      }
    }

    for (const key of Object.keys(obj)) {
      if (!visited.has(key))
        addError(path + key, `Key '${path}${key}' is not included in the specs`);
    }

    return {
      valid,
      errors
    };
  }

  #validateArray = (arr: InputArr, specs: SpecObj, path: string = ''): ValidationResponse => {
    let valid: boolean = true;
    let errors: ValidationErrors = {};
    let visited: boolean[] = Array(arr.length).fill(false);

    const addError = (key: string, errorMsg: string, reset: boolean = false): void => {
      valid = false;

      if(reset)
        errors = {};

      if (!errors[key])
        errors[key] = [];
  
      errors[key].push(errorMsg);
    }

    for (const spec of Object.values(specs)) {
      let range: SpecRange = spec.range;
      if (range[1] === -1)
        range[1] = arr.length - 1;

      for (let i = range[0]; i <= range[1]; i++){
        if (i >= arr.length) {
          addError(path, `Array at key '${path}' contains less elements than defined in the specs`, true);
          break;
        }
        visited[i] = true;
        let value = arr[i];

        let requiredRule = spec.rules[0];
        if (!requiredRule.ruleFn(value)) {
          let error = requiredRule.getErrorMsg(`${path}[${i}]`, value);
          if (error)
            addError(path, error);
          continue;
        }

        let typeRule = spec.rules[1];
        if (!typeRule.ruleFn(value)) {
          addError(path, typeRule.getErrorMsg(`${path}[${i}]`, value));
          continue;
        }

        for (const rule of spec.rules.slice(2)) {
          let rulePassed: boolean = rule.ruleFn(value);
  
          if (!rulePassed)
            addError(path, rule.getErrorMsg(`${path}[${i}]`, value));
        }

        if (spec.type === 'object' && valid) {
          let nestedRes = this.#validateObject(value, spec.children!.specs, `${path}[${i}].`);
          valid = valid && nestedRes.valid;
          errors = {
            ...errors,
            ...nestedRes.errors
          };
        }

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

    if (!visited.slice(-1)[0])
      addError(path, `Array at key '${path}' contains more elements than defined in the specs`, true);

    return {
      valid,
      errors
    };
  }
}

export default Validator;