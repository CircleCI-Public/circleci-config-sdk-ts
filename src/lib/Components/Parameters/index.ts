import { Generable } from '..';
import { ConfigValidator } from '../../Config/ConfigValidator';
import {
  GenerableType,
  ParameterizedComponent,
  ParameterSubtype,
} from '../../Config/types/Config.types';
import { CustomParametersList } from './exports/CustomParameterList';
import {
  AnyParameterLiteral,
  EnumParameterLiteral,
} from './types/CustomParameterLiterals.types';
import {
  CustomEnumParameterShape,
  CustomParameterShape,
  CustomParametersListShape,
  ParameterValues as Parameterized,
} from './types/Parameters.types';

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
  implements Generable, Parameterized<ParameterTypeLiteral>
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

  get generableType(): GenerableType {
    return GenerableType.CUSTOM_PARAMETER;
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
  enumValues: string[];

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

  get generableType(): GenerableType {
    return GenerableType.CUSTOM_ENUM_PARAMETER;
  }
}

/**
 * Parse a single parameter
 * @param customParamIn - Unknown parameter object
 * @param name - Name of the parameter
 * @param subtype - Subtype of the parameter. Required for all non-enum typed parameters.
 * @returns A CustomParameter object
 */
export function parse(
  customParamIn: unknown,
  name: string,
): CustomParameter<AnyParameterLiteral> {
  let type = undefined;

  if (customParamIn && typeof customParamIn === 'object') {
    type = Object.entries(customParamIn).find(([key]) => key === 'type')?.[1];
  }

  const types: {
    [key in Exclude<
      AnyParameterLiteral,
      EnumParameterLiteral
    >]: ParameterSubtype;
  } = {
    string: ParameterSubtype.STRING,
    boolean: ParameterSubtype.BOOLEAN,
    integer: ParameterSubtype.INTEGER,
    executor: ParameterSubtype.EXECUTOR,
    steps: ParameterSubtype.STEPS,
    env_var_name: ParameterSubtype.ENV_VAR_NAME,
  };

  const isEnum = type === 'enum';
  const valid = ConfigValidator.getGeneric().validateGenerable(
    isEnum
      ? GenerableType.CUSTOM_ENUM_PARAMETER
      : GenerableType.CUSTOM_PARAMETER,
    customParamIn,
    isEnum ? undefined : types[type as keyof typeof types],
  );

  if (valid !== true) {
    throw new Error(
      `Provided parameter could not be parsed: ${
        typeof valid === 'object' && valid?.map((v) => v.message).join(', ')
      }`,
    );
  }

  if (isEnum) {
    const customEnumParam = customParamIn as CustomEnumParameterShape;

    return new CustomEnumParameter(
      name,
      customEnumParam.enum,
      customEnumParam.default,
      customEnumParam.description,
    );
  } else {
    const customParam =
      customParamIn as CustomParameterShape<AnyParameterLiteral>;

    return new CustomParameter(
      name,
      customParam.type,
      customParam.default,
      customParam.description,
    );
  }
}

export function parseList(
  customParamListIn: unknown,
  subtype?: ParameterizedComponent,
): CustomParametersList<AnyParameterLiteral> {
  if (subtype) {
    const valid = ConfigValidator.getGeneric().validateGenerable(
      GenerableType.CUSTOM_PARAMETERS_LIST,
      customParamListIn,
      subtype,
    );

    if (valid !== true) {
      throw new Error(
        `Could not find valid parameter list in provided object: ${
          typeof valid === 'object' && valid?.map((v) => v.message).join(', ')
        }`,
      );
    }
  }

  const customParamList = customParamListIn as CustomParametersListShape;
  return new CustomParametersList(
    Object.entries(customParamList).map(([name, properties]) =>
      parse(properties, name),
    ),
  );
}

export { CustomParametersList };
