import { CustomEnumParameter, CustomParameter } from '..';
import { Generable } from '../..';
import { GenerableType } from '../../../Config/exports/Mapping';
import { AnyParameterLiteral } from '../types/CustomParameterLiterals.types';
import { CustomParametersListShape } from '../types';

/**
 * A list that can be added to a component.
 *
 * For use in {@link ParameterizedComponent}
 *
 * {@label STATIC_2.1}
 */
export class CustomParametersList<
  ParameterTypeLiteral extends AnyParameterLiteral,
> implements Generable
{
  parameters: CustomParameter<ParameterTypeLiteral>[];

  constructor(parameters?: CustomParameter<ParameterTypeLiteral>[]) {
    this.parameters = parameters || [];
  }

  generate(): CustomParametersListShape {
    const generatedParameters = this.parameters.map((parameter) => {
      return parameter.generate();
    });

    return Object.assign({}, ...generatedParameters);
  }

  [Symbol.iterator](): IterableIterator<CustomParameter<ParameterTypeLiteral>> {
    return this.parameters[Symbol.iterator]();
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
        // Create event based error system to replace this.
        throw new Error("Enum values must be provided for enum type parameters.");
      }
    } else {
      parameter = new CustomParameter(name, type, defaultValue, description);
    }

    const customParameter = parameter as CustomParameter<ParameterTypeLiteral>;

    this.parameters.push(customParameter);

    return customParameter;
  }

  get generableType(): GenerableType {
    return GenerableType.CUSTOM_PARAMETERS_LIST;
  }
}
