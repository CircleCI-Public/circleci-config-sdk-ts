import CircleCI from '../src/index';
import * as YAML from 'yaml';

describe('Instantiate Workflow', () => {
  const docker = new CircleCI.Executor.DockerExecutor(
    'docker-executor',
    'cimg/node:lts',
  );
  const helloWorld = new CircleCI.Command.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow');
  myWorkflow.addJob(job);
  const generatedWorkflow = myWorkflow.generate();
  const expected = `my-workflow:
  jobs:
    - my-job: {}`;
  it('Should match the expected output', () => {
    expect(generatedWorkflow).toEqual(YAML.parse(expected));
  });
});

describe('Instantiate Workflow with a custom name', () => {
  const docker = new CircleCI.Executor.DockerExecutor(
    'docker-executor',
    'cimg/node:lts',
  );
  const helloWorld = new CircleCI.Command.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow');
  myWorkflow.addJob(job, { name: 'custom-name' });
  const generatedWorkflow = myWorkflow.generate();
  const expected = {
    'my-workflow': { jobs: [{ 'my-job': { name: 'custom-name' } }] },
  };
  it('Should match the expected output', () => {
    expect(generatedWorkflow).toEqual(expected);
  });
});

describe('Utilize workflow job filters', () => {
  const docker = new CircleCI.Executor.DockerExecutor(
    'docker-executor',
    'cimg/node:lts',
  );
  const helloWorld = new CircleCI.Command.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);

  it('Should create branch filter', () => {
    const myWorkflow = new CircleCI.Workflow('my-workflow');
    myWorkflow.addJob(job, {
      filters: { branches: { only: ['/server\\/.*/'] } },
    });
    const generatedWorkflowJob = myWorkflow.jobs[0].generate();
    const expected = {
      'my-job': { filters: { branches: { only: ['/server\\/.*/'] } } },
    };
    expect(generatedWorkflowJob).toEqual(expected);
  });

  it('Should create tag filter', () => {
    const myWorkflow = new CircleCI.Workflow('my-workflow');
    myWorkflow.addJob(job, { filters: { tags: { only: ['/^v.*/'] } } });
    const generatedWorkflowJob = myWorkflow.jobs[0].generate();
    const expected = {
      'my-job': { filters: { tags: { only: ['/^v.*/'] } } },
    };
    expect(generatedWorkflowJob).toEqual(expected);
  });
});

describe('Instantiate Workflow with a manual approval job', () => {
  const docker = new CircleCI.Executor.DockerExecutor(
    'docker-executor',
    'cimg/node:lts',
  );
  const helloWorld = new CircleCI.Command.Run({
    command: 'echo hello world',
  });
  const jobTest = new CircleCI.Job('test-job', docker, [helloWorld]);
  const jobDeploy = new CircleCI.Job('deploy-job', docker, [helloWorld]);

  const myWorkflow = new CircleCI.Workflow('my-workflow');
  myWorkflow.addJob(jobTest);
  myWorkflow.addJob(new CircleCI.Job('on-hold', docker), {
    type: 'approval',
  });
  myWorkflow.addJob(jobDeploy);
  it('Should match the expected output', () => {
    const expected = {
      'my-workflow': {
        jobs: [
          { 'test-job': {} },
          { 'on-hold': { type: 'approval' } },
          { 'deploy-job': {} },
        ],
      },
    };
    const generatedWorkflow = myWorkflow.generate();
    expect(generatedWorkflow).toEqual(expected);
  });
});
