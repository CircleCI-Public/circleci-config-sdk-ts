import { parse as yamlParse } from 'yaml';
import { CustomParameter } from '../src/lib/Components/Parameters';
import {
  GenerableType,
  ParametersListSubtype,
  ParameterSubtype,
} from '../src/lib/Config/types/Config.types';
import { ConfigValidator } from '../src/lib/Config/ConfigValidator';
import * as CircleCI from '../src/index';

describe('Parse yaml pipeline parameters and validate', () => {
  it('Should validate parameters', () => {
    const parametersIn = yamlParse(`parameters: 
      axis:
        type: enum
        default: 'x'
        enum: [x, y, z]
      angle:
        type: integer
        default: 90`);

    const result = ConfigValidator.validate(
      GenerableType.CUSTOM_PARAMETERS_LIST,
      parametersIn,
      ParametersListSubtype.PIPELINE,
    );

    expect(result).toEqual(true);
  });

  it('Should parse parameters', () => {
    const parametersIn = yamlParse(`parameters: 
      axis:
        type: enum
        default: 'x'
        enum: [x, y, z]
      angle:
        type: integer
        default: 90`);

    const result = ConfigValidator.validate(
      GenerableType.CUSTOM_PARAMETERS_LIST,
      parametersIn,
      ParametersListSubtype.PIPELINE,
    );

    expect(result).toEqual(true);
  });

  it('Should validate integer parameters', () => {
    const parameterIn = yamlParse(`
    type: integer
    default: 2021`);

    const result = ConfigValidator.validate(
      GenerableType.CUSTOM_PARAMETER,
      parameterIn,
      ParameterSubtype.PIPELINE_PARAMS,
    );

    expect(result).toEqual(true);
  });
});

describe('Parse yaml integer parameters and validate', () => {
  const parameterIn = yamlParse(`
  type: integer
  default: 2021`);

  const parameterName = 'year';
  const expectedParameter = new CustomParameter(parameterName, 'integer', 2021);

  it('Should validate integer parameter', () => {
    const result = ConfigValidator.validate(
      GenerableType.CUSTOM_PARAMETER,
      parameterIn,
      ParameterSubtype.INTEGER,
    );

    expect(result).toEqual(true);
  });

  [
    ParameterSubtype.INTEGER,
    ParameterSubtype.PIPELINE_PARAMS,
    ParameterSubtype.JOB_PARAMS,
    ParameterSubtype.COMMAND_PARAMS,
    ParameterSubtype.EXECUTOR_PARAMS,
  ].map((subtype) =>
    it(`Should parse integer parameter with subtype ${subtype}`, () => {
      expect(
        CircleCI.parameters.parse(parameterIn, parameterName, subtype),
      ).toEqual(expectedParameter);
    }),
  );
});

describe('Parse yaml enum parameter and validate', () => {
  it('Should validate enum parameter', () => {
    const parameterIn = yamlParse(`
    type: enum
    default: 'x'
    enum: [x, y, z]`);

    const result = ConfigValidator.validate(
      GenerableType.CUSTOM_ENUM_PARAMETER,
      parameterIn,
    );

    expect(result).toEqual(true);
  });
});
