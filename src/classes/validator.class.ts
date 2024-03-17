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

      let requiredCheck = spec.checks[0];
      if (!requiredCheck.checkFn(value)) {
        let error = requiredCheck.getErrorMsg(fullKey, value)
        if (error)
          addError(fullKey, error);
        continue;
      }

      let typeCheck = spec.checks[1];
      if (!typeCheck.checkFn(value)) {
        addError(fullKey, typeCheck.getErrorMsg(fullKey, value));
        continue;
      }

      for (const check of spec.checks.slice(2)) {
        let checkPassed: boolean = check.checkFn(value);

        if (!checkPassed)
          addError(fullKey, check.getErrorMsg(fullKey, value));
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

        let requiredCheck = spec.checks[0];
        if (!requiredCheck.checkFn(value)) {
          let error = requiredCheck.getErrorMsg(`${path}[${i}]`, value);
          if (error)
            addError(path, error);
          continue;
        }

        let typeCheck = spec.checks[1];
        if (!typeCheck.checkFn(value)) {
          addError(path, typeCheck.getErrorMsg(`${path}[${i}]`, value));
          continue;
        }

        for (const check of spec.checks.slice(2)) {
          let checkPassed: boolean = check.checkFn(value);
  
          if (!checkPassed)
            addError(path, check.getErrorMsg(`${path}[${i}]`, value));
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