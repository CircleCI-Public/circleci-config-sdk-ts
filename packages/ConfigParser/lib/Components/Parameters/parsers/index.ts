import * as CircleCI from '@circleci/circleci-config-sdk';
import { errorParsing, parseGenerable } from '../../../Config/exports/Parsing';
import { Validator } from '../../../Config/exports/Validator';

const parameterMappings: {
  [key in Exclude<
    CircleCI.types.parameter.literals.AnyParameterLiteral,
    CircleCI.types.parameter.literals.EnumParameterLiteral
  >]: CircleCI.mapping.ParameterSubtype;
} = {
  string: CircleCI.mapping.ParameterSubtype.STRING,
  boolean: CircleCI.mapping.ParameterSubtype.BOOLEAN,
  integer: CircleCI.mapping.ParameterSubtype.INTEGER,
  executor: CircleCI.mapping.ParameterSubtype.EXECUTOR,
  steps: CircleCI.mapping.ParameterSubtype.STEPS,
  env_var_name: CircleCI.mapping.ParameterSubtype.ENV_VAR_NAME,
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
): CircleCI.parameters.CustomParameter<CircleCI.types.parameter.literals.AnyParameterLiteral> {
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
      CircleCI.types.parameter.CustomEnumParameterContentsShape,
      CircleCI.parameters.CustomEnumParameter
    >(
      CircleCI.mapping.GenerableType.CUSTOM_ENUM_PARAMETER,
      customParamIn,
      (customEnumParam) => {
        return new CircleCI.parameters.CustomEnumParameter(
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
    CircleCI.types.parameter.CustomParameterContentsShape<CircleCI.types.parameter.literals.AnyParameterLiteral>,
    CircleCI.parameters.CustomParameter<CircleCI.types.parameter.literals.AnyParameterLiteral>
  >(
    CircleCI.mapping.GenerableType.CUSTOM_PARAMETER,
    customParamIn,
    (customParam) => {
      return new CircleCI.parameters.CustomParameter(
        name,
        customParam.type,
        customParam.default,
        customParam.description,
      );
    },
    undefined,
    name,
    parameterMappings[type as unknown as keyof typeof parameterMappings],
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
  subtype?: CircleCI.mapping.ParameterizedComponent,
): CircleCI.parameters.CustomParametersList<CircleCI.types.parameter.literals.AnyParameterLiteral> {
  if (subtype) {
    const valid = Validator.validateGenerable(
      CircleCI.mapping.GenerableType.CUSTOM_PARAMETERS_LIST,
      customParamListIn,
      subtype,
    );

    if (valid !== true) {
      throw errorParsing(
        'Could not find valid parameter list in provided object',
      );
    }
  }

  const customParamList =
    customParamListIn as CircleCI.types.parameter.CustomParametersListShape;
  return new CircleCI.parameters.CustomParametersList(
    Object.entries(customParamList).map(([name, properties]) =>
      parseParameter(properties, name),
    ),
  );
}
