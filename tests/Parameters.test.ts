import * as CircleCI from '../src/index';

describe('Parse yaml pipeline parameters and validate', () => {
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

  it('Should have the correct static properties for Custom Enumerable Parameter', () => {
    expect(expectedParameters.parameters[0].generableType).toBe(
      CircleCI.mapping.GenerableType.CUSTOM_ENUM_PARAMETER,
    );
  });

  it('Should have the correct static properties for Custom Parameter List', () => {
    expect(expectedParameters.generableType).toBe(
      CircleCI.mapping.GenerableType.CUSTOM_PARAMETERS_LIST,
    );
  });

  it('Should have the correct static properties for Custom Parameter ', () => {
    expect(expectedParameters.parameters[1].generableType).toBe(
      CircleCI.mapping.GenerableType.CUSTOM_PARAMETER,
    );
  });
});
