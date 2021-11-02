import * as CircleCI from '../src/index';
import * as YAML from 'yaml';
describe('Generate a config utilizing.workspaces', () => {
  // Create a new CircleCI Config
  const myConfig = new CircleCI.Config();

  // Create a Docker-based Executor
  const myExecutor = new CircleCI.executor.DockerExecutor('cimg/base:stable');

  // Create Jobs
  const jobFlow = new CircleCI.Job('flow', myExecutor, [
    new CircleCI.commands.workspace.Persist({
      root: 'workspace',
      paths: ['echo-output'],
    }),
  ]);
  myConfig.addJob(jobFlow);

  const jobDownstream = new CircleCI.Job('downstream', myExecutor, [
    new CircleCI.commands.workspace.Attach({ at: '/tmp/workspace' }),
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
      parameters: {},
      executors: {},
      jobs: {
        flow: {
          docker: [{ image: 'cimg/base:stable' }],
          resource_class: 'medium',
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
          docker: [{ image: 'cimg/base:stable' }],
          resource_class: 'medium',
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
