import { Validator } from '../../../Config';
import {
  GenerableType,
  ParameterizedComponent,
  ParameterSubtype,
} from '../../../Config/exports/Mapping';
import { CustomEnumParameter } from '../exports/CustomEnumParameter';
import { CustomParameter } from '../exports/CustomParameter';
import { CustomParametersList } from '../exports/CustomParameterList';
import {
  CustomEnumParameterShape,
  CustomParameterShape,
  CustomParametersListShape,
} from '../types';
import {
  AnyParameterLiteral,
  EnumParameterLiteral,
} from '../types/CustomParameterLiterals.types';

/**
 * Parse a single parameter.
 * @param customParamIn - Unknown parameter object.
 * @param name - Name of the parameter.
 * @param subtype - Subtype of the parameter. Required for all non-enum typed parameters.
 * @returns A custom parameter.
 * @throws Error if a valid executor type is not found on the object.
 */
export function parseParameter(
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
  const valid = Validator.validateGenerable(
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

/**
 * Parse a list of parameters.
 * @param customParamIn - Unknown parameter object.
 * @param name - Name of the parameter.
 * @param subtype - Subtype of the parameter. Required for all but enum typed parameters.
 * @returns A custom parameter.
 * @throws Error if parameter list, or at least one parameter is not valid.
 */
export function parseParameterList(
  customParamListIn: unknown,
  subtype?: ParameterizedComponent,
): CustomParametersList<AnyParameterLiteral> {
  if (subtype) {
    const valid = Validator.validateGenerable(
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
      parseParameter(properties, name),
    ),
  );
}
