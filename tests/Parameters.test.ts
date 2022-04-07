import { parse as yamlParse } from 'yaml';
import * as CircleCI from '../src/index';
import {
  CustomEnumParameter,
  CustomParameter,
  CustomParametersList,
} from '../src/lib/Components/Parameters';
import { PipelineParameterLiteral } from '../src/lib/Components/Parameters/types/CustomParameterLiterals.types';
import {
  GenerableType,
  ParameterizedComponent,
  ParameterSubtype,
} from '../src/lib/Config/types/Config.types';

describe('Parse yaml pipeline parameters and validate', () => {
  const parametersIn = yamlParse(`
    axis:
      type: enum
      default: 'x'
      enum: [x, y, z]
    angle:
      type: integer
      default: 90`);

  const expectedParameters = new CustomParametersList<PipelineParameterLiteral>(
    [
      new CustomEnumParameter('axis', ['x', 'y', 'z'], 'x'),
      new CustomParameter('angle', ParameterSubtype.INTEGER, 90),
    ],
  );

  it('Should validate parameters', () => {
    const result = CircleCI.ConfigValidator.validateGenerable(
      GenerableType.CUSTOM_PARAMETERS_LIST,
      parametersIn,
      ParameterizedComponent.PIPELINE,
    );

    expect(result).toEqual(true);
  });

  it('Should parse parameters', () => {
    expect(CircleCI.parameters.parseList(parametersIn)).toEqual(
      expectedParameters,
    );
  });

  it('Should validate integer parameters', () => {
    const parameterIn = yamlParse(`
    type: integer
    default: 2021`);

    const result = CircleCI.ConfigValidator.validateGenerable(
      GenerableType.CUSTOM_PARAMETER,
      parameterIn,
      ParameterizedComponent.PIPELINE,
    );

    expect(result).toEqual(true);
  });

  it('Should not validate float parameters', () => {
    const parameterIn = yamlParse(`
    type: integer
    default: 1.01`);

    const result = CircleCI.ConfigValidator.validateGenerable(
      GenerableType.CUSTOM_PARAMETER,
      parameterIn,
      ParameterizedComponent.PIPELINE,
    );

    expect(result).not.toEqual(true);
  });
});

describe('Parse yaml integer parameters and validate', () => {
  const parameterName = 'year';
  const parameterType = 'integer';
  const parameterValue = 2021;
  const parameterIn = yamlParse(`
  type: ${parameterType}
  default: ${parameterValue}`);
  const expectedParameter = new CustomParameter(
    parameterName,
    parameterType,
    parameterValue,
  );

  [
    ParameterSubtype.INTEGER,
    ParameterizedComponent.PIPELINE,
    ParameterizedComponent.JOB,
    ParameterizedComponent.COMMAND,
    ParameterizedComponent.EXECUTOR,
  ].map((subtype) =>
    it(`Should validate integer parameter with subtype ${subtype}`, () => {
      const result = CircleCI.ConfigValidator.validateGenerable(
        GenerableType.CUSTOM_PARAMETER,
        parameterIn,
        ParameterSubtype.INTEGER,
      );

      expect(result).toEqual(true);
    }),
  );

  it('Should parse integer parameter', () => {
    expect(CircleCI.parameters.parse(parameterIn, parameterName)).toEqual(
      expectedParameter,
    );
  });
});

describe('Parse yaml string parameter and validate', () => {
  const parameterName = 'message';
  const parameterType = 'string';
  const parameterValue = 'hello world!';
  const parameterIn = yamlParse(`
  type: ${parameterType}
  default: '${parameterValue}'`);
  const expectedParameter = new CustomParameter(
    parameterName,
    parameterType,
    parameterValue,
  );

  it('Should validate string parameter', () => {
    const result = CircleCI.ConfigValidator.validateGenerable(
      GenerableType.CUSTOM_PARAMETER,
      parameterIn,
      ParameterSubtype.STRING,
    );

    expect(result).toEqual(true);
  });

  [
    ParameterSubtype.STRING,
    ParameterizedComponent.PIPELINE,
    ParameterizedComponent.JOB,
    ParameterizedComponent.COMMAND,
    ParameterizedComponent.EXECUTOR,
  ].map((subtype) =>
    it(`Should parse integer parameter with subtype ${subtype}`, () => {
      expect(CircleCI.parameters.parse(parameterIn, parameterName)).toEqual(
        expectedParameter,
      );
    }),
  );
});

describe('Parse yaml boolean parameter and validate', () => {
  const parameterName = 'should_run';
  const parameterType = 'boolean';
  const parameterValue = false;
  const parameterIn = yamlParse(`
  type: ${parameterType}
  default: ${parameterValue}`);
  const expectedParameter = new CustomParameter(
    parameterName,
    parameterType,
    parameterValue,
  );

  [
    ParameterSubtype.BOOLEAN,
    ParameterizedComponent.PIPELINE,
    ParameterizedComponent.JOB,
    ParameterizedComponent.COMMAND,
  ].map((subtype) =>
    it(`Should validate boolean parameter with subtype ${subtype}`, () => {
      const result = CircleCI.ConfigValidator.validateGenerable(
        GenerableType.CUSTOM_PARAMETER,
        parameterIn,
        ParameterSubtype.BOOLEAN,
      );

      expect(result).toEqual(true);
    }),
  );

  it(`Should parse boolean parameter`, () => {
    expect(CircleCI.parameters.parse(parameterIn, parameterName)).toEqual(
      expectedParameter,
    );
  });
});

describe('Parse yaml enum parameter and validate', () => {
  const parameterName = 'message';
  const parameterValues = ['x', 'y', 'z'];
  const parameterIn = yamlParse(`
  type: enum
  default: '${parameterValues[1]}'
  enum: [${parameterValues.join(', ')}]`);
  const expectedParameter = new CustomEnumParameter(
    parameterName,
    parameterValues,
    parameterValues[1],
  );

  /**
    Enum singleton parameter does not have a subtype,
    However, it can be validated against a parameterized component subtype
    to ensure it is valid per the parameterized component
  */
  [
    undefined,
    ParameterizedComponent.PIPELINE,
    ParameterizedComponent.JOB,
    ParameterizedComponent.COMMAND,
    ParameterizedComponent.EXECUTOR,
  ].map((subtype) =>
    it(`Should validate env_var_name parameter with subtype ${subtype}`, () => {
      const result = CircleCI.ConfigValidator.validateGenerable(
        subtype
          ? GenerableType.CUSTOM_PARAMETER
          : GenerableType.CUSTOM_ENUM_PARAMETER,
        parameterIn,
        subtype,
      );

      expect(result).toEqual(true);
    }),
  );

  it(`Should parse enum parameter`, () => {
    expect(CircleCI.parameters.parse(parameterIn, parameterName)).toEqual(
      expectedParameter,
    );
  });
});

describe('Parse yaml env_var_name parameter and validate', () => {
  const parameterName = 'secret-key';
  const parameterType = 'env_var_name';
  const parameterValue = 'SECRET_KEY';
  const parameterIn = yamlParse(`
  type: ${parameterType}
  default: '${parameterValue}'`);
  const expectedParameter = new CustomParameter(
    parameterName,
    parameterType,
    parameterValue,
  );

  [
    ParameterSubtype.ENV_VAR_NAME, // this will can be assumed
    ParameterizedComponent.JOB,
    ParameterizedComponent.COMMAND,
  ].map((subtype) =>
    it(`Should validate env_var_name parameter with subtype ${subtype}`, () => {
      const result = CircleCI.ConfigValidator.validateGenerable(
        GenerableType.CUSTOM_PARAMETER,
        parameterIn,
        subtype,
      );

      expect(result).toEqual(true);
    }),
  );

  it(`Should parse env_var_name parameter`, () => {
    expect(CircleCI.parameters.parse(parameterIn, parameterName)).toEqual(
      expectedParameter,
    );
  });
});
