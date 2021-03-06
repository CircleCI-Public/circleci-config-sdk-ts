import {
  CreateNodeOptions,
  DocumentOptions,
  parse,
  ParseOptions,
  Scalar,
  SchemaOptions,
  stringify,
  ToStringOptions,
} from 'yaml';
import * as CircleCI from '../src/index';

describe('Instantiate a Run step', () => {
  const run = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const runStep = run.generate(true);
  const expectedResult = { run: 'echo hello world' };
  it('Should generate checkout yaml', () => {
    expect(runStep).toEqual(expectedResult);
  });

  it('Should parse and match example', () => {
    expect(CircleCI.parsers.parseStep('run', expectedResult.run)).toEqual(run);
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

  it('Should parse and match raw example', () => {
    expect(CircleCI.parsers.parseStep('checkout')).toEqual(checkout);
  });

  it('Should parse steps list with command as string from YAML parse result and match raw example', () => {
    expect(
      CircleCI.parsers.parseSteps(
        parse(`steps:
    - checkout
    `).steps,
      ),
    ).toEqual([checkout]);
  });

  const checkoutWithPathResult = {
    checkout: { path: './src' },
  };

  const checkoutWithPath = new CircleCI.commands.Checkout({ path: './src' });
  it('Should produce checkout with path parameter', () => {
    expect(checkoutWithPath.generate()).toEqual(checkoutWithPathResult);
  });

  it('Should parse and match example with provided path', () => {
    expect(CircleCI.parsers.parseStep('checkout', { path: './src' })).toEqual(
      checkoutWithPath,
    );
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

  it('Should parse and match example with default version', () => {
    expect(CircleCI.parsers.parseStep('setup_remote_docker')).toEqual(
      srdExample,
    );
  });

  it('Should parse and match example with passed version', () => {
    expect(
      CircleCI.parsers.parseStep(
        'setup_remote_docker',
        srdResult.setup_remote_docker,
      ),
    ).toEqual(srdExample);
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

  it('Should parse and match example', () => {
    expect(
      CircleCI.parsers.parseStep('save_cache', saveExample.save_cache),
    ).toEqual(save_cache);
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

  it('Should parse and match example', () => {
    expect(
      CircleCI.parsers.parseStep('restore_cache', restoreExample.restore_cache),
    ).toEqual(restore_cache);
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

  it('Should parse and match example', () => {
    expect(
      CircleCI.parsers.parseStep(
        'store_artifacts',
        storeResult.store_artifacts,
      ),
    ).toEqual(storeExample);
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

  it('Should parse and match example', () => {
    expect(
      CircleCI.parsers.parseStep(
        'store_test_results',
        example.store_test_results,
      ),
    ).toEqual(storeTestResults);
  });
  it('Should have the correct static properties', () => {
    expect(storeTestResults.generableType).toBe(
      CircleCI.mapping.GenerableType.STORE_TEST_RESULTS,
    );
    expect(storeTestResults.name).toBe('store_test_results');
  });
});

describe('Add SSH Keys', () => {
  const example = {
    add_ssh_keys: {
      fingerprints: ['b7:35:a6:4e:9b:0d:6d:d4:78:1e:9a:97:2a:66:6b:be'],
    },
  };
  const addSSHKeys = new CircleCI.commands.AddSSHKeys({
    fingerprints: ['b7:35:a6:4e:9b:0d:6d:d4:78:1e:9a:97:2a:66:6b:be'],
  });

  it('Should generate the add_ssh_keys command schema', () => {
    expect(example).toEqual(addSSHKeys.generate());
  });

  it('Should parse and match example', () => {
    expect(
      CircleCI.parsers.parseStep('add_ssh_keys', example.add_ssh_keys),
    ).toEqual(addSSHKeys);
  });

  it('Shoould have correct properties', () => {
    expect(addSSHKeys.generableType).toBe(
      CircleCI.mapping.GenerableType.ADD_SSH_KEYS,
    );
    expect(addSSHKeys.name).toBe('add_ssh_keys');
  });
});

describe('Instantiate a Blank Custom Command', () => {
  const customCommand = new CircleCI.reusable.CustomCommand('say_hello', [
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
    expect(customCommand.generate()).toEqual(example);
  });

  it('Should parse and match example', () => {
    expect(
      CircleCI.parsers.parseCustomCommand('say_hello', example.say_hello),
    ).toEqual(customCommand);
  });

  it('Should have the correct static properties', () => {
    expect(customCommand.generableType).toBe(
      CircleCI.mapping.GenerableType.CUSTOM_COMMAND,
    );
  });
});

describe('Instantiate a Custom Command', () => {
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo << parameters.greeting >>',
  });
  const customCommand = new CircleCI.reusable.CustomCommand('say_hello');

  customCommand
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
    expect(customCommand.generate()).toEqual(parse(expectedOutput));
  });
});

describe('Instantiate a Reusable Command', () => {
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo << parameters.greeting >>',
  });

  const customCommand = new CircleCI.reusable.CustomCommand(
    'say_hello',
    [helloWorld],
    new CircleCI.parameters.CustomParametersList([
      new CircleCI.parameters.CustomParameter('greeting', 'string'),
    ]),
  );

  const reusableCommand = new CircleCI.reusable.ReusableCommand(customCommand, {
    greeting: 'hello world',
  });

  const expected = {
    say_hello: {
      greeting: 'hello world',
    },
  };

  it('Should generate checkout yaml', () => {
    expect(reusableCommand.generate()).toEqual(expected);
  });

  it('Should have the correct static properties', () => {
    expect(reusableCommand.generableType).toBe(
      CircleCI.mapping.GenerableType.REUSABLE_COMMAND,
    );
  });

  it('Should be able to generate with string name', () => {
    const reusableCommandByName = new CircleCI.reusable.ReusableCommand(
      customCommand.name,
      {
        greeting: 'hello world',
      },
    );

    expect(reusableCommandByName.generate()).toEqual(expected);
  });

  it('Should throw error when parsing without a command being declared', () => {
    expect(() => {
      CircleCI.parsers.parseStep('say_hello', { greeting: 'hello world' });
    }).toThrowError(`Unknown native command: say_hello`);
  });

  it('Should throw error when parsing without a command being declared', () => {
    expect(() => {
      CircleCI.parsers.parseStep('say_hello', { greeting: 'hello world' }, []);
    }).toThrowError(`Custom Command say_hello not found in command list.`);
  });
});
/**
 * instantiate a parameter with an enum value of x y z
 */
describe('Instantiate reusable commands', () => {
  const firstCustomCommand = new CircleCI.reusable.CustomCommand(
    'point_direction',
  );

  firstCustomCommand
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

    expect(firstCustomCommand.generate(true)).toEqual(
      parse(firstExpectedOutput),
    );
  });

  const secondCustomCommand = new CircleCI.reusable.CustomCommand(
    'search_year',
  );

  secondCustomCommand
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

    expect(secondCustomCommand.generate(true)).toEqual(
      parse(secondExpectedOutput),
    );
  });

  const myConfig = new CircleCI.Config();
  myConfig.addCustomCommand(firstCustomCommand);

  // Testing that the validator will update the schema with new command
  myConfig.addCustomCommand(secondCustomCommand);

  it('Add commands to config and validate', () => {
    expect(myConfig.commands?.length).toBe(2);
  });

  it('Should validate with the proper parameters', () => {
    const result = CircleCI.Validator.validateGenerable(
      CircleCI.mapping.GenerableType.STEP_LIST,
      [
        {
          search_year: {
            year: 2022,
            type: 'solar',
          },
        },
        {
          point_direction: {
            axis: 'x',
          },
        },
        {
          run: {
            command: 'echo "Hello, World!"',
          },
        },
      ],
    );
    expect(result).toEqual(true);
  });

  it('Should have the correct static properties', () => {
    expect(firstCustomCommand.generableType).toBe(
      CircleCI.mapping.GenerableType.CUSTOM_COMMAND,
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

const stringifyOptions:
  | (DocumentOptions &
      SchemaOptions &
      ParseOptions &
      CreateNodeOptions &
      ToStringOptions)
  | undefined = {
  defaultStringType: Scalar.PLAIN,
  lineWidth: 0,
  minContentWidth: 0,
  doubleQuotedMinMultiLineLength: 999,
};

// Test a Run command with a multi-line command string
describe('Instantiate a Run command with a multi-line command string', () => {
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
      stringify(multiLineCommand.generate(true), stringifyOptions),
    ).toEqual(expectedOutput);
  });
});

// Test a Run command with 70 characters in the command string and ensure it remains a single string
describe('Instantiate a Run command with 70 characters in the command string and ensure it remains a single string', () => {
  const longCommand = new CircleCI.commands.Run({
    command: `echo hello world 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 this string is a single line, and should output as a single line`,
  });
  const expectedOutput = `run: echo hello world 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 this string is a single line, and should output as a single line
`;
  it('Should match expectedOutput', () => {
    expect(stringify(longCommand.generate(true), stringifyOptions)).toEqual(
      expectedOutput,
    );
  });
});

// Test using Workspaces to Share Data Between Jobs and attatch workflows workspace to current conatiner.
describe('Instantiate a Run command with 70 characters in the command string and ensure it remains a single string', () => {
  const myExecutor = new CircleCI.executors.DockerExecutor('cimg/base:stable');
  const attachExample = {
    attatch_workspace: {
      at: '/tmp/workspace',
    },
  };

  const persistExample = {
    persist_to_workspace: {
      root: 'workspace',
      paths: ['echo-output'],
    },
  };

  const attatchWorkspace = new CircleCI.Job(
    'attatch to workspace',
    myExecutor,
    [new CircleCI.commands.workspace.Attach({ at: '/tmp/workspace' })],
  );

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

  it('Should parse and match attatchWorkspace Example', () => {
    expect(
      CircleCI.parsers.parseStep(
        'attach_workspace',
        attachExample.attatch_workspace,
      ),
    ).toEqual(attatchWorkspace.steps[0]);
  });

  it('Should parse and match persistWorkspace Example', () => {
    expect(
      CircleCI.parsers.parseStep(
        'persist_to_workspace',
        persistExample.persist_to_workspace,
      ),
    ).toEqual(persistWorkspace.steps[0]);
  });

  it('Should have the correct static properties for attatch workspace', () => {
    expect(attatchWorkspace.steps[0].generableType).toBe(
      CircleCI.mapping.GenerableType.ATTACH,
    );
    expect(attatchWorkspace.steps[0].name).toBe('attach_workspace');
  });

  it('Should have the correct static properties for persist', () => {
    expect(persistWorkspace.steps[0].generableType).toBe(
      CircleCI.mapping.GenerableType.PERSIST,
    );
    expect(persistWorkspace.steps[0].name).toBe('persist_to_workspace');
  });
});
