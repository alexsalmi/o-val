import Spec from "./spec.class.js";

export default class Schema {
  specs: SpecObj = {};

  constructor(input: InputSpecs, path: string = '') {
    this.addSpecs(input, path);
  }

  addSpecs(input: InputSpecs, path: string = '') {
    for (const key of Object.keys(input)) {
      if (this.specs[key])
        throw Error(`Key '${path}${key}' already exists`);

      this.specs[key] = new Spec(`${path}${key}`, input[key]);
    }
  }
}

export class ArraySchema {
  specs: SpecObj = {};

  constructor(input: InputSpecs, path: string) {
    this.addSpecs(input, path);
  }

  addSpecs(input: InputSpecs, path: string) {
    for (const key of Object.keys(input)) {
      let specRange: SpecRange = this.#getSpecRange(key, path);

      if (this.specs[key])
        throw Error(`Key '${path}${key}' already exists`);

      this.specs[key] = new Spec(`'${path}${key}'`, input[key], specRange);
    }
  }

  #getSpecRange = (key: string, path: string): SpecRange => {
    let range: string[] = key.replace('[', '').replace(']', '').split(',');

    if (range.length === 1 && range[0] === '*')
      return [0, -1];

    if (range.length === 1 && Number.isInteger(range[0]))
      return [Number(range[0]), Number(range[0])];

    if (range.length === 2 && Number.isInteger(range[0]) && Number.isInteger(range[1])
      && (Number(range[0]) <= Number(range[1])))
      return [Number(range[0]), Number(range[1])];

    throw Error(`Key '${path}' contains invalid range '${key}'`);
  }
}