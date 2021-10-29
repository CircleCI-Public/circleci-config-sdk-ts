import * as CircleCI from '../src/index';
import * as YAML from 'yaml';
import { PrimitiveParameter } from '../src/lib/Components/Parameters/Parameters.types';

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

describe('Instantiate Docker Job With Custom Parameters', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo << parameters.greeting >>',
  });
  const stringParam =
    new CircleCI.parameters.CustomParameter<PrimitiveParameter>(
      'greeting',
      'string',
      'hello world',
    );
  const parameters =
    new CircleCI.parameters.CustomParametersList<PrimitiveParameter>(
      stringParam,
    );
  const job = new CircleCI.ParameterizedJob('my-job', docker, parameters, [
    helloWorld,
  ]);
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
  it('Add job to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addJob(job);
    expect(myConfig.jobs.length).toBeGreaterThan(0);
  });
});
