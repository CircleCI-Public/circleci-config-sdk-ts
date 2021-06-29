import CircleCI from '../src/index';
import * as YAML from 'yaml';

describe('Instantiate Docker Executor', () => {
  const docker = new CircleCI.Executor.DockerExecutor(
    'docker-executor',
    'cimg/node:lts',
  ).generate();
  const expectedYAML = `docker-executor:
  docker:
    - image: cimg/node:lts
  resource_class: "medium"`;

  it('Should match the expected output', () => {
    expect(docker).toEqual(YAML.parse(expectedYAML));
  });
});

describe('Instantiate Machine Executor', () => {
  const machine = new CircleCI.Executor.MachineExecutor(
    'machine-executor',
  ).generate();
  const expectedYAML = `machine-executor:
  machine:
    image: ubuntu-2004:202010-01
  resource_class: "medium"`;

  it('Should match the expected output', () => {
    expect(machine).toEqual(YAML.parse(expectedYAML));
  });
});

describe('Instantiate a 2xlarge Docker Executor', () => {
  const xxlDocker = new CircleCI.Executor.DockerExecutor(
    'docker-executor',
    'cimg/node:lts',
    '2xlarge',
  ).generate();
  const expectedYAML = `docker-executor:
    docker:
      - image: cimg/node:lts
    resource_class: 2xlarge`;
  it('Should match the expected output', () => {
    expect(xxlDocker).toEqual(YAML.parse(expectedYAML));
  });
});

describe('Instantiate Large Machine Executor', () => {
  const machine = new CircleCI.Executor.MachineExecutor(
    'machine-executor',
    'large',
  ).generate();
  const expectedYAML = `machine-executor:
  machine:
    image: ubuntu-2004:202010-01
  resource_class: "large"`;

  it('Should match the expected output', () => {
    expect(machine).toEqual(YAML.parse(expectedYAML));
  });
});
