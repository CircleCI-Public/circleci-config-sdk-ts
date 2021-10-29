import { Component } from '..';
import { ParameterValues } from './Parameters.types';

export class CustomParameter<ParameterType>
  implements ParameterValues<ParameterType>
{
  name: string;
  type: ParameterType;
  defaultValue?: unknown;
  enumValues?: string[];

  constructor(
    name: string,
    type: ParameterType,
    defaultValue?: unknown,
    enumValues?: string[],
  ) {
    this.name = name;
    this.defaultValue = defaultValue;
    this.enumValues = enumValues;
    this.type = type;
  }
}

export class CustomParametersList<ParameterType> extends Component {
  parameters: CustomParameter<ParameterType>[];

  constructor(...parameters: CustomParameter<ParameterType>[]) {
    super();
    this.parameters = parameters;
  }

  generate(): CustomParametersSchema {
    const generatedParameters = this.parameters.map((parameter) => ({
      [parameter.name]: {
        type: parameter.type,
        default: parameter.defaultValue,
        enum: parameter.enumValues,
      },
    }));

    return Object.assign({}, ...generatedParameters);
  }
}

export type CustomParametersSchema = Record<string, ParameterValues>;
