import { Component } from '..';
import {
  AnyParameterLiteral,
  EnumParameterLiteral,
  ParameterSchema,
  ParameterValues,
} from './Parameters.types';

type CustomParameterSchema<ParameterTypeLiteral> = {
  type: ParameterTypeLiteral;
  default: unknown;
  description?: string;
};

type CustomEnumParameterSchema =
  | CustomParameterSchema<EnumParameterLiteral> & {
      enum?: string[];
    };

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
export class CustomParameter<ParameterTypeLiteral>
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
  generate(): CustomParameterSchema<ParameterTypeLiteral> {
    return {
      type: this.type,
      default: this.defaultValue,
      description: this.description,
    };
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

  generate(): CustomEnumParameterSchema {
    return {
      ...super.generate(),
      enum: this.enumValues,
    };
  }
}

/**
 * A list that can be added to a component.
 *
 * For use in {@link ParameterizedComponent}
 *
 * {@label STATIC_2.1}
 */
export class CustomParametersList<
  ParameterTypeLiteral extends AnyParameterLiteral,
> extends Component {
  parameters: CustomParameter<ParameterTypeLiteral>[];

  constructor(parameters?: CustomParameter<ParameterTypeLiteral>[]) {
    super();
    this.parameters = parameters || [];
  }

  generate(): CustomParametersSchema {
    const generatedParameters = this.parameters.map((parameter) => ({
      [parameter.name]: {
        ...parameter.generate(),
      },
    }));

    return Object.assign({}, ...generatedParameters);
  }

  /**
   * Define a parameter to be available to the workflow job. Useful for static configurations.
   * @param name - name of the parameter
   * @param type - the literal type of the parameter
   * @param defaultValue - optional default value of parameter. If this is not provided, the parameter will be required.
   * @param description - optional description of parameter
   * @param enumValues - list of selectable enum values. Only applicable for enum type parameters.
   * @returns this for chaining
   */
  define(
    name: string,
    type: ParameterTypeLiteral,
    defaultValue?: unknown,
    description?: string,
    enumValues?: string[],
  ): CustomParameter<ParameterTypeLiteral> {
    let parameter: CustomParameter<unknown> | undefined = undefined;

    if (type === 'enum') {
      if (enumValues) {
        parameter = new CustomEnumParameter(
          name,
          enumValues,
          defaultValue,
          description,
        );
      } else {
        throw new Error(`Enum type requires enum values to be defined`);
      }
    } else {
      parameter = new CustomParameter(name, type, defaultValue, description);
    }

    const customParameter = parameter as CustomParameter<ParameterTypeLiteral>;

    this.parameters.push(customParameter);

    return customParameter;
  }
}

export type CustomParametersSchema = Record<string, ParameterSchema>;
