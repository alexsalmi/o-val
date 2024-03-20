import Validator from "classes/validator.class.js";

let validator: Validator;

describe('Validator class tests', () => {
  test('Initialize Validator successfully', () => {
    validator = new Validator({
      name: ['string', 'minLength=5']
    });

    expect(validator).not.toBeUndefined();
  })

  test('Validates valid input successfully', () => {
    const result: ValidationResponse = validator.validate({
      name: 'Alexander'
    });

    expect(result.valid).toEqual(true);
    expect(result.errors).toEqual({});
  })

  test('Catches missing required field', () => {
    const result: ValidationResponse = validator.validate({});

    expect(result.valid).toEqual(false);
    expect(result.errors.name).not.toBeUndefined();
    expect(result.errors.name).toHaveLength(1);
  })

  test('Catches incorrect type', () => {
    const result: ValidationResponse = validator.validate({
      name: 10
    });

    expect(result.valid).toEqual(false);
    expect(result.errors.name).not.toBeUndefined();
    expect(result.errors.name).toHaveLength(1);
  })

  test('Catches rule failure correctly', () => {
    const result: ValidationResponse = validator.validate({
      name: 'Alex'
    });

    expect(result.valid).toEqual(false);
    expect(result.errors.name).not.toBeUndefined();
    expect(result.errors.name).toHaveLength(1);
  })

  test('Doesnt catch extra fields if not in strict mode', () => {
    const result: ValidationResponse = validator.validate({
      name: 'Alexander',
      extra: 'field'
    });

    expect(result.valid).toEqual(true);
    expect(result.errors).toEqual({});
  })

  test('Catches extra fields if in strict mode', () => {
    validator.strict = true;

    const result: ValidationResponse = validator.validate({
      name: 'Alexander',
      extra: 'field'
    });

    expect(result.valid).toEqual(false);
    expect(result.errors.extra).toEqual([`Key 'extra' is not included in the specs`]);
  })

  test('Doesnt catch missing optional field', () => {
    validator = new Validator({
      name: ['string', 'optional', 'minLength=5']
    })
    const result: ValidationResponse = validator.validate({});

    expect(result.valid).toEqual(true);
    expect(result.errors).toEqual({});
  })

  test('Validates nested object successfully', () => {
    validator = new Validator({
      nest: ['object', 'optional', {
        name: ['string', 'minLength=5']
      }]
    });
    const result: ValidationResponse = validator.validate({
      nest: {
        name: 'Alexander'
      }
    });

    expect(result.valid).toEqual(true);
    expect(result.errors).toEqual({});
  })

  test('Catches rule failure in nested object correctly', () => {
    const result: ValidationResponse = validator.validate({
      nest: {
        name: 'Alex'
      }
    });

    expect(result.valid).toEqual(false);
    expect(result.errors['nest.name']).not.toBeUndefined();
    expect(result.errors['nest.name']).toHaveLength(1);
  })

  test('Doesnt enforce rules in missing optional nested object correctly', () => {
    const result: ValidationResponse = validator.validate({
      nest: null
    });

    expect(result.valid).toEqual(true);
    expect(result.errors).toEqual({});
  })

  test('Validates nested array successfully', () => {
    validator = new Validator({
      nest: ['array', 'optional', {
        '[*]': ['string', 'minLength=5']
      }]
    });
    const result: ValidationResponse = validator.validate({
      nest: ['Alexander', 'Alexander']
    });

    expect(result.valid).toEqual(true);
    expect(result.errors).toEqual({});
  })

  test('Catches required error in nested array correctly', () => {
    const result: ValidationResponse = validator.validate({
      nest: [null, 'Alexander']
    });

    expect(result.valid).toEqual(false);
    expect(result.errors.nest).not.toBeUndefined();
    expect(result.errors.nest).toHaveLength(1);
  })

  test('Catches type error in nested array correctly', () => {
    const result: ValidationResponse = validator.validate({
      nest: ['Alexander', 0]
    });

    expect(result.valid).toEqual(false);
    expect(result.errors.nest).not.toBeUndefined();
    expect(result.errors.nest).toHaveLength(1);
  })

  test('Catches rule failure in nested array correctly', () => {
    const result: ValidationResponse = validator.validate({
      nest: ['Alex', 'Alexander', 'Alex']
    });

    expect(result.valid).toEqual(false);
    expect(result.errors.nest).not.toBeUndefined();
    expect(result.errors.nest).toHaveLength(2);
  })

  test('Doesnt enforce rules in missing optional nested array correctly', () => {
    const result: ValidationResponse = validator.validate({
      nest: null
    });

    expect(result.valid).toEqual(true);
    expect(result.errors).toEqual({});
  })

  test('Doesnt catch too few elements in nested array if not in strict mode', () => {
    validator = new Validator({
      nest: ['array', {
        '[0,1]': ['string', 'optional', 'minLength=5']
      }]
    });

    const result: ValidationResponse = validator.validate({
      nest: ['Alexander']
    });

    expect(result.valid).toEqual(true);
    expect(result.errors).toEqual({});
  })

  test('Doesnt catch too many elements in nested array if not in strict mode', () => {
    const result: ValidationResponse = validator.validate({
      nest: ['Alexander', 'Alexander', 'Alexander']
    });

    expect(result.valid).toEqual(true);
    expect(result.errors).toEqual({});
  })

  test('Catches too few elements in nested array if not in strict mode', () => {
    validator.strict = true;
    
    const result: ValidationResponse = validator.validate({
      nest: ['Alexander']
    });

    expect(result.valid).toEqual(false);
    expect(result.errors.nest).toEqual([`Array at key 'nest' contains less elements than defined in the specs`]);
  })

  test('Catches too many elements in nested array if not in strict mode', () => {
    const result: ValidationResponse = validator.validate({
      nest: ['Alexander', 'Alexander', 'Alexander']
    });

    expect(result.valid).toEqual(false);
    expect(result.errors.nest).toEqual([`Array at key 'nest' contains more elements than defined in the specs`]);
  })

  test('Validates object nested in array correctly', () => {
    validator = new Validator({
      nest: ['array', {
        '[*]': ['object', {
          name: 'string'
        }]
      }]
    });

    const result: ValidationResponse = validator.validate({
      nest: [{
        name: 'Alexander'
      },{
        name: 'Alexander2'
      }]
    });

    expect(result.valid).toEqual(true);
    expect(result.errors).toEqual({});
  })

  test('Validates array nested in array correctly', () => {
    validator = new Validator({
      nest: ['array', {
        '[*]': ['array', {
          '[*]': 'string'
        }]
      }]
    });

    const result: ValidationResponse = validator.validate({
      nest: [
        ['Alexander'],
        ['Alexander']
      ]
    });

    expect(result.valid).toEqual(true);
    expect(result.errors).toEqual({});
  })
})