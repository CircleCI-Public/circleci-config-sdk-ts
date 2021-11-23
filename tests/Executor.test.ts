import * as YAML from 'yaml';
import * as CircleCI from '../src/index';
import {
  DockerExecutor,
  MachineExecutor,
  MacOSExecutor,
  WindowsExecutor,
} from '../src/lib/Components/Executor';

describe('Instantiate Docker Executor', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const equivalent = {
    docker: [{ image: 'cimg/node:lts' }],
    resource_class: 'medium',
  };

  it('Should match the expected output', () => {
    const result = DockerExecutor.validate(equivalent);

    expect(result.valid).toBeTruthy();
  });

  it('Should match the expected output', () => {
    expect(docker.generate()).toEqual(equivalent);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.executor.ReusableExecutor('default', docker),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Machine Executor', () => {
  const machine = new CircleCI.executor.MachineExecutor();
  const equivalent = {
    machine: { image: 'ubuntu-2004:202010-01' },
    resource_class: 'medium',
  };

  it('Should match the expected output', () => {
    const result = MachineExecutor.validate(equivalent);

    expect(result.valid).toBeTruthy();
  });

  it('Should match the expected output', () => {
    expect(machine.generate()).toEqual(equivalent);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.executor.ReusableExecutor('default', machine),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });
});

describe('Instantiate MacOS Executor', () => {
  const macos = new CircleCI.executor.MacOSExecutor('13.0.0');
  const equivalent = {
    macos: {
      xcode: '13.0.0',
    },
    resource_class: 'medium',
  };

  it('Should match the expected output', () => {
    const result = MacOSExecutor.validate(equivalent);

    expect(result.valid).toBeTruthy();
  });

  it('Should match the expected output', () => {
    expect(macos.generate()).toEqual(equivalent);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.executor.ReusableExecutor('default', macos),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
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
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });
});

/**
  This test is an edge case where the shell parameter is manually removed from the executor
 */
describe('Instantiate Windows Executor and remove shell', () => {
  const windows = new CircleCI.executor.WindowsExecutor();

  windows.parameters.shell = undefined;

  const equivalent = {
    machine: {
      image: 'windows-server-2019-vs2019:stable',
    },
    resource_class: 'windows.medium',
    shell: 'powershell.exe -ExecutionPolicy Bypass',
  };

  it('Should match the expected output', () => {
    expect(windows.generate()).toEqual(equivalent);
  });
});

describe('Instantiate Windows Executor', () => {
  const windows = new CircleCI.executor.WindowsExecutor();
  const equivalent = {
    machine: {
      image: 'windows-server-2019-vs2019:stable',
    },
    resource_class: 'windows.medium',
    shell: 'powershell.exe -ExecutionPolicy Bypass',
  };

  it('Should match the expected output', () => {
    const result = WindowsExecutor.validate(equivalent);

    expect(result.valid).toBeTruthy();
  });

  it('Should match the expected output', () => {
    expect(windows.generate()).toEqual(equivalent);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.executor.ReusableExecutor('default', windows),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
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
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Large and Medium Machine Executor', () => {
  const machineLarge = new CircleCI.executor.MachineExecutor('large');

  it('Should match the expected output', () => {
    const expectedYAML = `
  machine:
    image: ubuntu-2004:202010-01
  resource_class: "large"`;
    expect(machineLarge.generate()).toEqual(YAML.parse(expectedYAML));
  });

  const machineMedium = new CircleCI.executor.MachineExecutor('medium');

  it('Should match the expected output', () => {
    const expectedYAML = `
  machine:
    image: ubuntu-2004:202010-01
  resource_class: "medium"`;
    expect(machineMedium.generate()).toEqual(YAML.parse(expectedYAML));
  });

  it('Add executors to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig
      .addReusableExecutor(
        new CircleCI.executor.ReusableExecutor('machine_large', machineLarge),
      )
      .addReusableExecutor(
        new CircleCI.executor.ReusableExecutor('machine_medium', machineMedium),
      );
    expect(myConfig.executors?.length).toBe(2);
  });
});

describe('Generate a config with a Reusable Executor without parameters', () => {
  const machine = new CircleCI.executor.MachineExecutor('large');
  const reusable = new CircleCI.executor.ReusableExecutor('default', machine);

  it('Should match the expected output', () => {
    const expectedYAML = `
  executor:
    name: default`;
    expect(reusable.generate()).toEqual(YAML.parse(expectedYAML));
  });

  const myConfig = new CircleCI.Config();

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
          resource_class: 'large',
        },
      },
      jobs: {},
      workflows: {},
    };
    expect(YAML.parse(myConfig.stringify())).toEqual(expected);
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
