import Spec from "classes/spec.class.js";

/** Schema class to define the object schema that needs to be followed for a Validator instance */
export default class Schema {
  /** The object containing the expected keys and the rules each key's value needs to adhere to */
  specs: SpecObj = {};

  
  constructor(input: InputSpecs, path: string = '') {
    this.addSpecs(input, path);
  }

  /** Adds a new set of Specs to the Schema's SpecObj */
  addSpecs(input: InputSpecs, path: string = '') {
    for (const key of Object.keys(input)) {
      // If the key already exists in our existing specs, throw an error
      if (this.specs[key])
        throw Error(`Key '${path}${key}' already exists`);

      // Add the new spec to the SpecObj
      this.specs[key] = new Spec(`${path}${key}`, input[key]);
    }
  }
}


/** ArraySchema class to define the array schema that needs to be followed for a Validator instance */
export class ArraySchema{
  /** The object containing the expected keys and the rules each key's value needs to adhere to */
  specs: SpecObj = {};


  constructor(input: InputSpecs, path: string) {
    this.addSpecs(input, path);
  }

  /** Adds a new set of Specs to the Schema's SpecObj */
  addSpecs(input: InputSpecs, path: string) {
    for (const key of Object.keys(input)) {
      // If the key already exists in our existing specs, throw an error
      if (this.specs[key])
        throw Error(`Key '${path}${key}' already exists`);

      // Get the range of indices in the array this spec will apply to and add the new spec to the SpecObj
      let specRange: SpecRange = this.#getSpecRange(key, path);
      this.specs[key] = new Spec(`'${path}${key}'`, input[key], specRange);
    }
  }

  /** Gets the range of indices in the array this spec will apply to */
  #getSpecRange = (key: string, path: string): SpecRange => {
    // Convert the key to an array of numbers, if possible. Elements that cannot be converted to integers will remain as strings
    let rangeArr: (number | string)[] = key.replace('[', '').replace(']', '').split(',');
    let range = rangeArr.map(val => {
          return Number.isInteger(Number(val)) && val !== '' ? Number(val) : val;
        });

    // If the range provided is [*], spec should apply to entire array
    if (range.length === 1 && range[0] === '*')
      return [0, -1];

    // If the range provided only contains one index, spec should apply to only that index
    if (range.length === 1 && Number.isInteger(range[0]))
      return [range[0] as number, range[0] as number];

    // If the range provided only contains two indices, spec should apply to indices in that range
    if (range.length === 2 && Number.isInteger(range[0]) && Number.isInteger(range[1]) && (range[0] <= range[1]))
      return [range[0] as number, range[1] as number];

    // If none of the above conditionals were true, the provided range is invalid, throw error
    throw Error(`Key '${path}' contains invalid range '${key}'`);
  }
}