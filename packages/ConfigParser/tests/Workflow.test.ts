import * as CircleCI from '@circleci/circleci-config-sdk';
import * as ConfigParser from '../index';

describe('Parse a Workflow', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });

  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow', [job]);

  it('Should parse and match raw example', () => {
    expect(
      ConfigParser.parsers.parseWorkflow('my-workflow', { jobs: ['my-job'] }, [
        job,
      ]),
    ).toEqual(myWorkflow);
  });
});

describe('Parse a Workflow with a custom name', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow');
  myWorkflow.addJob(job, { name: 'custom-name' });
  const expected = {
    'my-workflow': { jobs: [{ 'my-job': { name: 'custom-name' } }] },
  };
  it('Should validate', () => {
    expect(
      ConfigParser.Validator.validateGenerable(
        CircleCI.mapping.GenerableType.WORKFLOW,
        expected['my-workflow'],
      ),
    ).toEqual(true);
  });
});

describe('Parse a Workflow with a job', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const myWorkflow = new CircleCI.Workflow('my-workflow', [job]);

  const workflowListShape = {
    'my-workflow': { jobs: ['my-job'] },
  };
  it('Should match the expected output', () => {
    expect(
      ConfigParser.parsers.parseWorkflowList(workflowListShape, [job])[0],
    ).toEqual(myWorkflow);
  });

  it('Should throw error if no job is provided', () => {
    expect(() => {
      ConfigParser.parsers.parseWorkflowList(workflowListShape, []);
    }).toThrowError('Job my-job not found in config');
  });
});

describe('Parse a Workflow with an approval job', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });
  const jobTest = new CircleCI.Job('test-job', docker, [helloWorld]);
  const jobDeploy = new CircleCI.Job('deploy-job', docker, [helloWorld]);
  const workflowApproval = new CircleCI.workflow.WorkflowJobApproval('on-hold');

  const myWorkflow = new CircleCI.Workflow('my-workflow', [workflowApproval]);
  myWorkflow.addJob(jobTest);
  myWorkflow.addJobApproval('on-hold-2');
  myWorkflow.addJob(jobDeploy);
  const workflowContents = {
    jobs: [
      { 'on-hold': { type: 'approval' } },
      'test-job',
      { 'on-hold-2': { type: 'approval' } },
      'deploy-job',
    ],
  };
  it('Should match the expected output', () => {
    expect(
      ConfigParser.parsers.parseWorkflow('my-workflow', workflowContents, [
        jobTest,
        jobDeploy,
      ]),
    ).toEqual(myWorkflow);
  });
});
