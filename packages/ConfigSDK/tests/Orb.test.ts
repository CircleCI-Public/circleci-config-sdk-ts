import { parse } from 'yaml';
import * as CircleCI from '../index';

describe('Use an OrbImport within a config', () => {
  const orbName = 'my-orb';
  const orbNamespace = 'circleci';
  const orbVersion = '1.0.0';
  // TODO: Add a parser for this
  const manifest: CircleCI.types.orb.OrbImportManifest = {
    jobs: {
      say_hello: new CircleCI.parameters.CustomParametersList([
        new CircleCI.parameters.CustomParameter('greeting', 'string'),
      ]),
    },
    commands: {
      say_it: new CircleCI.parameters.CustomParametersList([
        new CircleCI.parameters.CustomParameter('what', 'string'),
      ]),
    },
    executors: {
      python: new CircleCI.parameters.CustomParametersList([
        new CircleCI.parameters.CustomParameter('greeting', 'string', '1.0.0'),
      ]),
    },
  };
  const exampleOrb = new CircleCI.orb.OrbImport(
    orbName,
    orbNamespace,
    orbName,
    manifest,
    orbVersion,
  );

  const exampleOrb2 = new CircleCI.orb.OrbImport(
    'my-orb-aliased',
    orbNamespace,
    orbName,
    manifest,
    '1.1.1',
  );

  it('Should match expected shape', () => {
    expect(exampleOrb.generate()).toEqual({
      [orbName]: `${orbNamespace}/${orbName}@${orbVersion}`,
    });
  });

  it('OrbImport should have static properties', () => {
    expect(exampleOrb.generableType).toBe(
      CircleCI.mapping.GenerableType.ORB_IMPORT,
    );
  });

  const sayHelloJob = exampleOrb.jobs['say_hello'];
  const pythonExecutor = exampleOrb.executors['python'];
  const sayItCommand = exampleOrb.commands['say_it'];

  it('OrbRef should have static properties', () => {
    expect(sayHelloJob instanceof CircleCI.orb.OrbRef).toBe(true);
    expect(sayHelloJob.parameters.parameters.length).toBe(1);
    expect(sayHelloJob.orb.name).toBe(orbName);
    expect(sayHelloJob.generableType).toBe(
      CircleCI.mapping.GenerableType.ORB_REF,
    );
  });

  const config = new CircleCI.Config();

  config.importOrb(exampleOrb);
  config.importOrb(exampleOrb2);

  const job = new CircleCI.Job(
    'test',
    new CircleCI.reusable.ReusedExecutor(pythonExecutor, { version: '1.2.3' }),
    [
      new CircleCI.reusable.ReusedCommand(sayItCommand, {
        what: 'cheese',
      }),
    ],
  );

  const workflow = new CircleCI.Workflow('default', [
    new CircleCI.workflow.WorkflowJob(exampleOrb.jobs['say_hello'], {
      greeting: 'hello',
    }),
  ]);

  workflow.addJob(job);
  config.addJob(job);
  config.addWorkflow(workflow);

  it('Should produce a config with Orb import and usages', () => {
    const expected = {
      version: 2.1,
      setup: false,
      jobs: {
        test: {
          executor: {
            name: 'my-orb/python',
            version: '1.2.3',
          },
          steps: [
            {
              'my-orb/say_it': { what: 'cheese' },
            },
          ],
        },
      },
      workflows: {
        default: {
          jobs: [
            {
              'my-orb/say_hello': { greeting: 'hello' },
            },
            'test',
          ],
        },
      },
      orbs: {
        [orbName]: `${orbNamespace}/${orbName}@${orbVersion}`,
        'my-orb-aliased': `${orbNamespace}/${orbName}@1.1.1`,
      },
    };
    expect(parse(config.generate())).toEqual(expected);
  });
});
