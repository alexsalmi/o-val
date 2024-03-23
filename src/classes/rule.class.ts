
/** Rule class to keep track of the different rules that can be added to each field in the Schema*/
export default class Rule {
  /** The name of the Rule */
  #name: string
  
  /** The function which enforces the Rule */
  #fn: Function
  
  /** The format of the error message that is returned if the rule fails */
  #errorMsg: string

  
  constructor(name: string, fn: Function, errorMsg: string) {
    this.#name = name;
    this.#fn = fn;
    this.#errorMsg = errorMsg;
  }

  /** Gets the function which enforces the Rule, injecting any arguments passed */
  getFunc = (...args: string[]): Function => {
    // Apply any provided args to the function and return the function which is returned
    return this.#fn(...args);
  }

  /** Gets the function which creates the error message, injecting any arguments passed */
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
