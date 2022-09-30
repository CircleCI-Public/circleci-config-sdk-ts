import * as YAML from 'yaml';
import * as CircleCI from '../src/index';

describe('Instantiate Docker Executor', () => {
  const docker = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  const expectedShape = {
    docker: [{ image: 'cimg/node:lts' }],
    resource_class: 'medium',
  };

  it('Should match the expected output', () => {
    expect(docker.generate()).toEqual(expectedShape);
  });

  const dockerWithEnv = new CircleCI.executors.DockerExecutor('cimg/node:lts');
  dockerWithEnv.addEnvVar('MY_VAR', 'my value');
  const expectedShapeWithEnv = {
    docker: [
      {
        image: 'cimg/node:lts',
        environment: {
          MY_VAR: 'my value',
        },
      },
    ],
    resource_class: 'medium',
  };

  it('Should match the expected output with env var', () => {
    expect(dockerWithEnv.generate()).toEqual(expectedShapeWithEnv);
  });

  it('Docker executor should be instance of an Executor', () => {
    expect(docker instanceof CircleCI.executors.Executor).toBeTruthy();
  });

  const dockerWithMultipleImage = new CircleCI.executors.DockerExecutor(
    'cimg/node:lts',
  );
  dockerWithMultipleImage.addServiceImage({
    image: 'cimg/mysql:5.7',
  });
  const expectedShapeWithMultipleImage = {
    docker: [
      {
        image: 'cimg/node:lts',
      },
      {
        image: 'cimg/mysql:5.7',
      },
    ],
    resource_class: 'medium',
  };

  it('Should match the expected outputh with two images', () => {
    expect(dockerWithMultipleImage.generate()).toEqual(
      expectedShapeWithMultipleImage,
    );
  });

  const reusableExecutor = new CircleCI.reusable.ReusableExecutor(
    'default',
    docker,
  );

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(reusableExecutor);
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });

  it('Should generate without parameters', () => {
    expect(reusableExecutor.generate()).toEqual({
      default: {
        docker: [{ image: 'cimg/node:lts' }],
        resource_class: 'medium',
      },
    });
  });

  it('Should have the correct static properties for persist', () => {
    expect(docker.generableType).toBe(
      CircleCI.mapping.GenerableType.DOCKER_EXECUTOR,
    );
  });
});

describe('Instantiate Machine Executor', () => {
  const machine = new CircleCI.executors.MachineExecutor();
  const expectedShape = {
    machine: { image: 'ubuntu-2004:202010-01' },
    resource_class: 'medium',
  };

  it('Should match the expected output', () => {
    expect(machine.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.reusable.ReusableExecutor('default', machine),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });

  it('Should have the correct static properties for persist', () => {
    expect(machine.generableType).toBe(
      CircleCI.mapping.GenerableType.MACHINE_EXECUTOR,
    );
  });
});

describe('Instantiate MacOS Executor', () => {
  const macos = new CircleCI.executors.MacOSExecutor('13.0.0');
  const expectedShape = {
    macos: {
      xcode: '13.0.0',
    },
    resource_class: 'medium',
  };

  it('Should match the expected output', () => {
    expect(macos.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.reusable.ReusableExecutor('default', macos),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });

  it('Should have the correct static properties for persist', () => {
    expect(macos.generableType).toBe(
      CircleCI.mapping.GenerableType.MACOS_EXECUTOR,
    );
  });
});

describe('Instantiate Large MacOS Executor', () => {
  const macos = new CircleCI.executors.MacOSExecutor('13.0.0', 'large');
  const expectedShape = {
    macos: {
      xcode: '13.0.0',
    },
    resource_class: 'large',
  };

  it('Should match the expected output', () => {
    expect(macos.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.reusable.ReusableExecutor('default', macos),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });
});

/**
  This test is an edge case where the shell parameter is manually removed from the executor
  Parsing is not applicable to this test
*/
describe('Instantiate Windows Executor and override shell', () => {
  const windows = new CircleCI.executors.WindowsExecutor();

  const expectedShape = {
    machine: {
      image: 'windows-server-2019-vs2019:stable',
    },
    resource_class: 'windows.medium',
    shell: 'powershell.exe',
    steps: [],
  };

  const job = new CircleCI.Job('test', windows, [], {
    shell: 'powershell.exe',
  });

  it('Should match the expected output', () => {
    expect(job.generateContents()).toEqual(expectedShape);
  });

  it('Should have the correct static properties for persist', () => {
    expect(windows.generableType).toBe(
      CircleCI.mapping.GenerableType.WINDOWS_EXECUTOR,
    );
  });
});

describe('Instantiate Windows Executor', () => {
  const windows = new CircleCI.executors.WindowsExecutor();
  const expectedShape = {
    machine: {
      image: 'windows-server-2019-vs2019:stable',
    },
    resource_class: 'windows.medium',
    shell: 'powershell.exe -ExecutionPolicy Bypass',
  };

  it('Should match the expected output', () => {
    expect(windows.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.reusable.ReusableExecutor('default', windows),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });
});

describe('Instantiate a 2xlarge Docker Executor', () => {
  const xxlDocker = new CircleCI.executors.DockerExecutor(
    'cimg/node:lts',
    '2xlarge',
  );

  const expectedShape = {
    docker: [{ image: 'cimg/node:lts' }],
    resource_class: '2xlarge',
  };

  it('Should match the expected output', () => {
    expect(xxlDocker.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig.addReusableExecutor(
      new CircleCI.reusable.ReusableExecutor('default', xxlDocker),
    );
    expect(myConfig.executors?.length).toBeGreaterThan(0);
  });
});

describe('Instantiate Large Machine Executor', () => {
  const machineLarge = new CircleCI.executors.MachineExecutor('large');
  const expectedShapeLarge = {
    machine: {
      image: 'ubuntu-2004:202010-01',
    },
    resource_class: 'large',
  };

  it('Should match the expected large machine', () => {
    expect(machineLarge.generate()).toEqual(expectedShapeLarge);
  });

  const machineMedium = new CircleCI.executors.MachineExecutor('medium');
  const expectedShapeMedium = {
    machine: {
      image: 'ubuntu-2004:202010-01',
    },
    resource_class: 'medium',
  };

  it('Should match the expected output', () => {
    expect(machineMedium.generate()).toEqual(expectedShapeMedium);
  });

  it('Add executors to config and validate', () => {
    const myConfig = new CircleCI.Config();
    myConfig
      .addReusableExecutor(
        new CircleCI.reusable.ReusableExecutor('machine_large', machineLarge),
      )
      .addReusableExecutor(
        new CircleCI.reusable.ReusableExecutor('machine_medium', machineMedium),
      );
    expect(myConfig.executors?.length).toBe(2);
  });
});

describe('Generate a config with a Reusable Executor with parameters', () => {
  const machine = new CircleCI.executors.MachineExecutor('large');
  const reusable = new CircleCI.reusable.ReusableExecutor(
    'default',
    machine,
    new CircleCI.parameters.CustomParametersList(),
  );
  const expectedUsageShape = {
    executor: 'default',
  };

  it('Should match the expected output in job context', () => {
    expect(reusable.reuse().generate(true)).toEqual(expectedUsageShape);
  });

  it('Should match the expected output with no context', () => {
    const expectedShape = {
      default: {
        machine: {
          image: 'ubuntu-2004:202010-01',
        },
        resource_class: 'large',
        parameters: {},
      },
    };
    expect(reusable.generate()).toEqual(expectedShape);
  });

  const myConfig = new CircleCI.Config();
  myConfig.addReusableExecutor(reusable);

  const executorsList = {
    default: {
      machine: {
        image: 'ubuntu-2004:202010-01',
      },
      resource_class: 'large',
      parameters: {},
    },
  };

  it('Should produce a config with executors', () => {
    const expectedConfigShape = {
      version: 2.1,
      setup: false,
      executors: executorsList,
      jobs: {},
      workflows: {},
    };
    expect(YAML.parse(myConfig.stringify())).toEqual(expectedConfigShape);
  });

  it('Should have the correct static properties for persist', () => {
    expect(reusable.generableType).toBe(
      CircleCI.mapping.GenerableType.REUSABLE_EXECUTOR,
    );
  });
});

describe('Generate a config with a Reusable Executor', () => {
  const myConfig = new CircleCI.Config();

  const machine = new CircleCI.executors.MachineExecutor(
    'large',
  ).setDockerLayerCaching(true);

  const dockerBase = new CircleCI.executors.DockerExecutor(
    'cimg/base:<< parameters.tag >>',
  );
  const reusableMachine = new CircleCI.reusable.ReusableExecutor(
    'default',
    machine,
  );

  const reusableBase = dockerBase.toReusable('base');

  reusableMachine.defineParameter('version', 'string');
  myConfig.addReusableExecutor(reusableMachine);
  reusableBase.defineParameter('tag', 'string', 'latest', undefined);
  myConfig.addReusableExecutor(reusableBase);
  const reusedBase = new CircleCI.reusable.ReusedExecutor(reusableBase);

  it('Should have correct static properties', () => {
    expect(reusedBase.generableType).toEqual(
      CircleCI.mapping.GenerableType.REUSED_EXECUTOR,
    );
    expect(
      reusedBase.executor instanceof CircleCI.reusable.ReusableExecutor,
    ).toEqual(true);
    expect(reusedBase.parameters === undefined).toEqual(true);
  });

  it('Should have correct static properties', () => {
    expect(reusedBase.generableType).toEqual(
      CircleCI.mapping.GenerableType.REUSED_EXECUTOR,
    );
    expect(
      reusedBase.executor instanceof CircleCI.reusable.ReusableExecutor,
    ).toEqual(true);
    expect(reusedBase.parameters === undefined).toEqual(true);
  });

  it('Should produce a config with executors', () => {
    const expected = {
      version: 2.1,
      setup: false,
      executors: {
        base: {
          docker: [{ image: 'cimg/base:<< parameters.tag >>' }],
          resource_class: 'medium',
          parameters: {
            tag: {
              type: 'string',
              default: 'latest',
            },
          },
        },
        default: {
          machine: {
            image: 'ubuntu-2004:202010-01',
            docker_layer_caching: true,
          },
          parameters: {
            version: {
              type: 'string',
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
