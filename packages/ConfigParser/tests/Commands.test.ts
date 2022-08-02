import { parse } from 'yaml';
import * as CircleCI from '@circleci/circleci-config-sdk';
import * as ConfigParser from '../index';

describe('Parse a "run" step', () => {
  const run = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const expectedResult = { run: 'echo hello world' };

  it('Should parse and match example', () => {
    expect(ConfigParser.parsers.parseStep('run', expectedResult.run)).toEqual(
      run,
    );
  });

  it('Should have the correct static properties', () => {
    expect(run.generableType).toBe(CircleCI.mapping.GenerableType.RUN);
    expect(run.name).toBe('run');
  });
});

describe('Parse a "checkout" step', () => {
  const checkout = new CircleCI.commands.Checkout();
  const checkoutBasicResult = { checkout: {} };
  const checkoutWithPath = new CircleCI.commands.Checkout({ path: './src' });

  it('Should produce checkout string', () => {
    expect(checkout.generate()).toEqual(checkoutBasicResult);
  });

  it('Should parse steps list with command as string from YAML parse result and match raw example', () => {
    expect(
      ConfigParser.parsers.parseSteps(
        parse(`steps:
    - checkout
    `).steps,
      ),
    ).toEqual([checkout]);
  });

  it('Should parse and match example with provided path', () => {
    expect(
      ConfigParser.parsers.parseStep('checkout', { path: './src' }),
    ).toEqual(checkoutWithPath);
  });
});

describe('Parse a "setup_remote_docker" step', () => {
  const srdExample = new CircleCI.commands.SetupRemoteDocker();
  const srdResult = {
    setup_remote_docker: {
      version: '20.10.6',
    },
  };
  it('Should parse and match example with passed version', () => {
    expect(
      ConfigParser.parsers.parseStep(
        'setup_remote_docker',
        srdResult.setup_remote_docker,
      ),
    ).toEqual(srdExample);
  });
});

describe('Parse a "restore_cache" step', () => {
  const restoreExample = {
    restore_cache: {
      keys: ['v1-npm-deps-{{ checksum "package-lock.json" }}', 'v1-npm-deps-'],
    },
  };
  const restore_cache = new CircleCI.commands.cache.Restore({
    keys: ['v1-npm-deps-{{ checksum "package-lock.json" }}', 'v1-npm-deps-'],
  });
  it('Should parse and match example', () => {
    expect(
      ConfigParser.parsers.parseStep(
        'restore_cache',
        restoreExample.restore_cache,
      ),
    ).toEqual(restore_cache);
  });
});

describe('Parse a "save_cache" step', () => {
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
  it('Should parse and match example', () => {
    expect(
      ConfigParser.parsers.parseStep('save_cache', saveExample.save_cache),
    ).toEqual(save_cache);
  });
});

describe('Parse a "store_artifacts" step', () => {
  const storeExample = new CircleCI.commands.StoreArtifacts({
    path: 'jekyll/_site/docs/',
    destination: 'circleci-docs',
  });
  const storeResult = {
    store_artifacts: {
      path: 'jekyll/_site/docs/',
      destination: 'circleci-docs',
    },
  };
  it('Should parse and match example', () => {
    expect(
      ConfigParser.parsers.parseStep(
        'store_artifacts',
        storeResult.store_artifacts,
      ),
    ).toEqual(storeExample);
  });
});

describe('Parse "store_test_results" step', () => {
  const example = { store_test_results: { path: 'test-results' } };
  const storeTestResults = new CircleCI.commands.StoreTestResults({
    path: 'test-results',
  });
  it('Should parse and match example', () => {
    expect(
      ConfigParser.parsers.parseStep(
        'store_test_results',
        example.store_test_results,
      ),
    ).toEqual(storeTestResults);
  });
});

describe('Parse a "add_ssh_keys" step', () => {
  const sshExample = {
    add_ssh_keys: {
      fingerprints: ['b7:35:a6:4e:9b:0d:6d:d4:78:1e:9a:97:2a:66:6b:be'],
    },
  };
  const addSSHKeys = new CircleCI.commands.AddSSHKeys({
    fingerprints: ['b7:35:a6:4e:9b:0d:6d:d4:78:1e:9a:97:2a:66:6b:be'],
  });
  it('Should parse and match example', () => {
    expect(
      ConfigParser.parsers.parseStep('add_ssh_keys', sshExample.add_ssh_keys),
    ).toEqual(addSSHKeys);
  });
});

describe('Parse a Custom Command without parameters', () => {
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
  it('Should parse and match example', () => {
    expect(
      ConfigParser.parsers.parseReusableCommand('say_hello', example.say_hello),
    ).toEqual(reusableCommand);
  });
});

describe('Parse a Reusable command', () => {
  it('Should throw error when parsing without a command being declared', () => {
    expect(() => {
      ConfigParser.parsers.parseStep('say_hello', { greeting: 'hello world' });
    }).toThrowError(`Unknown native command: say_hello`);
  });

  it('Should throw error when parsing without a command being declared', () => {
    expect(() => {
      ConfigParser.parsers.parseStep(
        'say_hello',
        { greeting: 'hello world' },
        [],
      );
    }).toThrowError(`Custom Command say_hello not found in command list.`);
  });

  it('Should validate with the proper parameters', () => {
    const result = ConfigParser.Validator.validateGenerable(
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
});

describe('Parse a "attach_workspace" command', () => {
  const myExecutor = new CircleCI.executors.DockerExecutor('cimg/base:stable');
  const attachWorkspace = new CircleCI.Job('attach to workspace', myExecutor, [
    new CircleCI.commands.workspace.Attach({ at: '/tmp/workspace' }),
  ]);
  const attachExample = {
    attach_workspace: {
      at: '/tmp/workspace',
    },
  };
  expect(
    ConfigParser.parsers.parseStep(
      'attach_workspace',
      attachExample.attach_workspace,
    ),
  ).toEqual(attachWorkspace.steps[0]);
});

describe('Parse a "persist_to_workspace" command', () => {
  const myExecutor = new CircleCI.executors.DockerExecutor('cimg/base:stable');
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
  const persistExample = {
    persist_to_workspace: {
      root: 'workspace',
      paths: ['echo-output'],
    },
  };
  it('Should parse and match persistWorkspace Example', () => {
    expect(
      ConfigParser.parsers.parseStep(
        'persist_to_workspace',
        persistExample.persist_to_workspace,
      ),
    ).toEqual(persistWorkspace.steps[0]);
  });
});
