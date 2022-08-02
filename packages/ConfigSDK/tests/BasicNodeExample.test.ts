import * as YAML from 'yaml';
import * as CircleCI from '../index';
describe('Generate a Hello World config', () => {
  // Instantiate new Config
  const myConfig = new CircleCI.Config();
  // Create new Workflow
  const myWorkflow = new CircleCI.Workflow('myWorkflow');
  myConfig.addWorkflow(myWorkflow);

  // Create an executor. Reusable.
  const nodeExecutor = new CircleCI.executors.DockerExecutor('cimg/node:lts');

  // Create Job
  const nodeTestJob = new CircleCI.Job('node-test', nodeExecutor);
  myConfig.addJob(nodeTestJob);

  // Add steps to job
  nodeTestJob
    .addStep(
      new CircleCI.commands.Run({
        command: 'npm install',
        name: 'NPM Install',
      }),
    )
    .addStep(
      new CircleCI.commands.Run({
        command: 'npm run test',
        name: 'Run tests',
      }),
    );

  // Add Jobs to Workflow
  myWorkflow.addJob(nodeTestJob);

  // const configOutputFile = myConfig.stringify()
  it('Should generate a valid config file', () => {
    const expectedResult = {
      version: 2.1,
      setup: false,
      jobs: {
        'node-test': {
          docker: [{ image: 'cimg/node:lts' }],
          resource_class: 'medium',
          steps: [
            {
              run: {
                command: 'npm install',
                name: 'NPM Install',
              },
            },
            { run: { command: 'npm run test', name: 'Run tests' } },
          ],
        },
      },
      workflows: { myWorkflow: { jobs: ['node-test'] } },
    };
    const configYAML = myConfig.generate();
    expect(YAML.parse(configYAML)).toEqual(expectedResult);
  });
});
