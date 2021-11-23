import { ValidatorResult } from 'jsonschema';
import { Component } from '..';
import { Config } from '../../Config';
import { CustomParametersList } from './exports/CustomParameterList';
import {
  CustomEnumParameterShape,
  CustomParameterShape,
  ParameterShape,
  ParameterValues,
} from './types/Parameters.types';
import {
  anyParameterSchema,
  commandParameterSchema,
  enumParameterSchema,
  jobParameterSchema,
  primitiveParameterSchema,
} from './schemas/Parameter.schema';
import {
  AnyParameterLiteral,
  EnumParameterLiteral,
} from './types/CustomParameterLiterals.types';

/**
 * Accepted parameters can be assigned to a component.
 * This is the type definition of the parameter, and does not store the value.
 * Components which accept parameters will have a {@link defineParameter} implementation.
 *
 * @param name - The name of the parameter.
 * @param type - The type of the parameter.
 * If using an enum, use the {@link CustomEnumParameter} class.
 * @param defaultValue - The default value of the parameter.
 * @param description - A description of the parameter.
 *
 * {@label STATIC_2.1}
 */
export class CustomParameter<ParameterTypeLiteral extends AnyParameterLiteral>
  extends Component
  implements ParameterValues<ParameterTypeLiteral>
{
  name: string;
  type: ParameterTypeLiteral;
  defaultValue?: unknown;
  description?: string;

  constructor(
    name: string,
    type: ParameterTypeLiteral,
    defaultValue?: unknown,
    description?: string,
  ) {
    super();
    this.name = name;
    this.type = type;
    this.defaultValue = defaultValue;
    this.description = description;
  }

  /**
   * @returns JSON schema of parameter's contents
   */
  generate(): CustomParameterShape<ParameterTypeLiteral> {
    return {
      type: this.type,
      default: this.defaultValue,
      description: this.description,
    };
  }

  static validate(
    input: unknown,
    type: 'any' | 'job' | 'command' | 'primitive',
  ): ValidatorResult | undefined {
    const schemas = {
      any: anyParameterSchema,
      job: jobParameterSchema,
      command: commandParameterSchema,
      primitive: primitiveParameterSchema,
    };

    // prevent object sink injection
    const schema = Object.entries(schemas).find(([key]) => key === type);

    if (schema && schema[1]) {
      return Config.validator.validate(input, schema[1]);
    }
  }
}

/**
 * An enum parameter can be passed to a component.
 * @param name - The name of the parameter.
 * @param enumValues - The values of the enum.
 * @param defaultValue - The optional default value of the parameter.
 * Optional, but will be marked as required if not provided.
 * @param description - An optional description of the parameter.
 *
 * {@label STATIC_2.1}
 */
export class CustomEnumParameter extends CustomParameter<EnumParameterLiteral> {
  enumValues?: string[];

  constructor(
    name: string,
    enumValues: string[],
    defaultValue?: unknown,
    description?: string,
  ) {
    super(name, 'enum', defaultValue, description);
    this.enumValues = enumValues;
  }

  generate(): CustomEnumParameterShape {
    return {
      ...super.generate(),
      enum: this.enumValues,
    };
  }

  static validate(input: unknown): ValidatorResult {
    return Config.validator.validate(input, enumParameterSchema);
  }
}

export type CustomParametersShape = Record<string, ParameterShape>;
export { CustomParametersList };
