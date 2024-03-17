
/**
 * @class Rule class to keep track of the different rules that can be added to each field in the Schema
 */
export default class Rule {
  /** @private  @type {string} The name of the Rule */
  #name: string
  
  /** @private @type {Function} The function which enforces the Rule */
  #fn: Function
  
  /** @private @type {string} The format of the error message that is returned if the rule fails */
  #errorMsg: string

  /** 
   * @constructor 
   * 
   * @param {string} name The name of the Rule
   * @param {Function} fn The function which enforces the Rule
   * @param {string} errorMsg The format of the error message that is returned if the rule fails
   * */
  constructor(name: string, fn: Function, errorMsg: string) {
    this.#name = name;
    this.#fn = fn;
    this.#errorMsg = errorMsg;
  }

  /**
   * Gets the function which enforces the Rule, injecting any arguments passed
   * 
   * @param {string[]} args (optional) - The arguments required for the rule to run
   * @returns {Function} The function which enforces the Rule with arguments injected
   */
  getFunc = (...args: string[]): Function => {
    // If arguments are given, apply them to the function and return the function which is returned
    if (args.length > 0)
      return this.#fn(...args);

    // If no arguments are given, return the function as is
    return this.#fn;
  }

  /**
   * Gets the function which creates the error message, injecting any arguments passed
   * 
   * @param {any[]} args (optional) - The arguments required for the rule to run which appear in the error message
   * @returns {Function} The function which creates the error message with a specific key and value
   */
  getErrorMsg = (...args: any[]): Function => {
    // Inject the rule name, list of arguments, and individual arguments into the error message
    let err = this.#errorMsg;
    err = err.replace('{rule}', `${this.#name}`);
    err = err.replace('{args}', `${args.join(', ')}`);
    for (const ind in args) {
      err = err.replace(`{arg${ind}}`, args[ind]);
    }

    // Return a function which accepts the key and value of an object being Validated, and returns the error message with those values replaced
    return function (key: string, val: any): string {
      return err.replace('{key}', key).replace('{value}', val);
    }
  }
}
