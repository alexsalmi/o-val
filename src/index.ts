import Schema from "./classes/schema.class.js";
import Validator from "./classes/validator.class.js";

const validator = new Validator({
  name: ['string', 'minLength=5'],
  obj: ['object', {
    age: ['number', 'maxValue=24'],
    obj: ['object', 'notEmpty', {
      name: ['string', 'optional', 'isAlpha']
    }]
  }],
  arr: ['array', {
    '[0,1]': ['number', 'maxValue=0']
  }]
});



console.log(validator.validate({
  name: 'Alexander',
  obj: {
    age: 18,
    obj: {
      name: 'world'
    }
  },
  arr: [1,2,5]
}));