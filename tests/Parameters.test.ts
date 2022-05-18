import { parse as yamlParse } from 'yaml';
import * as CircleCI from '../src/index';

describe('Parse yaml pipeline parameters and validate', () => {
  const parametersIn = yamlParse(`
    axis:
      type: enum
      default: 'x'
      enum: [x, y, z]
    angle:
      type: integer
      default: 90`);

  const expectedParameters =
    new CircleCI.parameters.CustomParametersList<CircleCI.parameters.types.literals.PipelineParameterLiteral>(
      [
        new CircleCI.parameters.CustomEnumParameter(
          'axis',
          ['x', 'y', 'z'],
          'x',
        ),
        new CircleCI.parameters.CustomParameter(
          'angle',
          CircleCI.config.mapping.ParameterSubtype.INTEGER,
          90,
        ),
      ],
    );

  it('Should validate parameters', () => {
    const result = CircleCI.config.Validator.validateGenerable(
      CircleCI.config.mapping.GenerableType.CUSTOM_PARAMETERS_LIST,
      parametersIn,
      CircleCI.config.mapping.ParameterizedComponent.PIPELINE,
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

    const result = CircleCI.config.Validator.validateGenerable(
      CircleCI.config.mapping.GenerableType.CUSTOM_PARAMETER,
      parameterIn,
      CircleCI.config.mapping.ParameterizedComponent.PIPELINE,
    );

    expect(result).toEqual(true);
  });

  it('Should not validate float parameters', () => {
    const parameterIn = yamlParse(`
    type: integer
    default: 1.01`);

    const result = CircleCI.config.Validator.validateGenerable(
      CircleCI.config.mapping.GenerableType.CUSTOM_PARAMETER,
      parameterIn,
      CircleCI.config.mapping.ParameterizedComponent.PIPELINE,
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
  const expectedParameter = new CircleCI.parameters.CustomParameter(
    parameterName,
    parameterType,
    parameterValue,
  );

  [
    CircleCI.config.mapping.ParameterSubtype.INTEGER,
    CircleCI.config.mapping.ParameterizedComponent.PIPELINE,
    CircleCI.config.mapping.ParameterizedComponent.JOB,
    CircleCI.config.mapping.ParameterizedComponent.COMMAND,
    CircleCI.config.mapping.ParameterizedComponent.EXECUTOR,
  ].map((subtype) =>
    it(`Should validate integer parameter with subtype ${subtype}`, () => {
      const result = CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.CUSTOM_PARAMETER,
        parameterIn,
        CircleCI.config.mapping.ParameterSubtype.INTEGER,
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
  const expectedParameter = new CircleCI.parameters.CustomParameter(
    parameterName,
    parameterType,
    parameterValue,
  );

  it('Should validate string parameter', () => {
    const result = CircleCI.config.Validator.validateGenerable(
      CircleCI.config.mapping.GenerableType.CUSTOM_PARAMETER,
      parameterIn,
      CircleCI.config.mapping.ParameterSubtype.STRING,
    );

    expect(result).toEqual(true);
  });

  [
    CircleCI.config.mapping.ParameterSubtype.STRING,
    CircleCI.config.mapping.ParameterizedComponent.PIPELINE,
    CircleCI.config.mapping.ParameterizedComponent.JOB,
    CircleCI.config.mapping.ParameterizedComponent.COMMAND,
    CircleCI.config.mapping.ParameterizedComponent.EXECUTOR,
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
  const expectedParameter = new CircleCI.parameters.CustomParameter(
    parameterName,
    parameterType,
    parameterValue,
  );

  [
    CircleCI.config.mapping.ParameterSubtype.BOOLEAN,
    CircleCI.config.mapping.ParameterizedComponent.PIPELINE,
    CircleCI.config.mapping.ParameterizedComponent.JOB,
    CircleCI.config.mapping.ParameterizedComponent.COMMAND,
  ].map((subtype) =>
    it(`Should validate boolean parameter with subtype ${subtype}`, () => {
      const result = CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.CUSTOM_PARAMETER,
        parameterIn,
        CircleCI.config.mapping.ParameterSubtype.BOOLEAN,
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
  const expectedParameter = new CircleCI.parameters.CustomEnumParameter(
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
    CircleCI.config.mapping.ParameterizedComponent.PIPELINE,
    CircleCI.config.mapping.ParameterizedComponent.JOB,
    CircleCI.config.mapping.ParameterizedComponent.COMMAND,
    CircleCI.config.mapping.ParameterizedComponent.EXECUTOR,
  ].map((subtype) =>
    it(`Should validate env_var_name parameter with subtype ${subtype}`, () => {
      const result = CircleCI.config.Validator.validateGenerable(
        subtype
          ? CircleCI.config.mapping.GenerableType.CUSTOM_PARAMETER
          : CircleCI.config.mapping.GenerableType.CUSTOM_ENUM_PARAMETER,
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
  const expectedParameter = new CircleCI.parameters.CustomParameter(
    parameterName,
    parameterType,
    parameterValue,
  );

  [
    CircleCI.config.mapping.ParameterSubtype.ENV_VAR_NAME, // this will can be assumed
    CircleCI.config.mapping.ParameterizedComponent.JOB,
    CircleCI.config.mapping.ParameterizedComponent.COMMAND,
  ].map((subtype) =>
    it(`Should validate env_var_name parameter with subtype ${subtype}`, () => {
      const result = CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.CUSTOM_PARAMETER,
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
