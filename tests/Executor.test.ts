import * as YAML from 'yaml';
import * as CircleCI from '../src/index';

describe('Instantiate Docker Executor', () => {
  const docker = new CircleCI.executor.DockerExecutor('cimg/node:lts');
  const expectedShape = {
    docker: [{ image: 'cimg/node:lts' }],
    resource_class: 'medium',
  };

  it('Should validate', () => {
    expect(
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.DOCKER_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.executor.parse(expectedShape)).toEqual(docker);
  });

  it('Should match the expected output', () => {
    expect(docker.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.config.Config();
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
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.MACHINE_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.executor.parse(expectedShape)).toEqual(machine);
  });

  it('Should match the expected output', () => {
    expect(machine.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.config.Config();
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
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.MACOS_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.executor.parse(expectedShape)).toEqual(macos);
  });

  it('Should match the expected output', () => {
    expect(macos.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.config.Config();
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
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.MACOS_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.executor.parse(expectedShape)).toEqual(macos);
  });

  it('Should match the expected output', () => {
    expect(macos.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.config.Config();
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
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.WINDOWS_EXECUTOR,
        expectedShape,
      ),
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
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.WINDOWS_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.executor.parse(expectedShape)).toEqual(windows);
  });

  it('Should match the expected output', () => {
    expect(windows.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.config.Config();
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
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.DOCKER_EXECUTOR,
        expectedShape,
      ),
    ).toEqual(true);
  });

  it('Should parse', () => {
    expect(CircleCI.executor.parse(expectedShape)).toEqual(xxlDocker);
  });

  it('Should match the expected output', () => {
    expect(xxlDocker.generate()).toEqual(expectedShape);
  });

  it('Add executor to config and validate', () => {
    const myConfig = new CircleCI.config.Config();
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
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.MACHINE_EXECUTOR,
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
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.MACHINE_EXECUTOR,
        expectedShapeMedium,
      ),
    ).toEqual(true);
  });

  it('Should parse the medium machine', () => {
    expect(CircleCI.executor.parse(expectedShapeMedium)).toEqual(machineMedium);
  });

  it('Add executors to config and validate', () => {
    const myConfig = new CircleCI.config.Config();
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

/**
Some how the AJV instances are getting mixed up. There must be some weird
resource allocation happening.

*/

describe('Generate a config with a Reusable Executor with parameters', () => {
  const machine = new CircleCI.executor.MachineExecutor('large');
  const reusable = new CircleCI.executor.ReusableExecutor('default', machine);

  it('Should match the expected output', () => {
    const expectedShape = {
      executor: {
        name: 'default',
      },
    };
    expect(reusable.generate()).toEqual(expectedShape);
  });

  const config = new CircleCI.config.Config();

  config.addReusableExecutor(reusable);

  it('Should validate shapeless', () => {
    const expectedShapeless = {
      executor: 'default',
    };

    expect(
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.REUSABLE_EXECUTOR,
        expectedShapeless,
      ),
    ).toEqual(true);
  });

  const myConfig = new CircleCI.config.Config();

  myConfig.addReusableExecutor(reusable);

  const executorsList = {
    default: {
      machine: {
        image: 'ubuntu-2004:202010-01',
      },
      resource_class: 'large',
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

  it('Should produce a config with executors', () => {
    expect(CircleCI.executor.parseReusableExecutors(executorsList)).toEqual(
      myConfig.executors,
    );
  });
});

describe('Generate a config with a Reusable Executor', () => {
  const myConfig = new CircleCI.config.Config();

  const machine = new CircleCI.executor.MachineExecutor('large');
  const dockerBase = new CircleCI.executor.DockerExecutor(
    'cimg/base:<< parameters.tag >>',
  );
  const reusableMachine = new CircleCI.executor.ReusableExecutor(
    'default',
    machine,
  );
  const reusableBase = new CircleCI.executor.ReusableExecutor(
    'base',
    dockerBase,
  );

  reusableMachine.defineParameter('version', 'string');
  myConfig.addReusableExecutor(reusableMachine);
  reusableBase.defineParameter('tag', 'string', 'latest', undefined);
  myConfig.addReusableExecutor(reusableBase);

  it('Should validate reusable machine image', () => {
    expect(
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.REUSABLE_EXECUTOR,
        {
          executor: {
            name: 'default',
            version: '1.2.1',
          },
        },
      ),
    ).toEqual(true);
  });

  // it('Should not validate with undefined parameter', () => {
  //   expect(
  //     CircleCI.config.Validator.validateGenerable(CircleCI.config.mapping.GenerableType.REUSABLE_EXECUTOR, {
  //       executor: {
  //         name: 'default',
  //       },
  //     }),
  //   ).not.toEqual(true);
  // });

  it('Should validate reusable base image shapeless', () => {
    expect(
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.REUSABLE_EXECUTOR,
        {
          executor: 'base',
        },
      ),
    ).toEqual(true);
  });

  it('Should validate reusable base image', () => {
    expect(
      CircleCI.config.Validator.validateGenerable(
        CircleCI.config.mapping.GenerableType.REUSABLE_EXECUTOR,
        {
          executor: {
            name: 'base',
          },
        },
      ),
    ).toEqual(true);
  });

  // TODO: Add strict parsing tests
  // it('Should not shapeless with required parameter', () => {
  //   expect(
  //     CircleCI.config.Validator.validateGenerable(GenerableType.REUSABLE_EXECUTOR, {
  //       executor: 'default',
  //     }),
  //   ).not.toEqual(true);
  // });

  // it('Should not validate with improper parameter', () => {
  //   expect(
  //     CircleCI.config.Validator.validateGenerable(GenerableType.REUSABLE_EXECUTOR, {
  //       executor: {
  //         name: 'default',
  //         version: 1.0,
  //       },
  //     }),
  //   ).not.toEqual(true);
  // });

  // it('Should not validate with undefined reusable executor', () => {
  //   expect(
  //     CircleCI.config.Validator.validateGenerable(GenerableType.REUSABLE_EXECUTOR, {
  //       executor: {
  //         name: 'undefined',
  //       },
  //     }),
  //   ).not.toEqual(true);
  // });

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
