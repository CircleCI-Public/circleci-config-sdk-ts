import * as YAML from 'yaml';
import * as CircleCI from '../src/index';
import { GenerableType } from '../src/lib/Config/exports/Mapping';

describe('Instantiate Docker Job', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const jobName = 'my-job';
  const job = new CircleCI.Job(jobName, docker, [helloWorld]);
  const jobContents = {
    docker: [{ image: 'cimg/node:lts' }],
    resource_class: 'medium',
    steps: [{ run: 'echo hello world' }],
  };

  it('Should match the expected output', () => {
    expect(job.generate(true)).toEqual({ [jobName]: jobContents });
  });

  it('Should match the expected output', () => {
    expect(CircleCI.parsers.parseJob(jobName, jobContents)).toEqual(job);
  });

  it('Add job to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addJob(job);
    expect(myConfig.jobs.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Parameterized Docker Job With Custom Parameters', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo << parameters.greeting >>',
  });

  const job = new CircleCI.reusable.ParameterizedJob('my-job', docker);

  job.addStep(helloWorld).defineParameter('greeting', 'string', 'hello world');

  const expectedOutput = `my-job:
  parameters: 
    greeting:
      type: string
      default: hello world
  docker:
    - image: cimg/node:lts
  resource_class: medium
  steps:
    - run: echo << parameters.greeting >>`;

  it('Should match the expected output', () => {
    expect(job.generate(true)).toEqual(YAML.parse(expectedOutput));
  });

  it('Should throw error when no enum values are provided', () => {
    expect(() => {
      job.defineParameter('axis', 'enum', 'x');
    }).toThrowError('Enum type requires enum values to be defined');
  });

  it('Add job to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addJob(job);
    expect(myConfig.jobs.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Parameterized Docker Job With A Custom Command', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
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

  const job = new CircleCI.Job('my_job', docker);

  job.addStep(reusableCommand);

  const expectedOutput = {
    version: 2.1,
    setup: false,
    workflows: {},
    commands: {
      say_hello: {
        parameters: {
          greeting: {
            type: 'string',
          },
        },
        steps: [
          {
            run: 'echo << parameters.greeting >>',
          },
        ],
      },
    },
    jobs: {
      my_job: {
        docker: [{ image: 'cimg/node:lts' }],
        resource_class: 'medium',
        steps: [
          {
            say_hello: {
              greeting: 'hello world',
            },
          },
        ],
      },
    },
  };

  it('Add job to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addCustomCommand(customCommand);
    myConfig.addJob(job);
    expect(YAML.parse(myConfig.generate(true))).toEqual(expectedOutput);
  });
});

describe('Parse Parameterized Docker Job', () => {
  const job = new CircleCI.reusable.ParameterizedJob(
    'my_job',
    new CircleCI.executors.DockerExecutor('cimg/node:lts'),
    new CircleCI.parameters.CustomParametersList([
      new CircleCI.parameters.CustomParameter('greeting', 'string'),
    ]),
    [
      new CircleCI.commands.Run({
        command: 'echo << parameters.greeting >>',
      }),
    ],
  );

  const jobIn = {
    docker: [{ image: 'cimg/node:lts' }],
    resource_class: 'medium',
    steps: [
      {
        run: {
          command: 'echo << parameters.greeting >>',
        },
      },
    ],
    parameters: {
      greeting: {
        type: 'string',
      },
    },
  };

  it('Can validate the job with a custom command step', () => {
    const result = CircleCI.parsers.parseJob('my_job', jobIn);

    expect(result).toEqual(job);
  });

  it('Can validate the job with a custom command step', () => {
    const result = CircleCI.Validator.validateGenerable(
      CircleCI.mapping.GenerableType.JOB,
      jobIn,
    );

    expect(result).toEqual(true);
  });
  // TODO: Make these tests pass. Something weird with having multiple config validators
  // The test appropriately fails, but this test and the next one break each other.
  // it('Cannot validate the job when not provided a config (missing command)', () => {
  //   const result = parseJob('my_job', jobIn);

  //   expect(result).not.toEqual(job);
  // });
  // it('Fail validation when command has not been added to config', () => {
  //   const validator = myConfig.getValidator();
  //   const resultCommand = validator.validateGenerable(CircleCI.mapping.GenerableType.JOB, jobIn);

  //   expect(resultCommand).not.toEqual(true);
  // });
});

describe('Parse Docker Job With A Parameterized Custom Command', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
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

  const job = new CircleCI.Job('my_job', docker);

  job.addStep(reusableCommand);

  const jobIn = {
    docker: [{ image: 'cimg/node:lts' }],
    resource_class: 'medium',
    steps: [
      {
        say_hello: {
          greeting: 'hello world',
        },
      },
    ],
    // TODO: Fix additional properties validation passing
  };

  // CircleCI.config.ConfigValidator.getGeneric();
  const myConfig = new CircleCI.Config();

  myConfig.addJob(job);
  myConfig.addCustomCommand(customCommand);

  // it('Can validate the job with a custom command step', () => {
  //   const validator = myConfig.getValidator();
  //   const result = validator.validateGenerable(CircleCI.mapping.GenerableType.JOB, jobIn);

  //   expect(result).toEqual(true);
  // });
  it('Can validate the job with a custom command step', () => {
    const result = CircleCI.parsers.parseJob(
      'my_job',
      jobIn,
      myConfig.commands,
      undefined,
    );

    expect(result).toEqual(job);
  });

  it('Should have correct static properties', () => {
    expect(job.generableType).toEqual(GenerableType.JOB);
  });

  // TODO: Make these tests pass. Something weird with having multiple config validators
  // The test appropriately fails, but this test and the next one break each other.
  // it('Cannot validate the job when not provided a config (missing command)', () => {
  //   const result = parseJob('my_job', jobIn);

  //   expect(result).not.toEqual(job);
  // });
  // it('Fail validation when command has not been added to config', () => {
  //   const validator = myConfig.getValidator();
  //   const resultCommand = validator.validateGenerable(CircleCI.mapping.GenerableType.JOB, jobIn);

  //   expect(resultCommand).not.toEqual(true);
  // });
});
