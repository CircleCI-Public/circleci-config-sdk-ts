import * as YAML from 'yaml';
import * as CircleCI from '../src/index';
import { GenerableType } from '../src/lib/Config/types/Config.types';
import { ConfigValidator } from '../src/lib/Config/ConfigValidator';

describe('Instantiate Docker Executor', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const expectedShape = {
    docker: [{ image: 'cimg/node:lts' }],
    resource_class: 'medium',
  };

  it('Should validate', () => {
    expect(
      ConfigValidator.validate(GenerableType.DOCKER_EXECUTOR, expectedShape),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.executor.parse(expectedShape)).toEqual(docker);
  });

  it('Should match the expected output', () => {
    expect(docker.generate()).toEqual(expectedShape);
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
  const expectedShape = {
    machine: { image: 'ubuntu-2004:202010-01' },
    resource_class: 'medium',
  };

  it('Should validate', () => {
    expect(
      ConfigValidator.validate(GenerableType.MACHINE_EXECUTOR, expectedShape),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.executor.parse(expectedShape)).toEqual(machine);
  });

  it('Should match the expected output', () => {
    expect(machine.generate()).toEqual(expectedShape);
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
  const expectedShape = {
    macos: {
      xcode: '13.0.0',
    },
    resource_class: 'medium',
  };

  it('Should validate', () => {
    expect(
      ConfigValidator.validate(GenerableType.MACOS_EXECUTOR, expectedShape),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.executor.parse(expectedShape)).toEqual(macos);
  });

  it('Should match the expected output', () => {
    expect(macos.generate()).toEqual(expectedShape);
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
  const expectedShape = {
    macos: {
      xcode: '13.0.0',
    },
    resource_class: 'large',
  };

  it('Should validate', () => {
    expect(
      ConfigValidator.validate(GenerableType.MACOS_EXECUTOR, expectedShape),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.executor.parse(expectedShape)).toEqual(macos);
  });

  it('Should match the expected output', () => {
    expect(macos.generate()).toEqual(expectedShape);
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
  Parsing is not applicable to this test
*/
describe('Instantiate Windows Executor and remove shell', () => {
  const windows = new CircleCI.executor.WindowsExecutor();

  windows.parameters.shell = undefined;

  const expectedShape = {
    machine: {
      image: 'windows-server-2019-vs2019:stable',
    },
    resource_class: 'windows.medium',
    shell: 'powershell.exe -ExecutionPolicy Bypass',
  };

  it('Should validate', () => {
    expect(
      ConfigValidator.validate(GenerableType.WINDOWS_EXECUTOR, expectedShape),
    ).toEqual(true);
  });

  it('Should match the expected output', () => {
    expect(windows.generate()).toEqual(expectedShape);
  });
});

describe('Instantiate Windows Executor', () => {
  const windows = new CircleCI.executor.WindowsExecutor();
  const expectedShape = {
    machine: {
      image: 'windows-server-2019-vs2019:stable',
    },
    resource_class: 'windows.medium',
    shell: 'powershell.exe -ExecutionPolicy Bypass',
  };

  it('Should validate', () => {
    expect(
      ConfigValidator.validate(GenerableType.WINDOWS_EXECUTOR, expectedShape),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.executor.parse(expectedShape)).toEqual(windows);
  });

  it('Should match the expected output', () => {
    expect(windows.generate()).toEqual(expectedShape);
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

  const expectedShape = {
    docker: [{ image: 'cimg/node:lts' }],
    resource_class: '2xlarge',
  };

  it('Should validate', () => {
    expect(
      ConfigValidator.validate(GenerableType.DOCKER_EXECUTOR, expectedShape),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.executor.parse(expectedShape)).toEqual(xxlDocker);
  });

  it('Should match the expected output', () => {
    expect(xxlDocker.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.executor.ReusableExecutor('default', xxlDocker),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Large Machine Executor', () => {
  const machineLarge = new CircleCI.executor.MachineExecutor('large');
  const expectedShapeLarge = {
    machine: {
      image: 'ubuntu-2004:202010-01',
    },
    resource_class: 'large',
  };

  it('Should match the expected large machine', () => {
    expect(machineLarge.generate()).toEqual(expectedShapeLarge);
  });

  it('Should validate the large machine', () => {
    expect(
      ConfigValidator.validate(
        GenerableType.MACHINE_EXECUTOR,
        expectedShapeLarge,
      ),
    ).toEqual(true);
  });

  it('Should parse the large machine', () => {
    expect(CircleCI.executor.parse(expectedShapeLarge)).toEqual(machineLarge);
  });

  const machineMedium = new CircleCI.executor.MachineExecutor('medium');
  const expectedShapeMedium = {
    machine: {
      image: 'ubuntu-2004:202010-01',
    },
    resource_class: 'medium',
  };

  it('Should match the expected output', () => {
    expect(machineMedium.generate()).toEqual(expectedShapeMedium);
  });

  it('Should validate the medium machine', () => {
    expect(
      ConfigValidator.validate(
        GenerableType.MACHINE_EXECUTOR,
        expectedShapeMedium,
      ),
    ).toEqual(true);
  });

  it('Should parse the medium machine', () => {
    expect(CircleCI.executor.parse(expectedShapeMedium)).toEqual(machineMedium);
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
  const expectedShape = {
    executor: {
      name: 'default',
    },
  };

  it('Should match the expected output', () => {
    expect(reusable.generate()).toEqual(expectedShape);
  });

  it('Should validate', () => {
    expect(
      ConfigValidator.validate(GenerableType.REUSABLE_EXECUTOR, expectedShape),
    ).toEqual(true);
  });

  it('Should validate shapeless', () => {
    const expectedShapeless = {
      executor: 'default',
    };

    expect(
      ConfigValidator.validate(
        GenerableType.REUSABLE_EXECUTOR,
        expectedShapeless,
      ),
    ).toEqual(true);
  });

  const myConfig = new CircleCI.Config();

  myConfig.addReusableExecutor(reusable);

  it('Should produce a config with executors', () => {
    const expectedConfigShape = {
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
    expect(YAML.parse(myConfig.stringify())).toEqual(expectedConfigShape);
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
