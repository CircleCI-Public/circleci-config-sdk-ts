import * as YAML from 'yaml';
import { DocumentOptions } from 'yaml';
import * as CircleCI from '../index';

describe('Instantiate a Run step', () => {
  const run = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const runStep = run.generate(true);
  const expectedResult = { run: 'echo hello world' };
  it('Should generate checkout yaml', () => {
    expect(runStep).toEqual(expectedResult);
  });

  it('Should have the correct static properties', () => {
    expect(run.generableType).toBe(CircleCI.mapping.GenerableType.RUN);
    expect(run.name).toBe('run');
  });
});

describe('Instantiate a Checkout step', () => {
  const checkout = new CircleCI.commands.Checkout();
  const checkoutBasicResult = { checkout: {} };

  it('Should produce checkout string', () => {
    expect(checkout.generate()).toEqual(checkoutBasicResult);
  });

  const checkoutWithPathResult = {
    checkout: { path: './src' },
  };

  const checkoutWithPath = new CircleCI.commands.Checkout({ path: './src' });
  it('Should produce checkout with path parameter', () => {
    expect(checkoutWithPath.generate()).toEqual(checkoutWithPathResult);
  });

  it('Should have the correct static properties', () => {
    expect(checkout.generableType).toBe(
      CircleCI.mapping.GenerableType.CHECKOUT,
    );
    expect(checkout.name).toBe('checkout');
  });
});

describe('Instantiate a Setup_Remote_Docker step', () => {
  const srdExample = new CircleCI.commands.SetupRemoteDocker();
  const srdResult = {
    setup_remote_docker: {
      version: '20.10.6',
    },
  };

  it('Should produce setup_remote_docker step with the current default', () => {
    expect(srdExample.generate()).toEqual(srdResult);
  });

  it('Should have the correct static properties', () => {
    expect(srdExample.generableType).toBe(
      CircleCI.mapping.GenerableType.SETUP_REMOTE_DOCKER,
    );
    expect(srdExample.name).toBe('setup_remote_docker');
  });
});

describe('Save and load cache', () => {
  const saveExample = {
    save_cache: {
      key: 'v1-myapp-{{ arch }}-{{ checksum "project.clj" }}',
      paths: ['/home/ubuntu/.m2'],
    },
  };
  const save_cache = new CircleCI.commands.cache.Save({
    key: 'v1-myapp-{{ arch }}-{{ checksum "project.clj" }}',
    paths: ['/home/ubuntu/.m2'],
  });

  it('Should generate save cache yaml', () => {
    expect(saveExample).toEqual(save_cache.generate());
  });

  const restoreExample = {
    restore_cache: {
      keys: ['v1-npm-deps-{{ checksum "package-lock.json" }}', 'v1-npm-deps-'],
    },
  };
  const restore_cache = new CircleCI.commands.cache.Restore({
    keys: ['v1-npm-deps-{{ checksum "package-lock.json" }}', 'v1-npm-deps-'],
  });

  it('Should generate restore cache yaml', () => {
    expect(restoreExample).toEqual(restore_cache.generate());
  });

  const restoreCacheSingle = new CircleCI.commands.cache.Restore({
    key: 'v1-npm-deps-{{ checksum "package-lock.json" }}',
  });

  const restoreExampleSingle = {
    restore_cache: {
      key: 'v1-npm-deps-{{ checksum "package-lock.json" }}',
    },
  };

  it('Should generate restore cache yaml', () => {
    expect(restoreCacheSingle.generate()).toEqual(restoreExampleSingle);
  });

  it('Should have the correct static properties for save_cache', () => {
    expect(save_cache.generableType).toBe(CircleCI.mapping.GenerableType.SAVE);
    expect(save_cache.name).toBe('save_cache');
  });

  it('Should have the correct static properties for restore_cache', () => {
    expect(restore_cache.generableType).toBe(
      CircleCI.mapping.GenerableType.RESTORE,
    );
    expect(restore_cache.name).toBe('restore_cache');
  });
});

describe('Store artifacts', () => {
  const storeResult = {
    store_artifacts: {
      path: 'jekyll/_site/docs/',
      destination: 'circleci-docs',
    },
  };
  const storeExample = new CircleCI.commands.StoreArtifacts({
    path: 'jekyll/_site/docs/',
    destination: 'circleci-docs',
  });

  it('Should generate the store artifacts command', () => {
    expect(storeResult).toEqual(storeExample.generate());
  });

  it('Should have the correct static properties', () => {
    expect(storeExample.generableType).toBe(
      CircleCI.mapping.GenerableType.STORE_ARTIFACTS,
    );
    expect(storeExample.name).toBe('store_artifacts');
  });
});

describe('Store test results', () => {
  const example = { store_test_results: { path: 'test-results' } };
  const storeTestResults = new CircleCI.commands.StoreTestResults({
    path: 'test-results',
  });

  it('Should generate the test results command', () => {
    expect(example).toEqual(storeTestResults.generate());
  });

  it('Should have the correct static properties', () => {
    expect(storeTestResults.generableType).toBe(
      CircleCI.mapping.GenerableType.STORE_TEST_RESULTS,
    );
    expect(storeTestResults.name).toBe('store_test_results');
  });
});

describe('Add SSH Keys', () => {
  const sshExample = {
    add_ssh_keys: {
      fingerprints: ['b7:35:a6:4e:9b:0d:6d:d4:78:1e:9a:97:2a:66:6b:be'],
    },
  };
  const addSSHKeys = new CircleCI.commands.AddSSHKeys({
    fingerprints: ['b7:35:a6:4e:9b:0d:6d:d4:78:1e:9a:97:2a:66:6b:be'],
  });

  it('Should generate the add_ssh_keys command schema', () => {
    expect(sshExample).toEqual(addSSHKeys.generate());
  });

  it('Should have correct properties', () => {
    expect(addSSHKeys.generableType).toBe(
      CircleCI.mapping.GenerableType.ADD_SSH_KEYS,
    );
    expect(addSSHKeys.name).toBe('add_ssh_keys');
  });
});

describe('Instantiate a Custom Command without parameters', () => {
  const reusableCommand = new CircleCI.reusable.ReusableCommand('say_hello', [
    new CircleCI.commands.Run({
      command: 'echo "Hello, World!"',
      name: 'Say hello!',
    }),
  ]);

  const example = {
    say_hello: {
      steps: [{ run: { command: 'echo "Hello, World!"', name: 'Say hello!' } }],
    },
  };

  it('Should generate checkout yaml', () => {
    expect(reusableCommand.generate()).toEqual(example);
  });

  it('Should have the correct static properties', () => {
    expect(reusableCommand.generableType).toBe(
      CircleCI.mapping.GenerableType.REUSABLE_COMMAND,
    );
  });
});

describe('Instantiate a Custom Command with parameters', () => {
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo << parameters.greeting >>',
  });
  const reusableCommand = new CircleCI.reusable.ReusableCommand('say_hello');

  reusableCommand
    .addStep(helloWorld)
    .defineParameter('greeting', 'string', 'hello world');

  const expectedOutput = `say_hello:
  parameters:
    greeting:
      type: string
      default: hello world
  steps:
    - run:
        command: echo << parameters.greeting >>`;

  it('Should generate checkout yaml', () => {
    expect(reusableCommand.generate()).toEqual(YAML.parse(expectedOutput));
  });
});

describe('Instantiate a Reusable Command', () => {
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo << parameters.greeting >>',
  });

  const reusableCommand = new CircleCI.reusable.ReusableCommand(
    'say_hello',
    [helloWorld],
    new CircleCI.parameters.CustomParametersList([
      new CircleCI.parameters.CustomParameter('greeting', 'string'),
    ]),
  );

  const reusedCommand = new CircleCI.reusable.ReusedCommand(reusableCommand, {
    greeting: 'hello world',
  });

  const expected = {
    say_hello: {
      greeting: 'hello world',
    },
  };

  it('Should generate checkout yaml', () => {
    expect(reusedCommand.generate()).toEqual(expected);
  });

  it('Should have the correct static properties', () => {
    expect(reusedCommand.generableType).toBe(
      CircleCI.mapping.GenerableType.REUSED_COMMAND,
    );
  });

  it('Should be able to generate with string name', () => {
    const reusedCommandByName = new CircleCI.reusable.ReusedCommand(
      reusableCommand.name,
      {
        greeting: 'hello world',
      },
    );

    expect(reusedCommandByName.generate()).toEqual(expected);
  });
});
/**
 * instantiate a parameter with an enum value of x y z
 */
describe('Instantiate reusable commands', () => {
  const firstReusableCommand = new CircleCI.reusable.ReusableCommand(
    'point_direction',
  );

  firstReusableCommand
    .defineParameter('axis', 'enum', 'x', undefined, ['x', 'y', 'z'])
    .defineParameter('angle', 'integer', 90)
    .addStep(
      new CircleCI.commands.Run({
        command: 'echo << parameters.axis >>',
      }),
    );

  it('Should match generated yaml', () => {
    const firstExpectedOutput = `point_direction:
    parameters:
      axis:
        type: enum
        default: 'x'
        enum: [x, y, z]
      angle:
        type: integer
        default: 90
    steps:
      - run: echo << parameters.axis >>`;

    expect(firstReusableCommand.generate(true)).toEqual(
      YAML.parse(firstExpectedOutput),
    );
  });

  const secondReusableCommand = new CircleCI.reusable.ReusableCommand(
    'search_year',
  );

  secondReusableCommand
    .defineParameter('year', 'integer')
    .defineParameter('type', 'string', 'gregorian')
    .addStep(
      new CircleCI.commands.Run({
        command: 'echo << parameters.year >>',
      }),
    );

  it('Should match generated yaml', () => {
    const secondExpectedOutput = `search_year:
    parameters:
      type:
        type: string
        default: 'gregorian'
      year:
        type: integer
    steps:
      - run: echo << parameters.year >>`;

    expect(secondReusableCommand.generate(true)).toEqual(
      YAML.parse(secondExpectedOutput),
    );
  });

  const myConfig = new CircleCI.Config();
  myConfig.addReusableCommand(firstReusableCommand);

  // Testing that the validator will update the schema with new command
  myConfig.addReusableCommand(secondReusableCommand);

  it('Add commands to config and validate', () => {
    expect(myConfig.commands?.length).toBe(2);
  });

  it('Should have the correct static properties', () => {
    expect(firstReusableCommand.generableType).toBe(
      CircleCI.mapping.GenerableType.REUSABLE_COMMAND,
    );
  });

  // TODO: Implement strict validation for the following tests to pass

  // it('Should not validate with malformed list', () => {
  //   const result = CircleCI.ConfigValidator.validateGenerable(
  //     CircleCI.mapping.GenerableType.STEP_LIST,
  //     [
  //       {
  //         search_year: {
  //           year: 2022,
  //           type: 'solar',
  //         },
  //         point_direction: {
  //           axis: 'x',
  //         },
  //       },
  //     ],
  //   );
  //   expect(result).not.toEqual(true);
  // });

  // it('Should not validate with an incorrect enum value', () => {
  //   const result = CircleCI.ConfigValidator.validateGenerable(
  //     CircleCI.mapping.GenerableType.STEP_LIST,
  //     [
  //       {
  //         search_year: {
  //           year: 2022,
  //           type: 'solar',
  //         },
  //         point_direction: {
  //           axis: 'w',
  //         },
  //       },
  //     ],
  //   );
  //   expect(result).not.toEqual(true);
  // });

  // it('Should not validate without the required parameter', () => {
  //   const result = CircleCI.ConfigValidator.validateGenerable(
  //     CircleCI.mapping.GenerableType.STEP_LIST,
  //     [
  //       {
  //         search_year: {
  //           type: 'solar',
  //         },
  //       },
  //     ],
  //   );
  //   expect(result).not.toEqual(true);
  // });

  // it('Should not validate with an improper command', () => {
  //   const result = CircleCI.ConfigValidator.validateGenerable(
  //     CircleCI.mapping.GenerableType.STEP_LIST,
  //     [
  //       {
  //         search_yaer: {
  //           year: 2022,
  //         },
  //       },
  //     ],
  //   );
  //   expect(result).not.toEqual(true);
  // });

  // it('Should not validate with an improper parameter type', () => {
  //   const result = CircleCI.ConfigValidator.validateGenerable(
  //     CircleCI.mapping.GenerableType.STEP_LIST,
  //     [
  //       {
  //         search_year: {
  //           year: '2022',
  //         },
  //       },
  //     ],
  //   );
  //   expect(result).not.toEqual(true);
  // });

  // it('Should not validate with an improper parameter', () => {
  //   const result = CircleCI.ConfigValidator.validateGenerable(
  //     CircleCI.mapping.GenerableType.STEP_LIST,
  //     [
  //       {
  //         search_year: {
  //           day: 232,
  //           year: 2022,
  //         },
  //       },
  //     ],
  //   );
  //   expect(result).not.toEqual(true);
  // });
});

// Test a Run command with a multi-line command string
describe('Instantiate a Run command with a multi-line command string', () => {
  const stringifyOptions:
    | (DocumentOptions &
        YAML.SchemaOptions &
        YAML.ParseOptions &
        YAML.CreateNodeOptions &
        YAML.ToStringOptions)
    | undefined = {
    defaultStringType: YAML.Scalar.PLAIN,
    lineWidth: 0,
    minContentWidth: 0,
    doubleQuotedMinMultiLineLength: 999,
  };
  const multiLineCommand = new CircleCI.commands.Run({
    command: `echo "hello world 1"
echo "hello world 2"
echo "hello world 3"
echo hello world 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 this string is a single line, and should output as a single line`,
  });
  const expectedOutput = `run: |-
  echo "hello world 1"
  echo "hello world 2"
  echo "hello world 3"
  echo hello world 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 this string is a single line, and should output as a single line
`;
  it('Should match expectedOutput', () => {
    expect(
      YAML.stringify(multiLineCommand.generate(true), stringifyOptions),
    ).toEqual(expectedOutput);
  });
});

// Test a Run command with 70 characters in the command string and ensure it remains a single string
describe('Instantiate a Run command with 70 characters in the command string and ensure it remains a single string', () => {
  const stringifyOptions:
    | (DocumentOptions &
        YAML.SchemaOptions &
        YAML.ParseOptions &
        YAML.CreateNodeOptions &
        YAML.ToStringOptions)
    | undefined = {
    defaultStringType: YAML.Scalar.PLAIN,
    lineWidth: 0,
    minContentWidth: 0,
    doubleQuotedMinMultiLineLength: 999,
  };
  const longCommand = new CircleCI.commands.Run({
    command: `echo hello world 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 this string is a single line, and should output as a single line`,
  });
  const expectedOutput = `run: echo hello world 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 this string is a single line, and should output as a single line
`;
  it('Should match expectedOutput', () => {
    expect(
      YAML.stringify(longCommand.generate(true), stringifyOptions),
    ).toEqual(expectedOutput);
  });
});

// Test using Workspaces to Share Data Between Jobs and attach workflows workspace to current container.
describe('Instantiate a Run command with 70 characters in the command string and ensure it remains a single string', () => {
  const myExecutor = new CircleCI.executors.DockerExecutor('cimg/base:stable');
  const attachWorkspace = new CircleCI.Job('attach to workspace', myExecutor, [
    new CircleCI.commands.workspace.Attach({ at: '/tmp/workspace' }),
  ]);

  const persistWorkspace = new CircleCI.Job(
    'persist to workspace',
    myExecutor,
    [
      new CircleCI.commands.workspace.Persist({
        root: 'workspace',
        paths: ['echo-output'],
      }),
    ],
  );

  it('Should have the correct static properties for attach workspace', () => {
    expect(attachWorkspace.steps[0].generableType).toBe(
      CircleCI.mapping.GenerableType.ATTACH,
    );
    expect(attachWorkspace.steps[0].name).toBe('attach_workspace');
  });

  it('Should have the correct static properties for persist', () => {
    expect(persistWorkspace.steps[0].generableType).toBe(
      CircleCI.mapping.GenerableType.PERSIST,
    );
    expect(persistWorkspace.steps[0].name).toBe('persist_to_workspace');
  });
});
