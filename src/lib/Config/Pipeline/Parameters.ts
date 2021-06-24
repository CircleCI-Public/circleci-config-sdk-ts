import { EnumParameter } from '../Parameters';

export class PipelineParameter<ParameterType> {
  name: string;
  defaultValue: PipelineParameterValueTypes;
  type: ParameterTypeLiteral;
  enumValues: EnumParameter;
  constructor(
    name: string,
    defaultValue: ParameterType,
    enumValues?: EnumParameter,
  ) {
    this.name = name;
    this.defaultValue = defaultValue as unknown as PipelineParameterValueTypes;
    this.enumValues = enumValues || [];
    if (enumValues) {
      this.type = 'enum';
      if (this.validateEnum(defaultValue as unknown as string) === false) {
        throw new Error(
          `The given default value was not found in the enum values for the Pipeline Parameter ${this.name}`,
        );
      }
    } else {
      const defaultType = typeof defaultValue;
      switch (defaultType) {
        default:
          this.type = 'string';
          break;
        case 'number':
          this.type = 'string';
          break;
        case 'object':
          this.type = 'enum';
          break;
        case 'boolean':
          this.type = 'boolean';
          break;
      }
    }
  }

  get value(): ParameterType {
    // Needs a way of getting the "current" value from the environment.
    return this.defaultValue as unknown as ParameterType;
  }

  generate(): PipelineParameterSchema {
    const schemaObject: PipelineParameterSchema = {
      [this.name]: {
        default: this.defaultValue,
        type: this.type,
        enum: this.enumValues || [],
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
    type: ParameterTypeLiteral;
    default: string | number | boolean;
    enum?: string[];
  };
}
export type PipelineParameterValueTypes = string | number | boolean;
