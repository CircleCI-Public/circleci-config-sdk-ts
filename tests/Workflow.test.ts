import * as CircleCI from '../src/index';
import * as YAML from 'yaml';

describe('Instantiate Workflow', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
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
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
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

describe('Instantiate a new Workflow with a job in the constructor', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow', [job]);
  const generatedWorkflow = myWorkflow.generate();
  const expected = {
    'my-workflow': { jobs: [{ 'my-job': {} }] },
  };
  it('Should match the expected output', () => {
    expect(generatedWorkflow).toEqual(expected);
  });
});

describe('Instantiate a new Workflow with a workflow job added manually', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const workflowJob = new CircleCI.WorkflowJob(job);
  const myWorkflow = new CircleCI.Workflow('my-workflow', [workflowJob]);

  const generatedWorkflow = myWorkflow.generate();
  const expected = {
    'my-workflow': { jobs: [{ 'my-job': {} }] },
  };
  it('Should match the expected output', () => {
    expect(generatedWorkflow).toEqual(expected);
  });
});

describe('Utilize workflow job filters', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
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
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
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

describe('Instantiate a Workflow with sequential jobs', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const jobA = new CircleCI.Job('my-job-A', docker, [helloWorld]);
  const jobB = new CircleCI.Job('my-job-B', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow');
  myWorkflow.addJob(jobA);
  myWorkflow.addJob(jobB, { requires: ['my-job-A'] });
  it('Should match the expected output', () => {
    const expected = {
      'my-workflow': {
        jobs: [{ 'my-job-A': {} }, { 'my-job-B': { requires: ['my-job-A'] } }],
      },
    };
    const generatedWorkflow = myWorkflow.generate();
    expect(generatedWorkflow).toEqual(expected);
  });
});

describe('Instantiate a Workflow with 2 jobs', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({ command: 'echo hello world' });
  const jobA = new CircleCI.Job('my-job-A', docker, [helloWorld]);
  const jobB = new CircleCI.Job('my-job-B', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow');
  myWorkflow.addJob(jobA, { myParam: 'my-value' });
  myWorkflow.addJob(jobB);
  it('Should match the expected output', () => {
    const expected = {
      'my-workflow': {
        jobs: [{ 'my-job-A': { myParam: 'my-value' } }, { 'my-job-B': {} }],
      },
    };
    const generatedWorkflow = myWorkflow.generate();
    expect(generatedWorkflow).toEqual(expected);
  });
});

describe('Add a job to a workflow with a custom name parameter', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow');
  myWorkflow.addJob(job, { name: 'custom-name' });
  it('Should match the expected output', () => {
    const expected = {
      'my-workflow': { jobs: [{ 'my-job': { name: 'custom-name' } }] },
    };
    const generatedWorkflow = myWorkflow.generate();
    expect(generatedWorkflow).toEqual(expected);
  });
});
