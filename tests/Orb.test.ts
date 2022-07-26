import { parse } from 'yaml';
import * as CircleCI from '../src/index';

describe('Use an OrbImport within a config', () => {
  const orbName = 'my-orb';
  const orbNamespace = 'circleci';
  const orbVersion = '1.0.0';
  const manifest: CircleCI.types.orb.OrbImportManifest = {
    jobs: {
      say_hello: {
        greeting: {
          type: 'string',
        },
      },
    },
    commands: {
      say_it: {
        what: {
          type: 'string',
        },
      },
    },
    executors: {
      python: {
        version: {
          type: 'string',
          default: '1.0.0',
        },
      },
    },
  };
  const exampleOrb = new CircleCI.orb.OrbImport(
    orbName,
    orbNamespace,
    orbName,
    orbVersion,
    manifest,
  );

  const exampleOrb2 = new CircleCI.orb.OrbImport(
    'my-orb-aliased',
    orbNamespace,
    orbName,
    '1.1.1',
    manifest,
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

  const orbImport = CircleCI.parsers.parseOrbImport(
    {
      'my-orb': `${orbNamespace}/${'my-orb'}@${orbVersion}`,
    },
    manifest,
  );

  it('Should match expected shape', () => {
    // needs to be compared generatively, as the OrbRef circularly imports OrbImport
    expect(orbImport?.generate()).toEqual(exampleOrb.generate());
  });

  it('Should be able to load refs from import', () => {
    const jobName = 'my-orb/say_hello';
    const jobParameters = { greeting: 'hi %user%' };
    const refShape = { [jobName]: jobParameters };
    const orbJobRef = CircleCI.parsers.parseOrbRef(refShape, 'jobs', [
      exampleOrb,
    ]);

    expect(
      orbJobRef
        ? new CircleCI.workflow.WorkflowJob(orbJobRef, jobParameters).generate()
        : undefined,
    ).toEqual(refShape);
  });

  it('Should not parse a regular job as an orb ref', () => {
    const jobName = 'say_hello';
    const jobParameters = { greeting: 'hi %user%' };
    const badJobRef = CircleCI.parsers.parseOrbRef(
      { [jobName]: jobParameters },
      'jobs',
    );

    expect(badJobRef).toEqual(undefined);
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
      new CircleCI.reusable.ReusableCommand(sayItCommand, {
        what: 'cheese',
      }),
    ],
  );

  const wfName = 'default';
  const workflow = new CircleCI.Workflow(wfName, [
    new CircleCI.workflow.WorkflowJob(exampleOrb.jobs['say_hello'], {
      greeting: 'hello',
    }),
  ]);

  const contents = workflow.generateContents();

  it('Should parse from workflow', () => {
    expect(
      CircleCI.parsers
        .parseWorkflow(wfName, contents, [], [exampleOrb])
        .generateContents(),
    ).toEqual(contents);
  });

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
