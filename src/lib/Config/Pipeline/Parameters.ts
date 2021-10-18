import { EnumParameter } from '../Parameters';

/**
 * A Pipeline Parameter
 * @see {@link https://circleci.com/docs/2.0/pipeline-variables/#pipeline-parameters-in-configuration}
 */
export class PipelineParameter<ParameterType> {
  name: string;
  defaultValue: PipelineParameterValueTypes;
  parameterType: ParameterTypeLiteral;
  enumValues: EnumParameter;
  constructor(
    name: string,
    defaultValue: ParameterType,
    enumValues: EnumParameter = [],
  ) {
    this.name = name;
    this.defaultValue = defaultValue as unknown as PipelineParameterValueTypes;
    this.enumValues = enumValues;
    if (enumValues.length > 0) {
      this.parameterType = 'enum';
      if (this.validateEnum(defaultValue as unknown as string) === false) {
        throw new Error(
          `The given default value was not found in the enum values for the Pipeline Parameter ${this.name}`,
        );
      }
    } else {
      const defaultType = typeof defaultValue;
      switch (defaultType) {
        default:
          this.parameterType = 'string';
          break;
        case 'number':
          this.parameterType = 'number';
          break;
        case 'boolean':
          this.parameterType = 'boolean';
          break;
      }
    }
  }

  get value(): ParameterType {
    // Needs a way of getting the "current" value from the environment.
    return this.defaultValue as unknown as ParameterType;
  }

  generate(): unknown {
    const schemaObject: PipelineParameterSchema = {
      [this.name]: {
        default: this.defaultValue,
        parameterType: this.parameterType,
        enum: this.enumValues,
      },
    };
    return schemaObject;
  }

  private validateEnum(input: string): boolean {
    return this.enumValues.includes(input) ? true : false;
  }
}

export type ParameterTypeLiteral = 'string' | 'number' | 'boolean' | 'enum';
export interface PipelineParameterSchema {
  [parameterName: string]: {
    parameterType: ParameterTypeLiteral;
    default: string | number | boolean;
    enum?: string[];
  };
}
export type PipelineParameterValueTypes = string | number | boolean;
