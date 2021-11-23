import {
  CustomEnumParameter,
  CustomParameter,
  CustomParametersShape,
} from '..';
import { Component } from '../..';
import { Config } from '../../../Config';
import {
  AnyParameterLiteral,
  ParameterizedComponentLiteral,
} from '../types/CustomParameterLiterals.types';
import { ValidationResult } from '../../../Config/ConfigValidator';
import {
  CommandParameterListSchema,
  ExecutorParameterListSchema,
  JobParameterListSchema,
  PipelineParameterListSchema,
} from '../schemas/ComponentParameterLists.schema';

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

  generate(): CustomParametersShape {
    const generatedParameters = this.parameters.map((parameter) => ({
      [parameter.name]: {
        ...parameter.generate(),
      },
    }));

    return Object.assign({}, ...generatedParameters);
  }

  static validate(
    input: unknown,
    type: ParameterizedComponentLiteral,
  ): ValidationResult {
    const schemas = {
      job: JobParameterListSchema,
      command: CommandParameterListSchema,
      executor: ExecutorParameterListSchema,
      pipeline: PipelineParameterListSchema,
    };

    // prevent object sink injection
    const schema = Object.entries(schemas).find(([key]) => key === type);

    if (schema && schema[1]) {
      return Config.validator.validateData(schema[1], input);
    }

    return false;
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
    let parameter = undefined;

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