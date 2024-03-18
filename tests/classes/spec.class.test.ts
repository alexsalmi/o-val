import Spec from "classes/spec.class.js";

jest.mock('classes/schema.class.js', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {}
    }),
    ArraySchema: jest.fn().mockImplementation(() => {
      return {}
    })
  }
});

const KEY: string = 'KEY';

describe('Spec class tests', () => {
  test('Successful Spec creation with string input', () => {
    let spec: Spec = new Spec(KEY, 'string');

    expect(spec.type).toEqual('string');
    expect(spec.rules).toHaveLength(2);
    expect(spec.children).toBeUndefined();
    expect(spec.range).toBeUndefined();
  })

  test('Successful Spec creation with array input', () => {
    let spec: Spec = new Spec(KEY, ['string']);

    expect(spec.type).toEqual('string');
    expect(spec.rules).toHaveLength(2);
    expect(spec.children).toBeUndefined();
    expect(spec.range).toBeUndefined();
  })

  test('Successful Spec creation with rules', () => {
    let spec: Spec = new Spec(KEY, ['string', 'isEmpty', 'isUpperCase']);

    expect(spec.type).toEqual('string');
    expect(spec.rules).toHaveLength(4);
    expect(spec.children).toBeUndefined();
    expect(spec.range).toBeUndefined();
  })

  test('Successful Spec creation with rules requiring parameters', () => {
    let spec: Spec = new Spec(KEY, ['string', 'maxLength=5']);

    expect(spec.type).toEqual('string');
    expect(spec.rules).toHaveLength(3);
    expect(spec.children).toBeUndefined();
    expect(spec.range).toBeUndefined();
  })

  test('Successful Spec creation with optional rule', () => {
    let spec: Spec = new Spec(KEY, ['string', 'optional']);

    expect(spec.type).toEqual('string');
    expect(spec.rules).toHaveLength(2);
    expect(spec.children).toBeUndefined();
    expect(spec.range).toBeUndefined();
  })

  test('Successful Spec creation with required rule', () => {
    let spec: Spec = new Spec(KEY, ['string', 'required']);

    expect(spec.type).toEqual('string');
    expect(spec.rules).toHaveLength(2);
    expect(spec.children).toBeUndefined();
    expect(spec.range).toBeUndefined();
  })

  test('Successful Spec creation of object type', () => {
    let spec: Spec = new Spec(KEY, ['object', {}]);

    expect(spec.type).toEqual('object');
    expect(spec.rules).toHaveLength(2);
    expect(spec.children).toEqual({});
    expect(spec.range).toBeUndefined();
  })

  test('Successful Spec creation of array type', () => {
    let spec: Spec = new Spec(KEY, ['array', {}]);

    expect(spec.type).toEqual('array');
    expect(spec.rules).toHaveLength(2);
    expect(spec.children).toEqual({});
    expect(spec.range).toBeUndefined();
  })

  test('Spec creation failed: Invalid input type', () => {
    const createSpec = () => {
      new Spec(KEY, 0 as any);
    }

    expect(createSpec).toThrow(`Invalid specifications for key ${KEY}`);
  })

  test('Spec creation failed: Empty input array', () => {
    const createSpec = () => {
      new Spec(KEY, []);
    }

    expect(createSpec).toThrow(`Type is required for key '${KEY}`);
  })

  test('Spec creation failed: Invalid type of type in array', () => {
    const createSpec = () => {
      new Spec(KEY, [0 as any]);
    }

    expect(createSpec).toThrow(`Invalid type specification for key '${KEY}'`);
  })

  test('Spec creation failed: Nonexistant type in array', () => {
    const createSpec = () => {
      new Spec(KEY, ['notatype']);
    }

    expect(createSpec).toThrow(`Type 'notatype' does not exist for key '${KEY}'`);
  })

  test('Spec creation failed: No nested object provided for object type', () => {
    const createSpec = () => {
      new Spec(KEY, ['object', 'rule']);
    }

    expect(createSpec).toThrow(`Nested object must be provided for key '${KEY}' of type 'object'`);
  })

  test('Spec creation failed: No nested object provided for array type', () => {
    const createSpec = () => {
      new Spec(KEY, ['array', 'rule']);
    }

    expect(createSpec).toThrow(`Nested object must be provided for key '${KEY}' of type 'array'`);
  })

  test('Spec creation failed: Nonexistant type in string', () => {
    const createSpec = () => {
      new Spec(KEY, 'notatype');
    }

    expect(createSpec).toThrow(`Type 'notatype' does not exist for key '${KEY}'`);
  })

  test('Spec creation failed: Object type provided in string input', () => {
    const createSpec = () => {
      new Spec(KEY, 'object');
    }

    expect(createSpec).toThrow(`Must provide rules in an array for key '${KEY} of type 'object'`);
  })

  test('Spec creation failed: Array type provided in string input', () => {
    const createSpec = () => {
      new Spec(KEY, 'array');
    }

    expect(createSpec).toThrow(`Must provide rules in an array for key '${KEY} of type 'array'`);
  })

  test('Spec creation failed: Non string provided in array', () => {
    const createSpec = () => {
      new Spec(KEY, ['string', 0 as any]);
    }

    expect(createSpec).toThrow(`Rule provided for key '${KEY}' is not of type 'string'`);
  })

  test('Spec creation failed: Nonexistant rule provided in array', () => {
    const createSpec = () => {
      new Spec(KEY, ['string', 'notarule']);
    }

    expect(createSpec).toThrow(`Invalid rule 'notarule'`);
  })
});