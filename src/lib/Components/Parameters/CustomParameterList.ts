import { ValidatorResult } from 'jsonschema';
import {
  CustomEnumParameter,
  CustomParameter,
  CustomParametersSchema,
} from '.';
import { Component } from '..';
import { Config } from '../../Config';
import { AnyParameterLiteral } from './Parameters.types';
import {
  anyParameterListSchema,
  commandParameterListSchema,
  jobParameterListSchema,
  primitiveParameterListSchema,
} from './schema';

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

  static validate(
    input: unknown,
    type: 'any' | 'job' | 'command' | 'primitive',
  ): ValidatorResult | undefined {
    const schemas = {
      any: anyParameterListSchema,
      job: jobParameterListSchema,
      command: commandParameterListSchema,
      primitive: primitiveParameterListSchema,
    };

    // prevent object sink injection
    const schema = Object.entries(schemas).find(([key]) => key === type);

    if (schema && schema[1]) {
      return Config.validator.validate(input, schema[1]);
    }
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
