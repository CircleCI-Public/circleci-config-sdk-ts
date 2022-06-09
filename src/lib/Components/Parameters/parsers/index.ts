import { Validator } from '../../../Config';
import {
  GenerableType,
  ParameterizedComponent,
  ParameterSubtype,
} from '../../../Config/exports/Mapping';
import { parseGenerable, errorParsing } from '../../../Config/exports/Parsing';
import { CustomEnumParameter } from '../exports/CustomEnumParameter';
import { CustomParameter } from '../exports/CustomParameter';
import { CustomParametersList } from '../exports/CustomParameterList';
import {
  CustomEnumParameterContentsShape,
  CustomParameterContentsShape,
  CustomParametersListShape,
} from '../types';
import {
  AnyParameterLiteral,
  EnumParameterLiteral,
} from '../types/CustomParameterLiterals.types';

const parameterMappings: {
  [key in Exclude<AnyParameterLiteral, EnumParameterLiteral>]: ParameterSubtype;
} = {
  string: ParameterSubtype.STRING,
  boolean: ParameterSubtype.BOOLEAN,
  integer: ParameterSubtype.INTEGER,
  executor: ParameterSubtype.EXECUTOR,
  steps: ParameterSubtype.STEPS,
  env_var_name: ParameterSubtype.ENV_VAR_NAME,
};

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
    const typeEntry = Object.entries(customParamIn).find(
      ([key]) => key === 'type',
    );

    if (!typeEntry) {
      throw errorParsing(`Missing type property on parameter: ${name}`);
    } else {
      type = typeEntry[1];
    }
  }

  if (type === 'enum') {
    return parseGenerable<
      CustomEnumParameterContentsShape,
      CustomEnumParameter
    >(
      GenerableType.CUSTOM_ENUM_PARAMETER,
      customParamIn,
      (customEnumParam) => {
        return new CustomEnumParameter(
          name,
          customEnumParam.enum,
          customEnumParam.default,
          customEnumParam.description,
        );
      },
      undefined,
      name,
    );
  }

  return parseGenerable<
    CustomParameterContentsShape<AnyParameterLiteral>,
    CustomParameter<AnyParameterLiteral>
  >(
    GenerableType.CUSTOM_PARAMETER,
    customParamIn,
    (customParam) => {
      return new CustomParameter(
        name,
        customParam.type,
        customParam.default,
        customParam.description,
      );
    },
    undefined,
    name,
    parameterMappings[type as keyof typeof parameterMappings],
  );
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
      throw errorParsing(
        'Could not find valid parameter list in provided object',
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
