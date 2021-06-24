export type EnumParameter = string[];

export type ParameterTypes =
  | string
  | string[]
  | boolean
  | number
  | EnumParameter // enum
  | Map<string, string> // Environment key value pairs
  | undefined;
