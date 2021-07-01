import * as CircleCI from '../src/index';
import * as YAML from 'yaml';

describe('Instantiate Docker Job', () => {
  const docker = new CircleCI.Executor.DockerExecutor(
    'docker-executor',
    'cimg/node:lts',
  );
  const helloWorld = new CircleCI.Command.Run({
    command: 'echo hello world',
  });
  const job = new CircleCI.Job('my-job', docker, [helloWorld]);
  const expectedOutput = `my-job:
  executor:
    name: docker-executor
  steps:
    - run:
        command: echo hello world`;

  it('Should match the expected output', () => {
    expect(job.generate()).toEqual(YAML.parse(expectedOutput));
  });
  it('Add job to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addExecutor(docker);
    myConfig.addJob(job);
    expect(myConfig.jobs.length).toBeGreaterThan(0);
  });
});
