import * as CircleCI from '../src/index';
import * as YAML from 'yaml';
describe('Generate a config utilizing Workspaces', () => {
  // Create a new CircleCI Config
  const myConfig = new CircleCI.Config();

  // Create a Docker-based Executor
  const myExecutor = new CircleCI.Executor.DockerExecutor(
    'my-executor',
    'cimg/base:stable',
  );
  myConfig.addExecutor(myExecutor);

  // Create Jobs
  const jobFlow = new CircleCI.Job('flow', myExecutor, [
    new CircleCI.Command.Workspace.Persist({
      root: 'workspace',
      paths: ['echo-output'],
    }),
  ]);
  myConfig.addJob(jobFlow);

  const jobDownstream = new CircleCI.Job('downstream', myExecutor, [
    new CircleCI.Command.Workspace.Attach({ at: '/tmp/workspace' }),
  ]);
  myConfig.addJob(jobDownstream);

  // Create a Workflow
  const myWorkflow = new CircleCI.Workflow('btd');
  myWorkflow.addJob(jobFlow).addJob(jobDownstream, {
    requires: ['flow'],
  });
  myConfig.addWorkflow(myWorkflow);

  it('Should generate a config matching the example with a shared workspace', () => {
    const expectedConfig = {
      version: 2.1,
      setup: false,
      executors: {
        'my-executor': {
          docker: [{ image: 'cimg/base:stable' }],
          resource_class: 'medium',
        },
      },
      jobs: {
        flow: {
          executor: { name: 'my-executor' },
          steps: [
            {
              persist_to_workspace: {
                root: 'workspace',
                paths: ['echo-output'],
              },
            },
          ],
        },
        downstream: {
          executor: { name: 'my-executor' },
          steps: [{ attach_workspace: { at: '/tmp/workspace' } }],
        },
      },
      workflows: {
        btd: {
          jobs: [{ flow: {} }, { downstream: { requires: ['flow'] } }],
        },
      },
    };
    const generatedConfig = YAML.parse(myConfig.stringify());
    expect(expectedConfig).toEqual(generatedConfig);
  });
});
