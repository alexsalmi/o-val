type InputSpecs = {
  [name: string]: InputSpec;
}

type InputSpec = (string | InputSpecs)[] | string;

type SpecObj = {
  [name: string]: Spec
}

type SpecRange = [number, number];
