import * as CircleCI from '../src/index';
import * as YAML from 'yaml';

describe('Instantiate Docker Executor', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');

  it('Should match the expected output', () => {
    const expectedYAML = `
  docker:
    - image: cimg/node:lts
  resource_class: "medium"`;
    expect(docker.generate()).toEqual(YAML.parse(expectedYAML));
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.executor.ReusableExecutor('default', docker),
    );
    expect(myConfig.executors.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Machine Executor', () => {
  const machine = new CircleCI.executor.MachineExecutor();

  it('Should match the expected output', () => {
    const expectedYAML = `
  machine:
    image: ubuntu-2004:202010-01
  resource_class: "medium"`;
    expect(machine.generate()).toEqual(YAML.parse(expectedYAML));
  });
  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.executor.ReusableExecutor('default', machine),
    );
    expect(myConfig.executors.length).toBeGreaterThan(0);
  });
});

describe('Instantiate MacOS Executor', () => {
  const macos = new CircleCI.executor.MacOSExecutor('13.0.0');

  it('Should match the expected output', () => {
    const expectedYAML = `
  macos:
    xcode: "13.0.0"
  resource_class: medium`;
    expect(macos.generate()).toEqual(YAML.parse(expectedYAML));
  });
  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.executor.ReusableExecutor('default', macos),
    );
    expect(myConfig.executors.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Large MacOS Executor', () => {
  const macos = new CircleCI.executor.MacOSExecutor('13.0.0', 'large');

  it('Should match the expected output', () => {
    const expectedYAML = `
  macos:
    xcode: "13.0.0"
  resource_class: large`;
    expect(macos.generate()).toEqual(YAML.parse(expectedYAML));
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.executor.ReusableExecutor('default', macos),
    );
    expect(myConfig.executors.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Windows Executor', () => {
  const windows = new CircleCI.executor.WindowsExecutor();

  it('Should match the expected output', () => {
    const expectedYAML = `
  machine:
    image: "windows-server-2019-vs2019:stable"
  resource_class: "windows.medium"
  shell: powershell.exe -ExecutionPolicy Bypass`;
    expect(windows.generate()).toEqual(YAML.parse(expectedYAML));
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.executor.ReusableExecutor('default', windows),
    );
    expect(myConfig.executors.length).toBeGreaterThan(0);
  });
});

describe('Instantiate a 2xlarge Docker Executor', () => {
  const xxlDocker = new CircleCI.executor.DockerExecutor(
    'cimg/node:lts',
    '2xlarge',
  );

  it('Should match the expected output', () => {
    const expectedYAML = `
  docker:
    - image: cimg/node:lts
  resource_class: 2xlarge`;
    expect(xxlDocker.generate()).toEqual(YAML.parse(expectedYAML));
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.executor.ReusableExecutor('default', xxlDocker),
    );
    expect(myConfig.executors.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Large Machine Executor', () => {
  const machine = new CircleCI.executor.MachineExecutor('large');

  it('Should match the expected output', () => {
    const expectedYAML = `
  machine:
    image: ubuntu-2004:202010-01
  resource_class: "large"`;
    expect(machine.generate()).toEqual(YAML.parse(expectedYAML));
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.executor.ReusableExecutor('default', machine),
    );
    expect(myConfig.executors.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Reusable Executor with parameters', () => {
  const machine = new CircleCI.executor.MachineExecutor('large');
  const reusable = new CircleCI.executor.ReusableExecutor('default', machine);

  it('Should match the expected output', () => {
    const expectedYAML = `
  executor:
    name: default`;
    expect(reusable.generate()).toEqual(YAML.parse(expectedYAML));
  });
});

describe('Generate a config with a Reusable Executor', () => {
  const myConfig = new CircleCI.Config();

  const machine = new CircleCI.executor.MachineExecutor('large');
  const reusable = new CircleCI.executor.ReusableExecutor('default', machine);

  reusable.defineParameter('version', 'string', '1.0.0', undefined);
  myConfig.addReusableExecutor(reusable);

  it('Should produce a config with executors', () => {
    const expected = {
      version: 2.1,
      setup: false,
      executors: {
        default: {
          machine: {
            image: 'ubuntu-2004:202010-01',
          },
          parameters: {
            version: {
              type: 'string',
              default: '1.0.0',
            },
          },
          resource_class: 'large',
        },
      },
      jobs: {},
      workflows: {},
    };
    expect(YAML.parse(myConfig.stringify())).toEqual(expected);
  });
});
