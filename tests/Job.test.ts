import * as YAML from 'yaml';
import * as CircleCI from '../src/index';
import { CustomParametersList } from '../src/lib/Components/Parameters';

describe('Instantiate Docker Job', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const expectedOutput = `my-job:
  docker:
    - image: cimg/node:lts
  resource_class: medium
  steps:
    - run:
        command: echo hello world`;

  it('Should match the expected output', () => {
    expect(job.generate()).toEqual(YAML.parse(expectedOutput));
  });
  it('Add job to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addJob(job);
    expect(myConfig.jobs.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Parameterized Docker Job With Custom Parameters', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo << parameters.greeting >>',
  });

  const job = new CircleCI.ParameterizedJob('my-job', docker);

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
    - run:
        command: echo << parameters.greeting >>`;

  it('Should match the expected output', () => {
    expect(job.generate()).toEqual(YAML.parse(expectedOutput));
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
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
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
            run: {
              command: 'echo << parameters.greeting >>',
            },
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
    myConfig.addJob(job);
    myConfig.addCustomCommand(customCommand);
    expect(YAML.parse(myConfig.stringify())).toEqual(expectedOutput);
  });
});
