import { parse as yamlParse } from 'yaml';
import * as CircleCI from '../src/index';
import { ParameterizedComponent } from '../src/lib/Config/exports/Mapping';

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
    new CircleCI.parameters.CustomParametersList<CircleCI.types.parameter.literals.PipelineParameterLiteral>(
      [
        new CircleCI.parameters.CustomEnumParameter(
          'axis',
          ['x', 'y', 'z'],
          'x',
        ),
        new CircleCI.parameters.CustomParameter(
          'angle',
          CircleCI.mapping.ParameterSubtype.INTEGER,
          90,
        ),
      ],
    );

  it('Should have the correct static properties for Custom Enumerable Paramater', () => {
    expect(expectedParameters.parameters[0].generableType).toBe(
      CircleCI.mapping.GenerableType.CUSTOM_ENUM_PARAMETER,
    );
  });

  it('Should have the correct static properties for Cust Paramter List', () => {
    expect(expectedParameters.generableType).toBe(
      CircleCI.mapping.GenerableType.CUSTOM_PARAMETERS_LIST,
    );
  });

  it('Should have the correct static properties for Cust Paramter ', () => {
    expect(expectedParameters.parameters[1].generableType).toBe(
      CircleCI.mapping.GenerableType.CUSTOM_PARAMETER,
    );
  });
  it('Should validate parameters', () => {
    const result = CircleCI.Validator.validateGenerable(
      CircleCI.mapping.GenerableType.CUSTOM_PARAMETERS_LIST,
      parametersIn,
      CircleCI.mapping.ParameterizedComponent.PIPELINE,
    );

    expect(result).toEqual(true);
  });

  it('Should parse parameters', () => {
    expect(CircleCI.parsers.parseParameterList(parametersIn)).toEqual(
      expectedParameters,
    );
  });

  it('Should throw error if no parameter list is found', () => {
    expect(() => {
      CircleCI.parsers.parseParameterList(
        { invalid_parameter: {} },
        ParameterizedComponent.JOB,
      );
    }).toThrowError('Could not find valid parameter list in provided object');
  });

  it('Should validate integer parameters', () => {
    const parameterIn = yamlParse(`
    type: integer
    default: 2021`);

    const result = CircleCI.Validator.validateGenerable(
      CircleCI.mapping.GenerableType.CUSTOM_PARAMETER,
      parameterIn,
      CircleCI.mapping.ParameterizedComponent.PIPELINE,
    );

    expect(result).toEqual(true);
  });

  it('Should not validate float parameters', () => {
    const parameterIn = yamlParse(`
    type: integer
    default: 1.01`);

    const result = CircleCI.Validator.validateGenerable(
      CircleCI.mapping.GenerableType.CUSTOM_PARAMETER,
      parameterIn,
      CircleCI.mapping.ParameterizedComponent.PIPELINE,
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
    CircleCI.mapping.ParameterSubtype.INTEGER,
    CircleCI.mapping.ParameterizedComponent.PIPELINE,
    CircleCI.mapping.ParameterizedComponent.JOB,
    CircleCI.mapping.ParameterizedComponent.COMMAND,
    CircleCI.mapping.ParameterizedComponent.EXECUTOR,
  ].map((subtype) =>
    it(`Should validate integer parameter with subtype ${subtype}`, () => {
      const result = CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.CUSTOM_PARAMETER,
        parameterIn,
        CircleCI.mapping.ParameterSubtype.INTEGER,
      );

      expect(result).toEqual(true);
    }),
  );

  it('Should parse integer parameter', () => {
    expect(CircleCI.parsers.parseParameter(parameterIn, parameterName)).toEqual(
      expectedParameter,
    );
  });

  it('Should parse integer parameter', () => {
    expect(() => {
      CircleCI.parsers.parseParameter({ type: 'not_a_type' }, parameterName);
    }).toThrowError('No validator found');
  });
});

describe('Parse parameter with an invalid type', () => {
  it('Should parse integer parameter', () => {
    expect(() => {
      CircleCI.parsers.parseParameter({}, 'invalid_parameter');
    }).toThrowError('Missing type property on parameter: invalid_parameter');
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
    const result = CircleCI.Validator.validateGenerable(
      CircleCI.mapping.GenerableType.CUSTOM_PARAMETER,
      parameterIn,
      CircleCI.mapping.ParameterSubtype.STRING,
    );

    expect(result).toEqual(true);
  });

  [
    CircleCI.mapping.ParameterSubtype.STRING,
    CircleCI.mapping.ParameterizedComponent.PIPELINE,
    CircleCI.mapping.ParameterizedComponent.JOB,
    CircleCI.mapping.ParameterizedComponent.COMMAND,
    CircleCI.mapping.ParameterizedComponent.EXECUTOR,
  ].map((subtype) =>
    it(`Should parse integer parameter with subtype ${subtype}`, () => {
      expect(
        CircleCI.parsers.parseParameter(parameterIn, parameterName),
      ).toEqual(expectedParameter);
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
    CircleCI.mapping.ParameterSubtype.BOOLEAN,
    CircleCI.mapping.ParameterizedComponent.PIPELINE,
    CircleCI.mapping.ParameterizedComponent.JOB,
    CircleCI.mapping.ParameterizedComponent.COMMAND,
  ].map((subtype) =>
    it(`Should validate boolean parameter with subtype ${subtype}`, () => {
      const result = CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.CUSTOM_PARAMETER,
        parameterIn,
        CircleCI.mapping.ParameterSubtype.BOOLEAN,
      );

      expect(result).toEqual(true);
    }),
  );

  it(`Should parse boolean parameter`, () => {
    expect(CircleCI.parsers.parseParameter(parameterIn, parameterName)).toEqual(
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
    CircleCI.mapping.ParameterizedComponent.PIPELINE,
    CircleCI.mapping.ParameterizedComponent.JOB,
    CircleCI.mapping.ParameterizedComponent.COMMAND,
    CircleCI.mapping.ParameterizedComponent.EXECUTOR,
  ].map((subtype) =>
    it(`Should validate env_var_name parameter with subtype ${subtype}`, () => {
      const result = CircleCI.Validator.validateGenerable(
        subtype
          ? CircleCI.mapping.GenerableType.CUSTOM_PARAMETER
          : CircleCI.mapping.GenerableType.CUSTOM_ENUM_PARAMETER,
        parameterIn,
        subtype,
      );

      expect(result).toEqual(true);
    }),
  );

  it(`Should parse enum parameter`, () => {
    expect(CircleCI.parsers.parseParameter(parameterIn, parameterName)).toEqual(
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
    CircleCI.mapping.ParameterSubtype.ENV_VAR_NAME, // this will can be assumed
    CircleCI.mapping.ParameterizedComponent.JOB,
    CircleCI.mapping.ParameterizedComponent.COMMAND,
  ].map((subtype) =>
    it(`Should validate env_var_name parameter with subtype ${subtype}`, () => {
      const result = CircleCI.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.CUSTOM_PARAMETER,
        parameterIn,
        subtype,
      );

      expect(result).toEqual(true);
    }),
  );

  it(`Should parse env_var_name parameter`, () => {
    expect(CircleCI.parsers.parseParameter(parameterIn, parameterName)).toEqual(
      expectedParameter,
    );
  });
});
