class Rule {
  #name: string
  #fn: Function
  #errorMsg: string

  constructor(name: string, fn: Function, errorMsg: string) {
    this.#name = name;
    this.#fn = fn;
    this.#errorMsg = errorMsg;
  }

  getFunc = (...args: string[]) => {
    if (args.length > 0)
      return this.#fn(args);

    return this.#fn;
  }

  setErrorMsg = (msg: string) => {
    this.#errorMsg = msg;
  }

  getErrorMsg = (...args: any[]): Function => {
    let err = this.#errorMsg;
    err = err.replace('{rule}', `${this.#name}`);
    err = err.replace('{args}', `${args.join(', ')}`);
    for (const ind in args) {
      err = err.replace(`{arg${ind}}`, args[ind]);
    }

    return function (key: string, val: any): string {
      return err.replace('{key}', key).replace('{value}', val);
    }
  }
}

export default Rule;