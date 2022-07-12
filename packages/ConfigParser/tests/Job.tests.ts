import * as CircleCI from '@circleci/circleci-config-sdk';
import * as ConfigParser from '../index';

describe('Parse a Docker Job', () => {
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
    expect(ConfigParser.parsers.parseJob(jobName, jobContents)).toEqual(job);
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
    const result = ConfigParser.parsers.parseJob('my_job', jobIn);

    expect(result).toEqual(job);
  });

  it('Can validate the job with a custom command step', () => {
    const result = ConfigParser.Validator.validateGenerable(
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
  // it('Can validate the job with a custom command step', () => {
  //   const validator = myConfig.getValidator();
  //   const result = validator.validateGenerable(CircleCI.mapping.GenerableType.JOB, jobIn);

  //   expect(result).toEqual(true);
  // });
  it('Can validate the job with a custom command step', () => {
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
    const job = new CircleCI.Job('my_job', docker);
    const myConfig = new CircleCI.Config();
    myConfig.addJob(job);
    myConfig.addCustomCommand(customCommand);
    const result = ConfigParser.parsers.parseJob(
      'my_job',
      jobIn,
      myConfig.commands,
      undefined,
    );

    expect(result).toEqual(job);
  });
});
