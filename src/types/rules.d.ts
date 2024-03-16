type Rule = {
  getFunc: Function,
  setErrorMsg: Function,
  getErrorMsg: Function,
}

type RuleSet = {
  [name: string]: Rule
  __proto__?: RuleSet
}

type RuleSetCollection = {
  [name: string]: RuleSet
}
