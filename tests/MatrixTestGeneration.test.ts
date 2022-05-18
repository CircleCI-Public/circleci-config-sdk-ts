import * as CircleCI from '../src/index';

// Generate a "Matrix" of Jobs with node executors, testing node versions: 13.0.0, 16.0.0, 18.0.0
describe('Generate 3 node-based jobs with different node versions', () => {
  const config = new CircleCI.config.Config();
  const nodeVersions = ['13.0.0', '16.0.0', '18.0.0'];
  const workflow = new CircleCI.workflow.Workflow('my-workflow');
  const helloWorld = new CircleCI.commands.Run({
    command: 'echo hello world',
  });

  nodeVersions.forEach((version) => {
    const docker = new CircleCI.executor.DockerExecutor(`cimg/node:${version}`);
    const job = new CircleCI.job.Job(`test-${version}`, docker, [helloWorld]);
    config.addJob(job);
    workflow.addJob(job);
  });

  config.addWorkflow(workflow);

  it('The config should contain three jobs', () => {
    expect(config.jobs.length).toEqual(3);
  });
  it('The config workflow should contain three jobs', () => {
    expect(config.workflows[0].jobs.length).toEqual(3);
  });
});
