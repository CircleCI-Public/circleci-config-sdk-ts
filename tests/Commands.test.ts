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
import { CustomParametersList } from '../src/lib/Components/Parameters';

describe('Instantiate a Run step', () => {
  const run = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const runStep = run.generate();
  const expectedResult = { run: { command: 'echo hello world' } };
  it('Should generate checkout yaml', () => {
    expect(runStep).toEqual(expectedResult);
  });
});

describe('Instantiate a Checkout step', () => {
  const checkout = new CircleCI.commands.Checkout();
  it('Should produce checkout string', () => {
    expect(checkout.generate()).toEqual({ checkout: {} });
  });

  const checkoutWithPath = new CircleCI.commands.Checkout({ path: './src' });
  it('Should produce checkout with path parameter', () => {
    expect(checkoutWithPath.generate()).toEqual({
      checkout: { path: './src' },
    });
  });
});

describe('Instantiate a Setup_Remote_Docker step', () => {
  const srd = new CircleCI.commands.SetupRemoteDocker();
  it('Should produce setup_remote_docker step with the current default', () => {
    expect(srd.generate()).toEqual({
      setup_remote_docker: {
        version: '20.10.6',
      },
    });
  });
});

describe('Save and load cache', () => {
  it('Should generate save cache yaml', () => {
    const example = {
      save_cache: {
        key: 'v1-myapp-{{ arch }}-{{ checksum "project.clj" }}',
        paths: ['/home/ubuntu/.m2'],
      },
    };
    const save_cache = new CircleCI.commands.cache.Save({
      key: 'v1-myapp-{{ arch }}-{{ checksum "project.clj" }}',
      paths: ['/home/ubuntu/.m2'],
    });
    expect(example).toEqual(save_cache.generate());
  });
  it('Should generate restore cache yaml', () => {
    const example = {
      restore_cache: {
        keys: [
          'v1-npm-deps-{{ checksum "package-lock.json" }}',
          'v1-npm-deps-',
        ],
      },
    };
    const restore_cache = new CircleCI.commands.cache.Restore({
      keys: ['v1-npm-deps-{{ checksum "package-lock.json" }}', 'v1-npm-deps-'],
    });
    expect(example).toEqual(restore_cache.generate());
  });
});

describe('Store artifacts', () => {
  it('Should generate the store artifacts command', () => {
    const example = {
      store_artifacts: {
        path: 'jekyll/_site/docs/',
        destination: 'circleci-docs',
      },
    };
    const storeArtifacts = new CircleCI.commands.StoreArtifacts({
      path: 'jekyll/_site/docs/',
      destination: 'circleci-docs',
    });
    expect(example).toEqual(storeArtifacts.generate());
  });
});

describe('Store test results', () => {
  it('Should generate the test results command', () => {
    const example = { store_test_results: { path: 'test-results' } };
    const storeTestResults = new CircleCI.commands.StoreTestResults({
      path: 'test-results',
    });
    expect(example).toEqual(storeTestResults.generate());
  });

  describe('Add SSH Keys', () => {
    it('Should generate the add_ssh_keys command schema', () => {
      const example = {
        add_ssh_keys: {
          fingerprints: ['b7:35:a6:4e:9b:0d:6d:d4:78:1e:9a:97:2a:66:6b:be'],
        },
      };
      const addSSHKeys = new CircleCI.commands.AddSSHKeys({
        fingerprints: ['b7:35:a6:4e:9b:0d:6d:d4:78:1e:9a:97:2a:66:6b:be'],
      });
      expect(example).toEqual(addSSHKeys.generate());
    });
  });
});

describe('Instantiate a Blank Custom Command', () => {
  const customCommand = new CircleCI.commands.reusable.CustomCommand(
    'say_hello',
  );

  const expectedOutput = `say_hello:
  parameters: {}
  steps: []`;

  it('Should generate checkout yaml', () => {
    expect(customCommand.generate()).toEqual(parse(expectedOutput));
  });
});

describe('Instantiate a Custom Command', () => {
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo << parameters.greeting >>',
  });
  const customCommand = new CircleCI.commands.reusable.CustomCommand(
    'say_hello',
  );

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

describe('Instantiate a Custom Command', () => {
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo << parameters.greeting >>',
  });

  const customCommand = new CircleCI.commands.reusable.CustomCommand(
    'say_hello',
    [helloWorld],
    new CustomParametersList([
      new CircleCI.parameters.CustomParameter('greeting', 'string'),
    ]),
  );

  const reusableCommand = new CircleCI.commands.reusable.ReusableCommand(
    customCommand,
    { greeting: 'hello world' },
  );

  const expected = {
    say_hello: {
      greeting: 'hello world',
    },
  };

  it('Should generate checkout yaml', () => {
    expect(reusableCommand.generate()).toEqual(expected);
  });
});

/**
 * instantiate a parameter with an enum value of x y z
 */
describe('Instantiate a parameter with an enum value of x y z', () => {
  const firstCustomCommand = new CircleCI.commands.reusable.CustomCommand(
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
      - run:
          command: echo << parameters.axis >>`;

    expect(firstCustomCommand.generate()).toEqual(parse(firstExpectedOutput));
  });

  const secondCustomCommand = new CircleCI.commands.reusable.CustomCommand(
    'search_year',
  );

  secondCustomCommand.defineParameter('year', 'integer', 2021).addStep(
    new CircleCI.commands.Run({
      command: 'echo << parameters.year >>',
    }),
  );

  it('Should match generated yaml', () => {
    const secondExpectedOutput = `search_year:
    parameters:
      year:
        type: integer
        default: 2021
    steps:
      - run:
          command: echo << parameters.year >>`;

    expect(secondCustomCommand.generate()).toEqual(parse(secondExpectedOutput));
  });

  it('Add commands to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig
      .addCustomCommand(firstCustomCommand)
      .addCustomCommand(secondCustomCommand);
    expect(myConfig.commands?.length).toBe(2);
  });
});

const StringifyConfig:
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
  const expectedOutput = `run:
  command: |-
    echo "hello world 1"
    echo "hello world 2"
    echo "hello world 3"
    echo hello world 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 this string is a single line, and should output as a single line
`;
  it('Should match expectedOutput', () => {
    expect(stringify(multiLineCommand.generate(), StringifyConfig)).toEqual(
      expectedOutput,
    );
  });
});

// Test a Run command with 70 characters in the command string and ensure it remains a single string
describe('Instantiate a Run command with 70 characters in the command string and ensure it remains a single string', () => {
  const longCommand = new CircleCI.commands.Run({
    command: `echo hello world 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 this string is a single line, and should output as a single line`,
  });
  const expectedOutput = `run:
  command: echo hello world 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 this string is a single line, and should output as a single line
`;
  it('Should match expectedOutput', () => {
    expect(stringify(longCommand.generate(), StringifyConfig)).toEqual(
      expectedOutput,
    );
  });
});
