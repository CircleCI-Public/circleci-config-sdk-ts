import { Component } from '..';
import { ParameterSchema, ParameterValues } from './Parameters.types';

export class CustomParameter<ParameterTypeLiteral>
  implements ParameterValues<ParameterTypeLiteral>
{
  name: string;
  type: ParameterTypeLiteral;
  defaultValue?: unknown;
  description?: string;
  enumValues?: string[];

  constructor(
    name: string,
    type: ParameterTypeLiteral,
    defaultValue?: unknown,
    description?: string,
    enumValues?: string[],
  ) {
    this.name = name;
    this.defaultValue = defaultValue;
    this.description = description;
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

export type CustomParametersSchema = Record<string, ParameterSchema>;
