type InputObj = {
  [key: string]: any
}

type InputArr = any[];

type ValidationResponse = {
  valid: boolean,
  errors: ValidationErrors
}

type ValidationErrors = {
  [key: string]: string[]  
}
