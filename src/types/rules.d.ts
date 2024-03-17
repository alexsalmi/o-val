type Rule = {
  getFunc: Function,
  getErrorMsg: Function,
}

type RuleSet = {
  [name: string]: Rule
  __proto__?: RuleSet
}

type RuleSetCollection = {
  [name: string]: RuleSet
}
