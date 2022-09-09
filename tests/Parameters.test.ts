import * as CircleCI from '../src/index';
import { DockerExecutor } from '../src/lib/Components/Executors';

describe('Use basic custom parameters', () => {
  const parameterList =
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
        new CircleCI.parameters.CustomParameter(
          'should-run',
          CircleCI.mapping.ParameterSubtype.BOOLEAN,
          true,
        ),
        new CircleCI.parameters.CustomParameter(
          'message',
          CircleCI.mapping.ParameterSubtype.STRING,
          'Hello world!',
        ),
      ],
    );

  it('Should have the correct static properties for Custom Enumerable Parameter', () => {
    expect(parameterList.parameters[0].generableType).toBe(
      CircleCI.mapping.GenerableType.CUSTOM_ENUM_PARAMETER,
    );
  });

  it('Should have the correct static properties for Custom Parameter List', () => {
    expect(parameterList.generableType).toBe(
      CircleCI.mapping.GenerableType.CUSTOM_PARAMETERS_LIST,
    );
  });

  it('Should have the correct static properties for Custom Parameter ', () => {
    expect(parameterList.parameters[1].generableType).toBe(
      CircleCI.mapping.GenerableType.CUSTOM_PARAMETER,
    );
  });

  const expectedOutput = {
    axis: {
      type: 'enum',
      enum: ['x', 'y', 'z'],
      default: 'x',
    },
    angle: {
      type: 'integer',
      default: 90,
    },
    'should-run': {
      type: 'boolean',
      default: true,
    },
    message: {
      type: 'string',
      default: 'Hello world!',
    },
  };

  it('Should generate expected output', () => {
    expect(parameterList.generate()).toEqual(expectedOutput);
  });
});

describe('Use advanced custom parameters', () => {
  const reusableExecutor = new CircleCI.reusable.ReusableExecutor(
    'my-executor',
    new DockerExecutor('circleci/node:10.16.0'),
    new CircleCI.parameters.CustomParametersList<CircleCI.types.parameter.literals.ExecutorParameterLiteral>(
      [
        new CircleCI.parameters.CustomParameter(
          'resource_class',
          CircleCI.mapping.ParameterSubtype.STRING,
          'medium',
        ),
      ],
    ),
  );

  const parameterList =
    new CircleCI.parameters.CustomParametersList<CircleCI.types.parameter.literals.JobParameterLiteral>(
      [
        new CircleCI.parameters.CustomParameter(
          'pre-install',
          CircleCI.mapping.ParameterSubtype.STEPS,
          [
            new CircleCI.commands.workspace.Attach({ at: '/tmp' }),
            new CircleCI.commands.Checkout(),
          ],
        ),
        new CircleCI.parameters.CustomParameter(
          'executor',
          CircleCI.mapping.ParameterSubtype.EXECUTOR,
          reusableExecutor.reuse({
            resource_class: 'large',
          }),
        ),
        new CircleCI.parameters.CustomParameter(
          'secret',
          CircleCI.mapping.ParameterSubtype.ENV_VAR_NAME,
          'SUPER_SECRET',
        ),
      ],
    );

  const expectedOutput = {
    'pre-install': {
      type: 'steps',
      default: [
        {
          attach_workspace: {
            at: '/tmp',
          },
        },
        'checkout',
      ],
    },
    executor: {
      type: 'executor',
      default: {
        name: 'my-executor',
        resource_class: 'large',
      },
    },
    secret: {
      type: 'env_var_name',
      default: 'SUPER_SECRET',
    },
  };

  it('Should generate expected output', () => {
    expect(parameterList.generate()).toEqual(expectedOutput);
  });
});
